import { Request, Response, NextFunction } from 'express';
import { RedisCacheService } from '../common/cache/redis-cache.service';

export const cacheMiddleware = (ttlSeconds: number) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Only cache GET or POST requests
    if (req.method !== 'GET' && req.method !== 'POST') {
      return next();
    }

    let cacheKey = `cache:${req.originalUrl}`;
    
    // For POST requests, append a hash of the request body (e.g., search parameters)
    if (req.method === 'POST') {
      const bodyHash = RedisCacheService.generateHash(req.body);
      cacheKey = `${cacheKey}:${bodyHash}`;
    }

    try {
      const cachedData = await RedisCacheService.get(cacheKey);
      
      if (cachedData) {
        // Cache hit
        res.setHeader('X-Cache', 'HIT');
        return res.json(JSON.parse(cachedData));
      }

      // Cache miss: override res.json to capture the response data
      res.setHeader('X-Cache', 'MISS');
      const originalJson = res.json.bind(res);

      res.json = (body: any): Response => {
        // Only cache successful responses
        if (res.statusCode >= 200 && res.statusCode < 300) {
          RedisCacheService.set(cacheKey, JSON.stringify(body), ttlSeconds).catch((err) => {
             console.error('Failed to cache response in middleware:', err);
          });
        }
        return originalJson(body);
      };

      next();
    } catch (error) {
      console.error('Cache middleware error:', error);
      next(); // Continue without cache if Redis fails
    }
  };
};
