import { api } from './base';
import { API_ENDPOINTS } from '../config';
import type { Product } from '../types/product';

export interface ProductResponse {
  status: number;
  product: Product[];
  message: string;
}

export const getProducts = async (): Promise<ProductResponse> => {
  try {
    const response = await api.get(API_ENDPOINTS.PRODUCTS);
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw new Error('Failed to load products');
  }
};