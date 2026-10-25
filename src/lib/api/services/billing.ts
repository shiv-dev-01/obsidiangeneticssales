import { createAPI, handleApiError, type ApiResponse } from '../base';
import { API_ENDPOINTS } from '../endpoints';
import { useProductLineStore } from '../../../store/productLineStore';
import type { BillingModel } from '../../types/billingModel';

export interface BillingModelResponse extends ApiResponse {
  data: BillingModel[];
}

export const billingService = {
  getBillingModels: async (): Promise<BillingModelResponse> => {
    const productLine = useProductLineStore.getState().selectedLine;
    const api = createAPI(productLine);

    try {
      const response = await api.get(API_ENDPOINTS.BILLING_MODELS);
      return response.data;
    } catch (error) {
      throw handleApiError(error, 'Failed to fetch billing models');
    }
  }
};

export type { BillingModel };