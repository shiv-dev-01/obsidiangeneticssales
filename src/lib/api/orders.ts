import { api } from './base';
import { API_ENDPOINTS } from '../config';
import type { OrderResponse } from '../types/order';

export const createOrder = async (formData: FormData): Promise<OrderResponse> => {
  try {
    const response = await api.post(API_ENDPOINTS.CREATE_ORDER, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating order:', error);
    throw new Error('Failed to create order');
  }
};