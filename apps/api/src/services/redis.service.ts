import Redis from 'ioredis';
import { env } from '@itvara/config';

const redis = new Redis(env.REDIS_URL);

redis.on('error', (err) => {
  console.error('Redis error:', err);
});

redis.on('connect', () => {
  console.log('Connected to Redis');
});

/**
 * Stores a refresh token in Redis.
 * The key is the user ID and the value is the token.
 * For multiple devices, you'd typically use a set or hash.
 * We'll use a set to allow multiple sessions per user.
 */
export async function addRefreshToken(userId: string, token: string, expiresInDays = 7): Promise<void> {
  const key = `refresh_tokens:${userId}`;
  const expirySeconds = expiresInDays * 24 * 60 * 60;
  
  // Add to set and update the expiration of the entire set
  // In a robust system, you might store expiry per token in a hash, 
  // but for simplicity, we add the token to a set.
  await redis.sadd(key, token);
  await redis.expire(key, expirySeconds);
}

/**
 * Validates if a refresh token exists for a user.
 */
export async function validateRefreshToken(userId: string, token: string): Promise<boolean> {
  const key = `refresh_tokens:${userId}`;
  const isMember = await redis.sismember(key, token);
  return isMember === 1;
}

/**
 * Revokes a specific refresh token.
 */
export async function revokeRefreshToken(userId: string, token: string): Promise<void> {
  const key = `refresh_tokens:${userId}`;
  await redis.srem(key, token);
}

/**
 * Revokes all sessions (all refresh tokens) for a user.
 */
export async function revokeAllSessions(userId: string): Promise<void> {
  const key = `refresh_tokens:${userId}`;
  await redis.del(key);
}

/**
 * Sets the active role for a user in Redis (overrides JWT role).
 */
export async function setActiveRole(userId: string, role: string): Promise<void> {
  const key = `active_role:${userId}`;
  // Cache for 7 days to match refresh token lifespan
  await redis.set(key, role, 'EX', 7 * 24 * 60 * 60);
}

/**
 * Gets the active role for a user from Redis.
 */
export async function getActiveRole(userId: string): Promise<string | null> {
  const key = `active_role:${userId}`;
  return redis.get(key);
}

export default redis;
