import React from 'react';
import { formatCurrency } from '../../lib/utils';
import type { Order } from '../../lib/types/order';

interface OrderCardProps {
  order: Order;
}

export function OrderCardByEmail({ order }: OrderCardProps) {
  console.log("133", order);
  
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
      <div className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Order #{order.order_id}
            </h3>
            {/* <p className="text-sm text-gray-500">
              {order.first_name} {order.last_name}
            </p> */}
            {/* <p className="text-sm text-gray-500">{order.customer_info.email_address}</p> */}
          </div>
        </div>
        
        <div className="space-y-2">
          {/* {order.products.map((product) => ( */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-2 border-t gap-2">
              <div className="flex-1">
                <p className="font-medium">{order.product_name}</p>
                <p className="text-sm text-gray-500">SKU: {order.product_sku}</p>
                <p className="text-sm text-gray-500">
                  Time: {order.time}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium">{formatCurrency(parseFloat(order.product_price))}</p>
                {/* <p className="text-sm text-gray-500">Qty: {order.product_qty}</p> */}
              </div>
            </div>
          {/* ))} */}
        </div>
      </div>
    </div>
  );
}