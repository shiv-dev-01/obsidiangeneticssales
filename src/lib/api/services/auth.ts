import { baseService } from './base';
import { API_ENDPOINTS } from '../endpoints';
import type { LoginResponse } from '../../types/auth';

export const authService = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    try {
      // Use GETTRIM API for login
      const api = baseService.api.createInstance('JOINTRIM');
      const response = await api.post(API_ENDPOINTS.LOGIN, { email, password });
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error('Login failed');
    }
  }
};