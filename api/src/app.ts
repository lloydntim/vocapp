import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import env from './config/env.js';
import swaggerSpec from './docs/swagger.js';
import errorHandler from './middleware/errorHandler.js';
import { apiRateLimit } from './middleware/rateLimit.js';
import v1Router from './routes/v1.js';

const app = express();

app.set('trust proxy', 1);

app.use(express.json({ limit: '100kb' }));
app.use(
  express.urlencoded({
    extended: true,
    limit: '100kb',
    parameterLimit: 50,
  }),
);
/* app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof SyntaxError && 'body' in err) {
    return res.status(400).json({ message: 'Invalid JSON', code: 'BAD_REQUEST' });
  }
  next(err);
}); */

app.use(cookieParser());
app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
  }),
);

// Security middleware
app.use(helmet());
app.use(apiRateLimit);

if (env.NODE_ENV !== 'production') {
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  app.get('/docs.json', (_req, res) => {
    res.json(swaggerSpec);
  });
}

app.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'vocapp-api',
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/v1', v1Router);

app.use(errorHandler);

export default app;
