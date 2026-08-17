import { Request, Response } from 'express';
import { prisma, Prisma, ListingType } from '@itvara/db';

export const createListing = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
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
    const newListing = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
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

export const searchListings = async (req: Request, res: Response) => {
  try {
    const {
      latitude,
      longitude,
      radiusInKm = 50,
      sortBy = 'distance', // 'distance', 'price_asc', 'price_desc'
    } = req.body;

    if (latitude === undefined || longitude === undefined) {
      return res.status(400).json({ error: 'Latitude and longitude are required' });
    }

    const radiusInMeters = radiusInKm * 1000;

    // We must use raw query because Prisma does not natively support PostGIS operations well yet
    let rawQuery = `
      SELECT 
        l.*, 
        ST_DistanceSphere(l.location, ST_SetSRID(ST_MakePoint($1, $2), 4326)) AS distance_meters
      FROM "Listing" l
      WHERE ST_DWithin(
        l.location::geography, 
        ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography, 
        $3
      )
    `;

    // Note: Parameterized ORDER BY is not allowed in PostgreSQL, so we append the string directly. 
    // We strictly check the sortBy parameter to prevent SQL injection.
    if (sortBy === 'price_asc') {
      rawQuery += ` ORDER BY l."pricePerNight" ASC`;
    } else if (sortBy === 'price_desc') {
      rawQuery += ` ORDER BY l."pricePerNight" DESC`;
    } else {
      // Default to distance
      rawQuery += ` ORDER BY distance_meters ASC`;
    }

    const listings: any[] = await prisma.$queryRawUnsafe(
      rawQuery,
      longitude, // PostGIS uses Longitude (X), Latitude (Y) order for ST_MakePoint
      latitude,
      radiusInMeters
    );

    // Fetch sponsored listings in the same area
    const sponsoredRawQuery = `
      SELECT 
        l.*, 
        ST_DistanceSphere(l.location, ST_SetSRID(ST_MakePoint($1, $2), 4326)) AS distance_meters,
        sc.id AS "campaignId",
        sc."cpcRate"
      FROM "Listing" l
      INNER JOIN "SponsoredCampaign" sc ON sc."listingId" = l.id
      WHERE ST_DWithin(
        l.location::geography, 
        ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography, 
        $3
      )
      AND sc."campaignType" = 'SEARCH_BOOST'
      AND sc.status = 'ACTIVE'
      AND sc.budget > sc.spent
      ORDER BY sc."cpcRate" DESC
      LIMIT 3
    `;
    
    const sponsoredListings: any[] = await prisma.$queryRawUnsafe(
      sponsoredRawQuery,
      longitude,
      latitude,
      radiusInMeters
    );

    // Format the results to add the "X km away" string
    const formattedListings = listings.map((listing) => {
      const distanceKm = (listing.distance_meters / 1000).toFixed(1);
      return {
        ...listing,
        distanceString: `${distanceKm} km away`,
        isSponsored: false
      };
    });

    const formattedSponsored = sponsoredListings.map((listing) => {
      const distanceKm = (listing.distance_meters / 1000).toFixed(1);
      return {
        ...listing,
        distanceString: `${distanceKm} km away`,
        isSponsored: true
      };
    });

    // Remove duplicates from formattedListings if they appear in sponsored
    const sponsoredIds = new Set(formattedSponsored.map(s => s.id));
    const filteredListings = formattedListings.filter(l => !sponsoredIds.has(l.id));

    const finalResults = [...formattedSponsored, ...filteredListings];

    res.status(200).json({ listings: finalResults });
  } catch (error) {
    console.error('Error searching listings:', error);
    res.status(500).json({ error: 'Failed to search listings' });
  }
};

export const getFlexibleListings = async (req: Request, res: Response) => {
  try {
    const { budget, vibe } = req.query;
    
    // Convert budget to number if provided
    const maxPrice = budget ? parseInt(budget as string) : undefined;
    
    // Map vibe to ListingTypes
    let allowedTypes: string[] = ['MONASTERY', 'ASHRAM', 'TENT', 'WORK_STUDIO', 'MANSION', 'HOSTEL'];
    if (vibe === 'spiritual') {
      allowedTypes = ['MONASTERY', 'ASHRAM'];
    } else if (vibe === 'nature') {
      allowedTypes = ['TENT'];
    } else if (vibe === 'luxury') {
      allowedTypes = ['MANSION'];
    }

    // Query Prisma
    const listings = await prisma.listing.findMany({
      where: {
        type: { in: allowedTypes as ListingType[] },
        ...(maxPrice ? { pricePerNight: { lte: maxPrice } } : {})
      },
      take: 10, // Recommend top 10 unique stays
      orderBy: {
        createdAt: 'desc' // Or randomly, but we stick to latest for simplicity
      },
      include: {
        customOptions: true,
      }
    });

    res.status(200).json({ listings, message: "Curiosity Recommendation Engine Results" });
  } catch (error) {
    console.error('Error fetching flexible listings:', error);
    res.status(500).json({ error: 'Failed to fetch flexible listings' });
  }
};
