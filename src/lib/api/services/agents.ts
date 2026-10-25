import { baseService } from './base';
import { API_ENDPOINTS } from '../endpoints';
import type { ProductLine } from '../../constants/productLines';
import type { AgentsListResponse, EditCommissionPayload, EditCommissionResponse } from '../../types/agent';

export const agentService = {
  getAllAgents: async (productLine: ProductLine): Promise<AgentsListResponse> => {
    const api = baseService.api.createInstance(productLine);

    try {
      const response = await api.get(API_ENDPOINTS.GET_ALL_AGENTS);
      return response.data;
    } catch (error) {
      throw baseService.handleError(error, 'Failed to fetch agents');
    }
  },

  editCommission: async (
    productLine: ProductLine,
    payload: EditCommissionPayload
  ): Promise<EditCommissionResponse> => {
    const api = baseService.api.createInstance(productLine);

    try {
      const response = await api.post(API_ENDPOINTS.EDIT_COMMISSION, payload);
      return response.data;
    } catch (error) {
      throw baseService.handleError(error, 'Failed to update commission');
    }
  },
};
