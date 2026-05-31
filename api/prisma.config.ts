import { defineConfig } from 'prisma/config';
import env from './src/config/env.js';

const { DATABASE_URL } = env;

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: DATABASE_URL,
  },
});
