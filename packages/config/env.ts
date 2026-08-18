import { z } from 'zod';

const envSchema = z.object({
  PORT: z.string().default('4000').transform(Number),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  DATABASE_URL: z.string().url(),
  REDIS_URL: z.string().url(),
  JWT_SECRET: z.string().min(1),
  JWT_REFRESH_SECRET: z.string().min(1),
  CLIENT_WEB_URL: z.string().url(),
  CLIENT_MOBILE_SCHEME: z.string().min(1),
  STORAGE_BUCKET_URL: z.string().url(),
  SOCKET_CORS_ORIGIN: z.string().url(),
  STUN_SERVER_URL: z.string().default('stun:stun.l.google.com:19302'),
  TURN_SERVER_URL: z.string().default(''),
  TURN_SERVER_USERNAME: z.string().default(''),
  TURN_SERVER_CREDENTIAL: z.string().default(''),
  CORPORATE_INVOICE_BUCKET_URL: z.string().url().default('https://storage.googleapis.com/itvara-invoices'),
  
  // Phase 41-45 Secrets & Configs
  TOTP_ENCRYPTION_SECRET: z.string().min(1),
  AD_CLICK_SIGNING_KEY: z.string().min(1),
  NOTIFICATION_BATCH_LIMIT: z.string().transform(Number),
  SESSION_TTL_DAYS: z.string().transform(Number),

  // Phase 46-50 Audits & Configs
  REDIS_CACHE_TTL_SECONDS: z.string().default('600').transform(Number),
  RATE_LIMIT_AUTH_POINTS: z.string().default('5').transform(Number),
  RATE_LIMIT_AUTH_DURATION: z.string().default('60').transform(Number),
  E2E_TEST_BASE_URL: z.string().url().default('http://localhost:3000'),
  VERCEL_ORG_ID: z.string().optional(),
  VERCEL_PROJECT_ID: z.string().optional(),
  EXPO_TOKEN: z.string().optional(),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  if (process.env.NODE_ENV === 'test') {
    console.warn("⚠️ Invalid environment variables in test mode. Using dummy data.");
  } else {
    console.error("❌ Invalid environment variables:", _env.error.format());
    process.exit(1);
  }
}

export const env = _env.success ? _env.data : {
  PORT: 4000,
  NODE_ENV: 'test' as const,
  DATABASE_URL: 'postgres://dummy',
  REDIS_URL: 'redis://localhost:6379',
  JWT_SECRET: 'test-secret',
  JWT_REFRESH_SECRET: 'test-refresh-secret',
  CLIENT_WEB_URL: 'http://localhost:3000',
  CLIENT_MOBILE_SCHEME: 'itvara://',
  STORAGE_BUCKET_URL: 'https://storage',
  SOCKET_CORS_ORIGIN: 'http://localhost:3000',
  STUN_SERVER_URL: 'stun:stun.l.google.com:19302',
  TURN_SERVER_URL: '',
  TURN_SERVER_USERNAME: '',
  TURN_SERVER_CREDENTIAL: '',
  CORPORATE_INVOICE_BUCKET_URL: 'https://storage.googleapis.com/itvara-invoices',
  TOTP_ENCRYPTION_SECRET: 'test-totp',
  AD_CLICK_SIGNING_KEY: 'test-ad-key',
  NOTIFICATION_BATCH_LIMIT: 100,
  SESSION_TTL_DAYS: 30,
  REDIS_CACHE_TTL_SECONDS: 600,
  RATE_LIMIT_AUTH_POINTS: 5,
  RATE_LIMIT_AUTH_DURATION: 60,
  E2E_TEST_BASE_URL: 'http://localhost:3000'
};
