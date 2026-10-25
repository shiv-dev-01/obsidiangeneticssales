import { api } from './base';
import { API_ENDPOINTS } from '../config';
import type { Gateway } from '../types/gateway';

export interface GatewayResponse {
  status: number;
  message: string;
  gateway_data: Gateway[];
}

export const getGateways = async (): Promise<GatewayResponse> => {
  try {
    const response = await api.get(API_ENDPOINTS.GATEWAYS);
    return response.data;
  } catch (error) {
    console.error('Error fetching gateways:', error);
    throw new Error('Failed to load payment gateways');
  }
};