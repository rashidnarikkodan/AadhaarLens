import express, { type Application, type Request, type Response } from 'express';
import cors from 'cors';
import { env } from './config/env.config.js';
import apiRouter from './routes/index.js';
import { errorHandler } from './middlewares/errorHandler.js';
import morgan from 'morgan';

const app: Application = express();

const configuredOrigins = (env.CLIENT_URL || '')
  .split(',')
  .map((url) => url.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        return callback(null, true);
      }

      const isAllowed =
        env.NODE_ENV !== 'production' ||
        configuredOrigins.length === 0 ||
        configuredOrigins.includes('*') ||
        configuredOrigins.includes(origin) ||
        origin.endsWith('.vercel.app');

      if (isAllowed) {
        return callback(null, true);
      }

      callback(new Error(`Origin ${origin} not allowed by CORS`));
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.get('/', (_req: Request, res: Response) => {
  res.json({
    message: 'Welcome to AadhaarLens API',
    healthCheck: '/api/health',
  });
});

app.use('/api', apiRouter);

app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Resource not found',
  });
});

app.use(errorHandler);

export default app;
