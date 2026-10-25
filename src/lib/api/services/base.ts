import { api } from '../base';
import type { ApiResponse, ApiErrorResponse } from '../base';

export const baseService = {
  api,
  handleError: api.handleError
};

export type { ApiResponse, ApiErrorResponse };