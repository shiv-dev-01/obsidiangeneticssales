import { createAPI } from './base';
import { useProductLineStore } from '../../store/productLineStore';
import type { BillingModel } from '../types/billingModel';

export interface BillingModelResponse {
  status: number;
  message: string;
  data: BillingModel[];
}

export const getBillingModels = async (): Promise<BillingModelResponse> => {
  // Get current product line from store
  const productLine = useProductLineStore.getState().selectedLine;
  
  // Create API instance with correct base URL
  const api = createAPI(productLine);
  
  try {
    const response = await api.get('/billing_model_view');
    return response.data;
  } catch (error) {
    console.error('Error fetching billing models:', error);
    throw new Error('Failed to load billing models');
  }
};