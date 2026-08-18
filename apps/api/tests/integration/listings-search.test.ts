import request from 'supertest';
import { app } from '../../src/server';
import { prisma } from '@itvara/db';
import { RedisCacheService } from '../../src/common/cache/redis-cache.service';
import { sign } from 'jsonwebtoken';
import { env } from '@itvara/config';

describe('POST /api/listings/search', () => {
  let token: string;

  beforeAll(async () => {
    // Generate a mock token for authenticated requests if needed
    token = sign({ userId: 'test-user-123' }, env.JWT_SECRET, { expiresIn: '1h' });
  });

  afterAll(async () => {
    await prisma.$disconnect();
    RedisCacheService.disconnect();
  });

  it('should return properties within the specified bounding box', async () => {
    const payload = {
      bounds: {
        northEast: { lat: 40.75, lng: -73.90 },
        southWest: { lat: 40.70, lng: -74.05 },
      },
      filters: {
        minPrice: 50,
        maxPrice: 300,
      }
    };

    const response = await request(app)
      .post('/api/listings/search')
      .send(payload)
      .expect(200);

    expect(response.body).toHaveProperty('listings');
    expect(Array.isArray(response.body.listings)).toBe(true);

    // Validate that if listings are returned, their coordinates are within bounds
    response.body.listings.forEach((listing: any) => {
      expect(listing.latitude).toBeLessThanOrEqual(40.75);
      expect(listing.latitude).toBeGreaterThanOrEqual(40.70);
      expect(listing.longitude).toBeLessThanOrEqual(-73.90);
      expect(listing.longitude).toBeGreaterThanOrEqual(-74.05);
    });
  });
});
