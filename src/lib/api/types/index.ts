// Common types used across multiple API endpoints
export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface ApiResponse {
  status: number;
  message: string;
}

export interface PaginatedResponse<T> extends ApiResponse {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
}