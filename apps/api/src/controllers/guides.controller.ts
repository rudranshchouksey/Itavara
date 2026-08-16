import { Request, Response } from 'express';
import { prisma } from '@itvara/db';

export const searchGuides = async (req: Request, res: Response) => {
  try {
    const { location, language, specialty, minRating } = req.query;

    const filters: any = {};

    if (location) {
      filters.serviceAreas = { has: String(location) };
    }
    if (language) {
      filters.languages = { has: String(language) };
    }
    if (specialty) {
      filters.specialties = { has: String(specialty) };
    }
    if (minRating) {
      filters.rating = { gte: parseFloat(String(minRating)) };
    }

    const guides = await prisma.guideProfile.findMany({
      where: filters,
      include: {
        user: {
          select: {
            name: true,
            profilePhoto: true,
            hometown: true
          }
        }
      },
      orderBy: {
        rating: 'desc'
      }
    });

    return res.status(200).json({ success: true, data: guides });
  } catch (error) {
    console.error('Error searching guides:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

export const hireGuide = async (req: Request, res: Response) => {
  try {
    const travelerId = (req as any).user.userId;
    const { guideId, date, durationHours, useDailyRate } = req.body;

    if (!guideId || !date || !durationHours) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    const guide = await prisma.guideProfile.findUnique({
      where: { id: guideId }
    });

    if (!guide) {
      return res.status(404).json({ success: false, error: 'Guide not found' });
    }

    // Calculate amount based on rate type
    const rate = useDailyRate ? guide.dailyRate : guide.hourlyRate;
    const totalAmount = parseFloat(rate.toString()) * (useDailyRate ? 1 : durationHours); // If daily, duration could mean days or just flat rate

    const booking = await prisma.guideHireBooking.create({
      data: {
        guideId,
        travelerId,
        date: new Date(date),
        durationHours: parseInt(durationHours, 10),
        totalAmount,
        status: 'PENDING'
      }
    });

    return res.status(201).json({ success: true, data: booking });
  } catch (error) {
    console.error('Error hiring guide:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
};
