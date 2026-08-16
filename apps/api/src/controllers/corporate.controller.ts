import { Request, Response } from 'express';
import { prisma } from '@itvara/db';
import { ListingType } from '@itvara/db';

export const createCorporateBooking = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const { listingId, checkIn, checkOut } = req.body;

    if (!listingId || !checkIn || !checkOut) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    // Check if user is a corporate employee
    const employeeRecord = await prisma.corporateEmployee.findFirst({
      where: { userId },
      include: {
        corporateAccount: {
          include: {
            bookingPolicy: true
          }
        }
      }
    });

    if (!employeeRecord) {
      return res.status(403).json({ success: false, error: 'User is not a corporate employee' });
    }

    const listing = await prisma.listing.findUnique({
      where: { id: listingId }
    });

    if (!listing) {
      return res.status(404).json({ success: false, error: 'Listing not found' });
    }

    // Enforce Corporate Policy
    const policy = employeeRecord.corporateAccount.bookingPolicy;
    if (policy) {
      // Check allowed stay types
      if (policy.allowedStayTypes.length > 0 && !policy.allowedStayTypes.includes(listing.type)) {
        return res.status(403).json({ 
          success: false, 
          error: `Corporate policy prohibits booking ${listing.type} properties.` 
        });
      }

      // Check nightly rate limits
      const effectiveLimit = employeeRecord.spendingLimitPerTrip 
        ? employeeRecord.spendingLimitPerTrip 
        : policy.maxNightlyRate;

      if (parseFloat(listing.pricePerNight.toString()) > parseFloat(effectiveLimit.toString())) {
        return res.status(403).json({ 
          success: false, 
          error: `Listing price per night (₹${listing.pricePerNight}) exceeds your corporate limit (₹${effectiveLimit}).` 
        });
      }
    }

    // Calculate days duration
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const timeDiff = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)) || 1;

    const totalPrice = parseFloat(listing.pricePerNight.toString()) * diffDays;

    const booking = await prisma.booking.create({
      data: {
        userId,
        listingId,
        checkIn: start,
        checkOut: end,
        totalPrice,
        status: 'PENDING',
        isCorporateBooking: true,
        corporateAccountId: employeeRecord.corporateAccountId
      }
    });

    return res.status(201).json({ success: true, data: booking });
  } catch (error) {
    console.error('Error creating corporate booking:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

export const getInvoices = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const { month, year } = req.query; // e.g., month=8, year=2026

    // Verify user is an ADMIN for a corporate account
    const adminRecord = await prisma.corporateEmployee.findFirst({
      where: { 
        userId,
        role: 'ADMIN'
      },
      include: {
        corporateAccount: true
      }
    });

    if (!adminRecord) {
      return res.status(403).json({ success: false, error: 'Unauthorized. Must be a corporate admin.' });
    }

    const targetDate = new Date(Number(year) || new Date().getFullYear(), Number(month) ? Number(month) - 1 : new Date().getMonth(), 1);
    const nextMonth = new Date(targetDate.getFullYear(), targetDate.getMonth() + 1, 1);

    const bookings = await prisma.booking.findMany({
      where: {
        corporateAccountId: adminRecord.corporateAccountId,
        isCorporateBooking: true,
        createdAt: {
          gte: targetDate,
          lt: nextMonth
        }
      },
      include: {
        user: { select: { name: true, email: true } },
        listing: { select: { title: true, type: true } }
      }
    });

    // Calculate Totals
    const subtotal = bookings.reduce((sum, b) => sum + parseFloat(b.totalPrice.toString()), 0);
    const gstAmount = subtotal * 0.18; // 18% GST Simulation
    const totalAmount = subtotal + gstAmount;

    const invoiceData = {
      corporateAccount: adminRecord.corporateAccount.companyName,
      billingEmail: adminRecord.corporateAccount.billingEmail,
      gstin: adminRecord.corporateAccount.gstinTaxId,
      period: targetDate.toLocaleDateString('default', { month: 'long', year: 'numeric' }),
      breakdown: {
        subtotal,
        gstRate: '18%',
        gstAmount,
        totalAmount
      },
      bookings
    };

    return res.status(200).json({ success: true, data: invoiceData });
  } catch (error) {
    console.error('Error generating corporate invoices:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
};
