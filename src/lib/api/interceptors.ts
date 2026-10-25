import type { AxiosInstance } from 'axios';
import { useAuthStore } from '../../store/authStore';

export const setupApiInterceptors = (api: AxiosInstance) => {
  api.interceptors.request.use((config) => {
    const adminId = useAuthStore.getState().getAdminId();
    
    if (adminId) {
      // For GET requests, add to query params
      if (config.method?.toLowerCase() === 'get') {
        config.params = {
          ...config.params,
          admin_id: adminId
        };
      }
      // For other methods, add to request body
      else if (config.data) {
        if (config.data instanceof FormData) {
          config.data.append('admin_id', adminId.toString());
        } else {
          config.data = {
            ...config.data,
            admin_id: adminId
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