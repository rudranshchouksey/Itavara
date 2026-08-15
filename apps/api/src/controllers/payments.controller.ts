import { Request, Response } from 'express';
import { PrismaClient, Prisma } from '@prisma/client';
import { PaymentService, PaymentProviderType } from '../services/payment.service';
import { ReceiptService } from '../services/receipt.service';
import { EmailService } from '../services/email.service';

const prisma = new PrismaClient();

export const initiatePayment = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { bookingId, provider } = req.body;

    if (!bookingId || !provider) {
      return res.status(400).json({ error: 'bookingId and provider are required' });
    }

    // 1. Fetch the booking to ensure it belongs to user and is PENDING
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId }
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    if (booking.userId !== userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    if (booking.status !== 'PENDING') {
      return res.status(400).json({ error: `Cannot initiate payment for a booking with status ${booking.status}` });
    }

    const amount = Number(booking.totalPrice);
    const currency = provider === 'STRIPE' ? 'USD' : 'INR';

    // 2. Call Payment Service to get order intent
    const paymentIntent = await PaymentService.initiatePayment(booking.id, amount, currency, provider as PaymentProviderType);

    // 3. Create or Update the Transaction record
    await prisma.transaction.upsert({
      where: { bookingId: booking.id },
      update: {
        provider,
        paymentId: paymentIntent.orderId,
        status: 'PENDING'
      },
      create: {
        bookingId: booking.id,
        provider,
        paymentId: paymentIntent.orderId,
        status: 'PENDING'
      }
    });

    res.status(200).json({ intent: paymentIntent });
  } catch (error: any) {
    console.error('Error initiating payment:', error);
    res.status(500).json({ error: error.message || 'Failed to initiate payment' });
  }
};

export const verifyPayment = async (req: Request, res: Response) => {
  try {
    const provider = req.headers['x-payment-provider'] as PaymentProviderType;
    const signature = req.headers['x-payment-signature'] as string;

    if (!provider || !signature) {
      return res.status(400).json({ error: 'Missing provider or signature headers' });
    }

    // Use req.body if raw parsing is disabled, but ideally we'd use req.rawBody
    // For this stub, we just pass what we have
    const payload = (req as any).rawBody || JSON.stringify(req.body);

    // 1. Verify Webhook Signature
    const isValid = PaymentService.verifyWebhookSignature(payload, signature, provider);

    if (!isValid) {
      return res.status(400).json({ error: 'Invalid webhook signature' });
    }

    // 2. Extract bookingId and status from payload (Stub implementation)
    // In production, parse the actual webhook event object (e.g. Stripe Event, Razorpay payload)
    const { bookingId, status } = req.body;

    if (!bookingId || status !== 'SUCCESS') {
      // If it's a failure or missing ID, we might just acknowledge it
      return res.status(200).json({ received: true });
    }

    // 3. Update Transaction and Booking securely in a transaction
    const booking = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const transaction = await tx.transaction.findUnique({
        where: { bookingId }
      });

      if (!transaction) throw new Error('Transaction not found');
      if (transaction.status === 'SUCCESS') return null; // Already processed

      await tx.transaction.update({
        where: { bookingId },
        data: { status: 'SUCCESS' }
      });

      const updatedBooking = await tx.booking.update({
        where: { id: bookingId },
        include: { user: true, listing: true },
        data: { status: 'CONFIRMED' }
      });

      if (updatedBooking.referrerId) {
        const commissionPercentage = 0.05;
        const commissionAmount = Number(updatedBooking.totalPrice) * commissionPercentage;

        const wallet = await tx.wallet.upsert({
          where: { userId: updatedBooking.referrerId },
          update: { balance: { increment: commissionAmount } },
          create: {
            userId: updatedBooking.referrerId,
            balance: commissionAmount,
            currency: 'INR'
          }
        });

        await tx.walletTransaction.create({
          data: {
            walletId: wallet.id,
            amount: commissionAmount,
            type: 'COMMISSION',
            referenceBookingId: updatedBooking.id
          }
        });
      }

      return updatedBooking;
    });

    // 4. Trigger async side-effects if newly confirmed
    if (booking && booking.user?.email) {
      // Intentionally not awaiting these so the webhook responds quickly
      ReceiptService.generatePDF(booking).then(pdfBuffer => {
        EmailService.sendBookingConfirmation(booking.user.email, booking, pdfBuffer).catch(console.error);
      }).catch(console.error);
    }

    res.status(200).json({ received: true, verified: true });
  } catch (error: any) {
    console.error('Error verifying webhook:', error);
    res.status(500).json({ error: error.message || 'Failed to verify webhook' });
  }
};
