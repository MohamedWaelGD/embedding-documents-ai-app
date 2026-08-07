import cors from 'cors';
import express, { Express, Router } from 'express';
import { config } from './config';
import { errorHandler, notFoundHandler } from './middleware/error-handler';
import { timeoutMiddleware } from './middleware/timeout';
import { ingestRouter } from './routes/ingest.routes';
import { searchRouter } from './routes/search.routes';
import { documentRouter } from './routes/document.routes';

export function createApp(): Express {
  const app = express();

  app.use(cors());
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

  const apiRouter = Router();
  apiRouter.use(timeoutMiddleware(30000));

  apiRouter.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  apiRouter.use('/ingest', ingestRouter);
  apiRouter.use('/search', searchRouter);
  apiRouter.use('/documents', documentRouter);

  app.use('/api', apiRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
