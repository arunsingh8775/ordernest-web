export interface ApiErrorResponse {
  message?: string;
  error?: string;
  status?: number;
  timestamp?: string;
  path?: string;
  [key: string]: unknown;
}

export type Uuid = string;
