import React from 'react';
import { CheckCircle, X } from 'lucide-react';

interface OrderSuccessDialogProps {
  orders: Array<{ order_id: string; status: number }>;
  onClose: () => void;
}

export function OrderSuccessDialog({ orders, onClose }: OrderSuccessDialogProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center">
            <CheckCircle className="h-6 w-6 text-green-500 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Orders Created Successfully</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="mb-6">
          <p className="text-gray-600 mb-4">Your orders have been created successfully.</p>
          <div className="space-y-2">
            {orders.map((order) => (
              <div
                key={order.order_id}
                className="flex items-center justify-between p-3 bg-green-50 border border-green-100 rounded-lg"
              >
                <span className="text-gray-700 font-medium">Order ID:</span>
                <span className="text-primary-600 font-semibold">{order.order_id}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}