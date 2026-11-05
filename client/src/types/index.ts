export interface ApiResponse<T = unknown> {
  success?: boolean;
  message?: string;
  data?: T;
}

export interface HealthResponse {
  status: string;
  uptime: number;
  timestamp: string;
  service: string;
}

