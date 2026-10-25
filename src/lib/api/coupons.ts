import { couponService } from './services/coupons';

// Re-export the coupon service functions
export const {
  validateCoupon,
  createCoupon
} = couponService;

// Re-export types
export type {
  CouponValidationResponse,
  CreateCouponData,
  CreateCouponResponse
} from './services/coupons';