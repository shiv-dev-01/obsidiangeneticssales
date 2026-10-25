import { api } from './base';
import { API_ENDPOINTS } from '../config';
import type { ShippingMethod } from '../types/shipping';

export interface ShippingMethodResponse {
  status: number;
  shipping_methods: ShippingMethod[];
  message: string;
}

export const getShippingMethods = async (): Promise<ShippingMethodResponse> => {
  try {
    const response = await api.get(API_ENDPOINTS.SHIPPING);
    return response.data;
  } catch (error) {
    console.error('Error fetching shipping methods:', error);
    throw new Error('Failed to load shipping methods');
  }
};