import axios from 'axios';
import { PRODUCT_LINES } from '../constants/productLines';
import type { ProductLine } from '../constants/productLines';
import { useAuthStore } from '../../store/authStore';

export interface ApiResponse {
  status: number;
  message: string;
}

export interface ApiErrorResponse extends ApiResponse {
  error?: string;
}

export const createAPI = (productLine: ProductLine) => {
  const baseUrl = PRODUCT_LINES[productLine].baseUrl;

  const api = axios.create({
    baseURL: `${baseUrl}/api`,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Add admin_id to all requests
  api.interceptors.request.use((config) => {
    const adminId = useAuthStore.getState().getAdminId();

    if (adminId) {
      // For GET requests, add to query params
      if (config.method?.toLowerCase() === 'get') {
        config.params = {
          admin_id: adminId,
          ...config.params,
        };
      }
      // For other methods, add to request body
      else if (config.data) {
        if (config.data instanceof FormData) {
          if (!config.data.has('admin_id')) {
            config.data.append('admin_id', adminId.toString());
          }
        } else {
          config.data = {
            admin_id: adminId,
            ...config.data,
          };
        }
      } else {
        // If no data exists, create new data object
        config.data = { admin_id: adminId };
      }
    }
    
    return config;
  });

  return api;
};

export const handleApiError = (error: unknown, defaultMessage: string): never => {
  if (axios.isAxiosError(error)) {
    throw new Error(error.response?.data?.message || defaultMessage);
  }
  throw new Error(defaultMessage);
};

export const api = {
  createInstance: createAPI,
  handleError: handleApiError
};