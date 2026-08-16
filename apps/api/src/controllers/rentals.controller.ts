import { Request, Response } from 'express';
import { prisma } from '@itvara/db';
import { RentalCategory } from '@itvara/db';

export const getRentals = async (req: Request, res: Response) => {
  try {
    const { locality, category, listingId } = req.query;

    const filters: any = {
      isAvailable: true,
    };

    if (locality) {
      filters.locality = String(locality);
    }
    
    if (category) {
      filters.category = String(category) as RentalCategory;
    }

    if (listingId) {
      filters.listingId = String(listingId);
    }

    const rentals = await prisma.rentalItem.findMany({
      where: filters,
      include: {
        host: {
          select: { name: true, profilePhoto: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return res.status(200).json({ success: true, data: rentals });
  } catch (error) {
    console.error('Error fetching rentals:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

export const bookRental = async (req: Request, res: Response) => {
  try {
    const travelerId = (req as any).user.userId;
    const { rentalItemId, stayBookingId, startDate, endDate, selectedSize } = req.body;

    if (!rentalItemId || !startDate || !endDate) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    const rentalItem = await prisma.rentalItem.findUnique({
      where: { id: rentalItemId }
    });

    if (!rentalItem) {
      return res.status(404).json({ success: false, error: 'Rental item not found' });
    }

    // Calculate days duration
    const start = new Date(startDate);
    const end = new Date(endDate);
    const timeDiff = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)) || 1; // minimum 1 day

    const totalPrice = parseFloat(rentalItem.pricePerDay.toString()) * diffDays;

    const booking = await prisma.rentalBooking.create({
      data: {
        rentalItemId,
        travelerId,
        stayBookingId: stayBookingId || null,
        startDate: start,
        endDate: end,
        selectedSize: selectedSize || null,
        totalPrice,
        status: 'PENDING'
      }
    });

    return res.status(201).json({ success: true, data: booking });
  } catch (error) {
    console.error('Error booking rental:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
};
