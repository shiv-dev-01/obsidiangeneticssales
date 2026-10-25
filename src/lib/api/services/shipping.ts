import { baseService, type ApiResponse } from './base';
import { API_ENDPOINTS } from '../endpoints';
import { useProductLineStore } from '../../../store/productLineStore';
import type { ShippingMethod } from '../../types';

interface ShippingMethodResponse extends ApiResponse {
  shipping_methods: ShippingMethod[];
}

export const shippingService = {
  getShippingMethods: async (): Promise<ShippingMethodResponse> => {
    const productLine = useProductLineStore.getState().selectedLine;
    const api = baseService.api.createInstance(productLine);

    try {
      const response = await api.get(API_ENDPOINTS.SHIPPING_METHODS);
      return response.data;
    } catch (error) {
      throw baseService.handleError(error, 'Failed to fetch shipping methods');
    }
  }
};