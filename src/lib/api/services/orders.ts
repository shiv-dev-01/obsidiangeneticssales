import { baseService } from './base';
import { API_ENDPOINTS } from '../endpoints';
import type { ProductLine } from '../../constants/productLines';
import type { OrderListResponse, OrderResponse } from '../../types/order';
import type { CheckoutLinksListResponse } from '../../types/checkoutLinks';

export const orderService = {
  getOrders: async (
    productLine: ProductLine,
    page: number = 1,
    orderId?: string
  ): Promise<OrderListResponse> => {
    const api = baseService.api.createInstance(productLine);

    try {
      const response = await api.post('/get_all_orders', {
        page,
        ...(orderId && { order_id: orderId })
      });
      return response.data;
    } catch (error) {
      throw baseService.handleError(error, 'Failed to fetch orders');
    }
  },

  getOrdersEmail: async (
    productLine: ProductLine,
    page: number = 1,
    email?: string
  ): Promise<OrderListResponse> => {
    const api = baseService.api.createInstance(productLine);

    try {
      const response = await api.post('/get_user_orders', {
        page,
        ...(email && { email: email })
      });
      return response.data;
    } catch (error) {
      throw baseService.handleError(error, 'Failed to fetch orders');
    }
  },

  createOrder: async (productLine: ProductLine, formData: FormData): Promise<OrderResponse> => {
    const api = baseService.api.createInstance(productLine);

    try {
      const response = await api.post(API_ENDPOINTS.CREATE_ORDER, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw baseService.handleError(error, 'Failed to create order');
    }
  },

  createCheckoutLink: async (
    productLine: ProductLine,
    formData: FormData
  ): Promise<{ status: number; message: string; checkout_link?: string }> => {
    const api = baseService.api.createInstance(productLine);

    try {
      const response = await api.post(API_ENDPOINTS.CREATE_CHECKOUT_LINK, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw baseService.handleError(error, 'Failed to create checkout link');
    }
  },

  getAllCheckoutLinks: async (
    productLine: ProductLine
  ): Promise<CheckoutLinksListResponse> => {
    const api = baseService.api.createInstance(productLine);

    try {
      const response = await api.get(API_ENDPOINTS.GET_ALL_CHECKOUT_LINKS);
      return response.data;
    } catch (error) {
      throw baseService.handleError(error, 'Failed to fetch checkout links');
    }
  },

  getAgentOrders: async (
    productLine: ProductLine,
    agentId: number,
    page: number = 1,
    perPage: number = 5
  ): Promise<OrderListResponse> => {
    const api = baseService.api.createInstance(productLine);

    try {
      const response = await api.post(API_ENDPOINTS.ORDERS, {
        page,
        admin_id: agentId,
        per_page: perPage,
      });
      return response.data;
    } catch (error) {
      throw baseService.handleError(error, 'Failed to fetch agent orders');
    }
  },
};