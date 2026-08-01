import { createClient } from 'redis';
import env from '../config/env.js';
import logger from '../config/logger.js';

const redisClient = createClient({ url: env.REDIS_URL });

redisClient
  .on('connect', () => logger.info('Redis client connecting'))
  .on('ready', () => logger.info('Redis client ready'))
  .on('reconnecting', () => logger.warn('Redis client reconnecting'))
  .on('error', (err) => logger.error({ err }, 'Redis client error'))
  .connect()
  .catch((err: unknown) => logger.error({ err }, 'Redis client failed to connect'));

export default redisClient;
