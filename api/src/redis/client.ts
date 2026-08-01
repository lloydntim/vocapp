import { createClient } from 'redis';
import env from '../config/env.js';
import logger from '../config/logger.js';

const redisClient = createClient({ url: env.REDIS_URL });

redisClient
  .on('error', (err) => {
    logger.error({ err }, 'Redis client error');
  })
  .connect();

export default redisClient;
