import { Request, Response } from 'express';
import { calculateTripQuote, PricingParams } from '@itvara/utils';

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
