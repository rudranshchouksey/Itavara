import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createListing = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const {
      title,
      description,
      type,
      pricePerNight,
      address,
      latitude,
      longitude,
      maxGuests,
      bedCount,
      amenities, // Array of amenity names or IDs (we'll assume names for simplicity)
      customOptions
    } = req.body;

    // 1. Create the Listing and CustomTripOption via Prisma
    const newListing = await prisma.$transaction(async (tx) => {
      // First, find or create amenities if needed. For this example, we assume they exist or we just connect/create
      const amenityConnectOrCreate = amenities ? amenities.map((name: string) => ({
        where: { id: name }, // Typically we'd have a unique constraint on name, but let's just assume we're creating or connecting appropriately. For simplicity, we just create new ones or skip. Actually, if we don't have a unique constraint on Amenity name, we just create. 
        // Wait, Amenity has `name String` but not `@unique`. Let's just create them for the listing for simplicity.
        create: { name }
      })) : [];

      const listing = await tx.listing.create({
        data: {
          hostId: userId,
          title,
          description,
          type,
          pricePerNight,
          address,
          latitude,
          longitude,
          maxGuests,
          bedCount: bedCount || 1,
          amenities: {
            create: amenities ? amenities.map((name: string) => ({ name })) : []
          },
          customOptions: {
            create: {
              hasCabRental: customOptions?.hasCabRental || false,
              hasLocalAttire: customOptions?.hasLocalAttire || false,
              hasFoodCuration: customOptions?.hasFoodCuration || false,
              hasLocalGuide: customOptions?.hasLocalGuide || false,
            }
          }
        },
      });

      // 2. Execute PostGIS Raw Query to update the geometry column
      if (latitude !== undefined && longitude !== undefined) {
        await tx.$executeRawUnsafe(
          `UPDATE "Listing" SET location = ST_SetSRID(ST_MakePoint($1, $2), 4326) WHERE id = $3`,
          longitude,
          latitude,
          listing.id
        );
      }

      return listing;
    });

    res.status(201).json({ message: 'Listing created successfully', listing: newListing });
  } catch (error) {
    console.error('Error creating listing:', error);
    res.status(500).json({ error: 'Failed to create listing' });
  }
};
