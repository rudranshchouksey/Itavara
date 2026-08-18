import Redis from 'ioredis';
import crypto from 'crypto';

class RedisCache {
  private client: Redis | null = null;
  private isConnected: boolean = false;

  constructor() {
    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
    
    try {
      this.client = new Redis(redisUrl, {
        retryStrategy(times) {
          const delay = Math.min(times * 50, 2000);
          return delay;
        },
        maxRetriesPerRequest: 3,
      });

      this.client.on('connect', () => {
        console.log('Redis connected');
        this.isConnected = true;
      });

      this.client.on('error', (err) => {
        console.error('Redis error:', err);
        this.isConnected = false;
      });
    } catch (error) {
      console.error('Failed to initialize Redis client:', error);
    }
  }

  async get(key: string): Promise<string | null> {
    if (!this.isConnected || !this.client) return null;
    try {
      return await this.client.get(key);
    } catch (error) {
      console.error(`Redis GET error for key ${key}:`, error);
      return null;
    }
  }

  async set(key: string, value: string, ttlSeconds: number): Promise<void> {
    if (!this.isConnected || !this.client) return;
    try {
      await this.client.set(key, value, 'EX', ttlSeconds);
    } catch (error) {
      console.error(`Redis SET error for key ${key}:`, error);
    }
  }

  async delByPattern(pattern: string): Promise<void> {
    if (!this.isConnected || !this.client) return;
    try {
      let cursor = '0';
      do {
        const result = await this.client.scan(cursor, 'MATCH', pattern, 'COUNT', 100);
        cursor = result[0];
        const keys = result[1];
        if (keys.length > 0) {
          await this.client.del(...keys);
        }
      } while (cursor !== '0');
    } catch (error) {
      console.error(`Redis DEL pattern error for ${pattern}:`, error);
    }
  }

  // Cache stampede prevention (Probabilistic early expiration)
  async getOrSet<T>(key: string, fetchFn: () => Promise<T>, ttlSeconds: number): Promise<T> {
    if (!this.isConnected || !this.client) {
      return await fetchFn();
    }

    try {
      const cached = await this.client.get(key);
      const now = Date.now();
      
      if (cached) {
        const parsed = JSON.parse(cached);
        // parsed: { data: T, expiry: number }
        
        // Probabilistic early expiration (beta = 1.0)
        // If remaining time is less than a random gap, we recompute in background
        const remaining = parsed.expiry - now;
        const computeTimeMs = 1000; // estimated time to compute
        const shouldRefresh = remaining < -computeTimeMs * Math.log(Math.random());

        if (shouldRefresh) {
          // Recompute asynchronously without blocking
          fetchFn().then(newData => {
             this.setWithExpiry(key, newData, ttlSeconds).catch(console.error);
          }).catch(console.error);
        }

        return parsed.data;
      }
    } catch (e) {
      console.error('Redis getOrSet parse error:', e);
    }

    // Cache miss, compute synchronously
    const data = await fetchFn();
    await this.setWithExpiry(key, data, ttlSeconds);
    return data;
  }

  private async setWithExpiry(key: string, data: any, ttlSeconds: number) {
    if (!this.client) return;
    const expiry = Date.now() + (ttlSeconds * 1000);
    const payload = JSON.stringify({ data, expiry });
    await this.client.set(key, payload, 'EX', ttlSeconds);
  }

  generateHash(data: any): string {
    // Strictly serialize data (e.g. PostGIS coordinates array)
    const sortedStringified = JSON.stringify(data, (key, value) => 
      (value instanceof Object && !(value instanceof Array)) 
        ? Object.keys(value).sort().reduce((sorted: any, k) => {
            sorted[k] = value[k];
            return sorted;
          }, {})
        : value
    );
    return crypto.createHash('sha256').update(sortedStringified).digest('hex');
  }

  async ping(): Promise<string> {
    if (!this.isConnected || !this.client) throw new Error('Redis not connected');
    return await this.client.ping();
  }

  disconnect(): void {
    if (this.client) {
      this.client.disconnect();
      this.isConnected = false;
    }
  }
}

export const RedisCacheService = new RedisCache();
