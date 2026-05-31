import 'dotenv/config';
import z from 'zod';

const envSchema = z.object({
  PORT: z.string().default('3000').transform(Number),
  JWT_ACCESS_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),
  DATABASE_URL: z.string(),
});

export default envSchema.parse(process.env);
