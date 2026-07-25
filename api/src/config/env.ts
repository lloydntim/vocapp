import 'dotenv/config';
import z from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.string().default('3000').transform(Number),
  JWT_ACCESS_SECRET: z.string().min(32),
  DATABASE_URL: z.string(),
  SMTP_HOST: z.string().default('mailpit'),
  SMTP_PORT: z.coerce.number().default(1025),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  SMTP_SECURE: z.string(),
  EMAIL_FROM: z.string().email().default('noreply@vocapp.local'),
  CLIENT_URL: z.string().url().default('http://localhost:3001'),
  GCS_PROJECT_ID: z.string(),
  GCS_CLIENT_EMAIL: z.string().email(),
  GCS_PRIVATE_KEY: z.string().min(32),
  GCS_PROJECT_LOCATION: z.string(),
  REDIS_URL: z.string(),
});

export default envSchema.parse(process.env);
