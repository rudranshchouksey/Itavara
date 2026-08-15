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
  SOCKET_CORS_ORIGIN: z.string().url()
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error("❌ Invalid environment variables:", _env.error.format());
  process.exit(1);
}

export const env = _env.data;
