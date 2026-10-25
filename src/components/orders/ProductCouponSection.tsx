import React from 'react';
import { Loader2, X } from 'lucide-react';
import { useOrderStore } from '../../store/orderStore';
import { useProductLineStore } from '../../store/productLineStore';
import { couponService } from '../../lib/api/services/coupons';
import { formatCurrency } from '../../lib/utils';
import { calculateProductTotal } from '../../lib/utils/calculations';
import type { Product } from '../../lib/api/services/products';
import toast from 'react-hot-toast';

interface ProductCouponSectionProps {
  product: Product;
}

export function ProductCouponSection({ product }: ProductCouponSectionProps) {
  const { selectedLine } = useProductLineStore();
  const {
    productCoupons,
    setProductCoupon,
    clearProductCoupon
  } = useOrderStore();
  const [isValidating, setIsValidating] = React.useState(false);

  const couponInfo = productCoupons[product.product_id];
  const productTotal = calculateProductTotal(product);

  const handleValidateCoupon = async (code: string) => {
    if (!code.trim()) return;
    
    setIsValidating(true);
    try {
      const response = await couponService.validateCoupon(
        selectedLine,
        code,
        productTotal,
        product.quantity || 1
      );

      if (response.status === 1) {
        // Calculate discount based on percentage or fixed amount
        let discount = 0;
        const discountPercent = parseFloat(response.discount_percent);
        const discountAmount = parseFloat(response.discount_amount);

        if (discountAmount > 0) {
          // Use fixed amount discount
          discount = discountAmount;
        } else if (discountPercent > 0) {
          // Calculate percentage discount
          discount = (productTotal * discountPercent) / 100;
        }

        setProductCoupon(product.product_id, {
          code,
          isValid: true,
          discount,
          discountType: discountAmount > 0 ? 'amount' : 'percent',
          discountValue: discountAmount > 0 ? discountAmount : discountPercent
        });
        toast.success('Coupon applied successfully!');
      } else {
        setProductCoupon(product.product_id, {
          code,
          isValid: false,
          discount: 0,
          error: response.message
        });
        toast.error(response.message || 'Invalid coupon code');
      }
    } catch (error) {
      setProductCoupon(product.product_id, {
        code,
        isValid: false,
        discount: 0,
        error: 'Failed to validate coupon'
      });
      toast.error('Failed to validate coupon');
    } finally {
      setIsValidating(false);
    }
  };

  const handleCouponChange = (code: string) => {
    setProductCoupon(product.product_id, {
      code: code.toUpperCase(),
      isValid: false,
      discount: 0
    });
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">
          Coupon for {product.product_name}
        </h3>
        <span className="text-sm text-gray-500">
          SKU: {product.product_sku}
        </span>
      </div>

      <div className="space-y-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={couponInfo?.code || ''}
              onChange={(e) => handleCouponChange(e.target.value)}
              placeholder="Enter promo code"
              className="block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 pr-8"
            />
            {couponInfo?.code && (
              <button
                onClick={() => clearProductCoupon(product.product_id)}
                className="absolute right-2 top-2.5 text-gray-400 hover:text-gray-500"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <button
            onClick={() => handleValidateCoupon(couponInfo?.code || '')}
            disabled={isValidating || !couponInfo?.code}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[100px]"
          >
            {isValidating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              'Apply'
            )}
          </button>
        </div>

        {couponInfo?.isValid && (
          <div className="flex justify-between items-center text-sm">
            <span className="text-green-600">
              {couponInfo.discountType === 'percent' 
                ? `${couponInfo.discountValue}% off`
                : 'Fixed amount discount'}
            </span>
            <span className="font-medium text-green-600">
              -{formatCurrency(couponInfo.discount)}
            </span>
          </div>
        )}

        {couponInfo?.error && (
          <p className="text-sm text-red-600">
            {couponInfo.error}
          </p>
        )}
      </div>
    </div>
  );
}