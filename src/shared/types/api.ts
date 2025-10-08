/**
 * Generic API response wrapper
 */
export type ApiResponse<T> = {
  data: T;
  status: number;
};

/**
 * API error structure
 */
export type ApiError = {
  message: string;
  status?: number;
  code?: string;
  details?: Record<string, unknown>;
};

/**
 * Validation error for form fields
 */
export type ValidationError = {
  field: string;
  message: string;
};

/**
 * HTTP methods
 */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

/**
 * Request configuration
 */
export type RequestConfig = {
  method: HttpMethod;
  url: string;
  data?: unknown;
  params?: Record<string, string | number>;
  headers?: Record<string, string>;
};
