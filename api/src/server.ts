import app from './app.js';
import logger from './config/logger.js';

// Start the server
app.listen(3000, () => {
  logger.info('Server is running on http://localhost:3000');

  logger.fatal('fatal');
  logger.error('error');
  logger.warn('warn');
  logger.info('info');
  logger.debug('debug');
  logger.trace('trace');
});
