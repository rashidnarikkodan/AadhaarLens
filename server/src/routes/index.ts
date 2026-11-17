import { Router } from 'express';
import healthRouter from './health.route.js';
import aadhaarRouter from './aadhaar.route.js';

const apiRouter = Router();

apiRouter.use('/aadhaar', aadhaarRouter);
apiRouter.use('/health', healthRouter);

export default apiRouter;
