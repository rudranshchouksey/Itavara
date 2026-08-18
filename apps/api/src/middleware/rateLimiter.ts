import { RateLimiterRedis } from 'rate-limiter-flexible';
import { Request, Response, NextFunction } from 'express';
import Redis from 'ioredis';

const redisClient = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
  enableOfflineQueue: false,
});

const authRateLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'rl_auth',
  points: 5, // 5 requests
  duration: 60, // per 60 seconds by IP
});

const bookingRateLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'rl_booking',
  points: 10, // 10 requests
  duration: 60, // per 60 seconds by user
});

const publicRateLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'rl_public',
  points: 120, // 120 requests
  duration: 60, // per 60 seconds by IP
});

export const authLimiter = (req: Request, res: Response, next: NextFunction) => {
  authRateLimiter
    .consume(req.ip || 'unknown')
    .then(() => next())
    .catch(() => {
      res.status(429).json({ error: 'Too Many Requests for Authentication' });
    });
};

export const bookingLimiter = (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user?.userId || req.ip || 'unknown';
  bookingRateLimiter
    .consume(userId)
    .then(() => next())
    .catch(() => {
      res.status(429).json({ error: 'Too Many Requests for Booking/Payment' });
    });
};

export const publicLimiter = (req: Request, res: Response, next: NextFunction) => {
  publicRateLimiter
    .consume(req.ip || 'unknown')
    .then(() => next())
    .catch(() => {
      res.status(429).json({ error: 'Too Many Requests' });
    });
};
