import type { Request, Response } from 'express';
import { getHealthStatus } from '../service/health.service.js';

export const getHealth = (_req: Request, res: Response): void => {
  const healthData = getHealthStatus();
  res.status(200).json(healthData);
};
