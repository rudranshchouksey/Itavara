import { Request, Response } from 'express';
import { calculateTripQuote, PricingParams } from '@itvara/utils';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const calculateQuote = async (req: Request, res: Response) => {
  try {
    const { basePricePerNight, nights, addons } = req.body;

    if (!basePricePerNight || !nights) {
      return res.status(400).json({ error: 'basePricePerNight and nights are required' });
    }

    const params: PricingParams = {
      basePricePerNight: Number(basePricePerNight),
      nights: Number(nights),
      addons: {
        cabRental: Boolean(addons?.cabRental),
        culturalAttire: Boolean(addons?.culturalAttire),
        foodCuration: Boolean(addons?.foodCuration),
        localGuide: Boolean(addons?.localGuide),
      }
    };

    const quote = calculateTripQuote(params);

    res.status(200).json({ quote });
  } catch (error) {
    console.error('Error calculating quote:', error);
    res.status(500).json({ error: 'Failed to calculate quote' });
  }
};

export const createBooking = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { listingId, checkIn, checkOut, basePricePerNight, addons, referrerId } = req.body;

    if (!listingId || !checkIn || !checkOut || !basePricePerNight) {
      return res.status(400).json({ error: 'Missing required booking fields' });
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    
    // Calculate nights
    const diffTime = Math.abs(checkOutDate.getTime() - checkInDate.getTime());
    const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const params: PricingParams = {
      basePricePerNight: Number(basePricePerNight),
      nights,
      addons: {
        cabRental: Boolean(addons?.cabRental),
        culturalAttire: Boolean(addons?.culturalAttire),
        foodCuration: Boolean(addons?.foodCuration),
        localGuide: Boolean(addons?.localGuide),
      }
    };

    const quote = calculateTripQuote(params);

    const bookingResult = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // 1. Pessimistic Row Lock: Lock the Listing row
      // This ensures no other concurrent transaction can lock this listing for booking until this completes.
      await tx.$executeRawUnsafe(`SELECT id FROM "Listing" WHERE id = $1 FOR UPDATE`, listingId);

      // 2. Check for overlapping bookings
      // Conflict condition: Existing booking overlaps with requested dates AND 
      // (status is CONFIRMED/COMPLETED OR (status is PENDING AND created < 15 mins ago))
      const fifteenMinsAgo = new Date(Date.now() - 15 * 60 * 1000);

      const conflicts = await tx.booking.findMany({
        where: {
          listingId,
          checkIn: { lt: checkOutDate },
          checkOut: { gt: checkInDate },
          OR: [
            { status: { in: ['CONFIRMED', 'COMPLETED'] } },
            {
              status: 'PENDING',
              createdAt: { gt: fifteenMinsAgo }
            }
          ]
        }
      });

      if (conflicts.length > 0) {
        throw new Error('These dates are no longer available. Please select different dates.');
      }

      // 3. Create the Booking with PENDING status
      const booking = await tx.booking.create({
        data: {
          userId,
          listingId,
          checkIn: checkInDate,
          checkOut: checkOutDate,
          totalPrice: quote.grandTotal,
          status: 'PENDING',
          referrerId: referrerId || null,
        }
      });

      // 4. Create AddOns if any
      const addonData = [];
      if (params.addons.cabRental) addonData.push({ bookingId: booking.id, type: 'CAB', price: quote.addonCab });
      if (params.addons.culturalAttire) addonData.push({ bookingId: booking.id, type: 'ATTIRE', price: quote.addonAttire });
      if (params.addons.foodCuration) addonData.push({ bookingId: booking.id, type: 'FOOD_CURATION', price: quote.addonFood });
      if (params.addons.localGuide) addonData.push({ bookingId: booking.id, type: 'GUIDE', price: quote.addonGuide });

      if (addonData.length > 0) {
        await tx.addOn.createMany({
          data: addonData
        });
      }

      return booking;
    });

    const expirationTime = new Date(bookingResult.createdAt.getTime() + 15 * 60 * 1000);

    res.status(201).json({
      message: 'Booking initialized successfully.',
      booking: bookingResult,
      expiresAt: expirationTime.toISOString(),
      quote
    });

  } catch (error: any) {
    console.error('Transaction Error (createBooking):', error);
    if (error.message.includes('dates are no longer available')) {
      return res.status(409).json({ error: error.message }); // 409 Conflict
    }
    res.status(500).json({ error: 'Failed to create booking' });
  }
};
