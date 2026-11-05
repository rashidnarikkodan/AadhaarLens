import app from './app.js';
import { env } from './config/env.config.js';

const server = app.listen(env.PORT, () => {
  console.log(`[AadhaarLens Server] Running on http://localhost:${env.PORT}`);
  console.log(`[AadhaarLens Server] Environment: ${env.NODE_ENV}`);
});

const gracefulShutdown = (signal: string) => {
  console.log(`\nReceived ${signal}. Shutting down gracefully...`);
  server.close(() => {
    console.log('Server process terminated.');
    process.exit(0);
  });
};

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
