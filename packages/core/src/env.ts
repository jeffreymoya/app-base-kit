import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config(); // Load .env file

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z.coerce.number().default(3000),
  LOG_LEVEL: z
    .enum(['error', 'warn', 'info', 'http', 'verbose', 'debug', 'silly'])
    .default('info'),
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(32),
  API_KEY_SERVICE_A: z.string(),
  API_KEY_SERVICE_B: z.string().optional(),
  S3_BUCKET_NAME: z.string(),
  REDIS_URL: z.string().url().optional(),
  FEATURE_FLAG_X: z.coerce.boolean().default(false),
  // Add 5 more example environment variables
  EXTERNAL_API_ENDPOINT: z.string().url(),
  TIMEOUT_MS: z.coerce.number().default(5000),
  ADMIN_EMAIL: z.string().email(),
  CORS_ORIGIN: z.string().url().default('http://localhost:3000'),
  SESSION_SECRET: z.string().min(32),
});

export type AppEnv = z.infer<typeof envSchema>;

let validatedEnv: AppEnv;

try {
  validatedEnv = envSchema.parse(process.env);
} catch (error) {
  if (error instanceof z.ZodError) {
    console.error(
      'Environment variable validation failed:\n',
      error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join('\n'),
    );
    process.exit(1);
  }
  throw error; // Should not happen if it's a ZodError
}

export const env: AppEnv = validatedEnv;
