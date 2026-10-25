import { baseService } from './base';
import { API_ENDPOINTS } from '../endpoints';
import type { Product } from '../../types/product';
import type { ProductLine } from '../../constants/productLines';

export interface ProductResponse {
  status: number;
  product: Product[];
  message: string;
}

export const productService = {
  getProducts: async (productLine: ProductLine): Promise<ProductResponse> => {
    const api = baseService.api.createInstance(productLine);

    try {
      const response = await api.get(API_ENDPOINTS.PRODUCTS);
      return response.data;
    } catch (error) {
      throw baseService.handleError(error, 'Failed to fetch products');
    }
  }
};

export type { Product };