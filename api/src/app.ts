import type { Request, Response } from 'express';
import express from 'express';
import helmet from 'helmet';
import logger from './config/logger.js';
import authRoutes from './features/auth/auth.routes.js';
import userRoutes from './features/users/user.routes.js';
import errorHander from './middleware/errorHandler.js';

const app = express();

app.use(express.json({ limit: '100kb' }));

app.use(
  express.urlencoded({
    extended: true,
    limit: '100kb',
    parameterLimit: 50,
  }),
);

// Security middleware
app.use(helmet());

const mockLists = [
  {
    id: 1,
    title: 'list title',
    srcLang: 'en',
    tgtLang: 'de',
    items: [
      {
        id: 11,
        src: 'three',
        tgt: 'drei',
      },
      {
        id: 12,
        src: 'four',
        tgt: 'vier',
      },
    ],
    results: [
      {
        id: 111,
        errors_made: 4,
        duration_ms: 500,
        attempts: 7,
      },
      {
        id: 222,
        errors_made: 3,
        duration_ms: 400,
        attempts: 5,
      },
    ],
  },
  {
    id: 2,
    title: 'list 2 title',
    srcLang: 'fr',
    tgtLang: 'es',
    items: [
      {
        id: 21,
        src: 'trois',
        tgt: 'tres',
      },
      {
        id: 22,
        src: 'dix',
        tgt: 'diez',
      },
    ],
    results: [
      {
        id: 211,
        errors_made: 6,
        duration_ms: 1500,
        attempts: 2,
      },
      {
        id: 212,
        errors_made: 2,
        duration_ms: 2000,
        attempts: 2,
      },
    ],
  },
];

app.post('/', (_req: Request, res: Response) => {
  res.send('Welcome to the Express.js Tutorial');
});

app.use('/auth', authRoutes);

app.use('/users', userRoutes);

app.get('/vocablists', (_req, res) => {
  res.json(mockLists);
});

app.get('/vocablists/:listId', (req, res) => {
  const vocablistId = Number(req.params.listId);
  const vocablist = mockLists.find((list) => list.id === vocablistId);

  if (!vocablist) {
    logger.warn('No data available');

    return res.status(404).json({ message: 'List cannot be found' });
  }
  res.json(vocablist);
});

app.get('/vocablists/:listId/items', (req, res) => {
  const vocablistId = Number(req.params.listId);
  const vocablist = mockLists.find((list) => list.id === vocablistId);

  const items = vocablist?.items;

  if (!items) {
    logger.warn('No list data available');

    return res.status(404).json({ message: 'Items cannot be found' });
  }
  res.json(vocablist.items);
});

app.get('/vocablists/:listId/items/:itemId', (req, res) => {
  const vocablistId = Number(req.params.listId);
  const itemId = Number(req.params.itemId);

  const vocablist = mockLists.find((list) => list.id === vocablistId);
  const item = vocablist?.items.find((item) => item.id === itemId);

  if (!item) {
    logger.warn('No list data available');

    return res.status(404).json({ message: 'Item cannot be found' });
  }
  res.json(item);
});

app.get('/vocablists/:listId/practice-results', (req, res) => {
  const vocablistId = Number(req.params.listId);
  const vocablist = mockLists.find((list) => list.id === vocablistId);

  const results = vocablist?.results;

  if (!results) {
    logger.warn('No results data available');

    return res.status(404).json({ message: 'Result cannot be found' });
  }
  res.json(results);
});

app.get('/vocablists/:listId/practice-results/:resultId', (req, res) => {
  const vocablistId = Number(req.params.listId);
  const resultId = Number(req.params.resultId);

  const vocablist = mockLists.find((list) => list.id === vocablistId);
  const result = vocablist?.results.find((result) => result.id === resultId);

  if (!result) {
    logger.warn('No result data available');

    return res.status(404).json({ message: 'Result cannot be found' });
  }
  res.json(result);
});

app.use(errorHander);

export default app;
