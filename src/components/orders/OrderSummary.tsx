import React from 'react';
import { useOrderStore } from '../../store/orderStore';
import { formatCurrency } from '../../lib/utils';
import {
  calculateSubtotal,
  calculateCouponDiscount,
  calculateTotal
} from '../../lib/utils/calculations';

export function OrderSummary() {
  const {
    products = [],
    selectedShippingMethod,
    productCoupons = {}
  } = useOrderStore();

  const subtotal = calculateSubtotal(products || []);
  const couponDiscount = calculateCouponDiscount(productCoupons || {}, products || []);
  const total = calculateTotal(products || [], productCoupons || {}, selectedShippingMethod);

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
      
      <div className="space-y-4">
        {products && products.map((product) => {
          const productTotal = product.product_price * (product.quantity || 1);
          const couponInfo = productCoupons?.[product.product_id];
          
          return (
            <div key={product.product_id} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">
                  {product.product_name} x {product.quantity || 1}
                </span>
                <span className="font-medium">
                  {formatCurrency(productTotal)}
                </span>
              </div>
              {couponInfo?.isValid && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Discount</span>
                  <span>-{formatCurrency(couponInfo.discount)}</span>
                </div>
              )}
            </div>
          );
        })}

        <div className="border-t pt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Subtotal</span>
            <span className="font-medium">{formatCurrency(subtotal)}</span>
          </div>
          
          {selectedShippingMethod && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Shipping</span>
              <span className="font-medium">
                {parseFloat(selectedShippingMethod.initial_amount) === 0 
                  ? 'FREE' 
                  : formatCurrency(parseFloat(selectedShippingMethod.initial_amount))
                }
              </span>
            </div>
          )}

          {couponDiscount > 0 && (
            <div className="flex justify-between text-sm text-green-600">
              <span>Total Discount</span>
              <span>-{formatCurrency(couponDiscount)}</span>
            </div>
          )}

          <div className="flex justify-between text-base font-medium border-t pt-2">
            <span>Total</span>
            <span>{formatCurrency(total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}