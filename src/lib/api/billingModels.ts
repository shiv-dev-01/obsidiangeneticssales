import { api } from './base';
import { API_ENDPOINTS } from '../config';
import type { BillingModel } from '../types/billingModel';

export interface BillingModelResponse {
  status: number;
  message: string;
  data: BillingModel[];
}

export const getBillingModels = async (): Promise<BillingModelResponse> => {
  try {
    const response = await api.get(API_ENDPOINTS.BILLING_MODELS);
    return response.data;
  } catch (error) {
    console.error('Error fetching billing models:', error);
    throw new Error('Failed to load billing models');
  }
};