import { baseService } from './base';
import { API_ENDPOINTS } from '../endpoints';
import type { ProductLine } from '../../constants/productLines';
import type { Gateway } from '../../types/gateway';

export interface GatewayResponse {
  status: number;
  message: string;
  gateway_data: Gateway[];
}

export const gatewayService = {
  getGateways: async (productLine: ProductLine): Promise<GatewayResponse> => {
    const api = baseService.api.createInstance(productLine);

    try {
      const response = await api.get(API_ENDPOINTS.PAYMENT_GATEWAYS);
      return response.data;
    } catch (error) {
      return {
        status: 0,
        message: 'Failed to fetch gateways',
        gateway_data: []
      };
    }
  }
};

export type { Gateway };