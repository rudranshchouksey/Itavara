import { RateLimiterRedis } from 'rate-limiter-flexible';
import { Request, Response, NextFunction } from 'express';
import Redis from 'ioredis';
import { env } from '@itvara/config';

const redisClient = new Redis(env.REDIS_URL || 'redis://localhost:6379', {
  enableOfflineQueue: false,
});

const getIp = (req: Request): string => {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim();
  }
  return req.ip || 'unknown';
};

const authRateLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'rl_auth',
  points: env.RATE_LIMIT_AUTH_POINTS || 5,
  duration: env.RATE_LIMIT_AUTH_DURATION || 60,
});

const bookingRateLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'rl_booking',
  points: 10,
  duration: 60,
});

const publicRateLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'rl_public',
  points: 120,
  duration: 60,
});

export const authLimiter = (req: Request, res: Response, next: NextFunction) => {
  if (process.env.NODE_ENV === 'test') return next();
  authRateLimiter
    .consume(getIp(req))
    .then(() => next())
    .catch(() => {
      res.status(429).json({ error: 'Too Many Requests for Authentication' });
    });
};

export const bookingLimiter = (req: Request, res: Response, next: NextFunction) => {
  if (process.env.NODE_ENV === 'test') return next();
  const userId = (req as any).user?.userId || getIp(req);
  bookingRateLimiter
    .consume(userId)
    .then(() => next())
    .catch(() => {
      res.status(429).json({ error: 'Too Many Requests for Booking/Payment' });
    });
};

export const publicLimiter = (req: Request, res: Response, next: NextFunction) => {
  if (process.env.NODE_ENV === 'test') return next();
  publicRateLimiter
    .consume(getIp(req))
    .then(() => next())
    .catch(() => {
      res.status(429).json({ error: 'Too Many Requests' });
    });
};
