import type { Product } from '../api/services/products';
import type { ShippingMethod } from '../types';

interface CouponInfo {
  isValid: boolean;
  discount: number;
  discountType?: 'percent' | 'amount';
  discountValue?: number;
}

export function calculateProductTotal(product: Product): number {
  return product.product_price * (product.quantity || 1);
}

export function calculateSubtotal(products: Product[]): number {
  return products.reduce((total, product) => total + calculateProductTotal(product), 0);
}

export function calculateCouponDiscount(
  productCoupons: Record<number, CouponInfo>,
  products: Product[]
): number {
  if (!productCoupons) return 0;
  
  return Object.entries(productCoupons).reduce((total, [productId, coupon]) => {
    if (coupon?.isValid) {
      const product = products.find(p => p.product_id.toString() === productId);
      if (product) {
        const productTotal = calculateProductTotal(product);
        if (coupon.discountType === 'percent' && coupon.discountValue) {
          return total + (productTotal * coupon.discountValue / 100);
        }
        return total + (coupon.discount || 0);
      }
    }
    return total;
  }, 0);
}

export function calculateTotal(
  products: Product[],
  productCoupons: Record<number, CouponInfo>,
  shippingMethod: ShippingMethod | null
): number {
  const subtotal = calculateSubtotal(products);
  const couponDiscount = calculateCouponDiscount(productCoupons, products);
  const shippingCost = shippingMethod ? parseFloat(shippingMethod.initial_amount) : 0;

  return subtotal - couponDiscount + shippingCost;
}