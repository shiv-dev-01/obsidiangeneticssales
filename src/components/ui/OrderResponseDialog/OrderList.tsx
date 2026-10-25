import React from 'react';
import type { OrderSuccess } from '../../../lib/types/order';

interface OrderListProps {
  orders: OrderSuccess[];
}

export function OrderList({ orders }: OrderListProps) {
  if (orders.length === 0) return null;

  return (
    <div className="space-y-2 mb-4">
      <h3 className="font-medium text-gray-900">Successful Orders:</h3>
      {orders.map((order, index) => (
        <div
          key={order.order_id}
          className="flex items-center justify-between p-3 bg-green-50 border border-green-100 rounded-lg animate-fadeIn"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <span className="text-gray-700 font-medium">Order ID:</span>
          <span className="text-primary-600 font-semibold">{order.order_id}</span>
        </div>
      ))}
    </div>
  );
}