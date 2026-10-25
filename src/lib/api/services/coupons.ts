import { baseService } from './base';
import { API_ENDPOINTS } from '../endpoints';
import type { ProductLine } from '../../constants/productLines';
import { useProductLineStore } from '../../../store/productLineStore';

export interface CouponValidationResponse {
  status: number;
  message: string;
  discount_percent: string;
  discount_amount: string;
  minimum_purchase: string;
}

export interface CreateCouponResponse {
  status: number;
  message: string;
}

export interface CreateCouponData {
  name: string;
  code: string;
  description: string;
  percent: number;
  minimum_purchase: number;
  date: string;
  total: number;
  per_customer: number;
  per_code: number;
  per_code_per_customer: number;
}

export const couponService = {
  validateCoupon: async (
    productLine: ProductLine,
    code: string,
    amount: number,
    productCount: number
  ): Promise<CouponValidationResponse> => {
    const api = baseService.api.createInstance(productLine);

    try {
      const response = await api.post(API_ENDPOINTS.VALIDATE_COUPON, {
        promo_codes: code,
        amount: amount.toString(),
        product_count: productCount
      });
      return response.data;
    } catch (error) {
      return {
        status: 0,
        message: 'Failed to validate coupon',
        discount_percent: '0',
        discount_amount: '0',
        minimum_purchase: '0'
      };
    }
  },

  createCoupon: async (data: CreateCouponData): Promise<CreateCouponResponse> => {
    const productLine = useProductLineStore.getState().selectedLine;
    const api = baseService.api.createInstance(productLine);

    try {
      const response = await api.post(API_ENDPOINTS.CREATE_COUPON, data);
      return response.data;
    } catch (error) {
      throw baseService.handleError(error, 'Failed to create coupon');
    }
  }
};