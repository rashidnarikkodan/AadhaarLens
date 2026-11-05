export interface HealthResponse {
  status: string;
  uptime: number;
  timestamp: string;
  service: string;
}

export const getHealthStatus = (): HealthResponse => {
  return {
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    service: 'AadhaarLens Backend',
  };
};
