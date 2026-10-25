import React from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';
import type { OrderSuccess, OrderError } from '../../lib/types/order';

interface OrderResponseDialogProps {
  orders: OrderSuccess[];
  errors: OrderError[];
  message: string;
  onClose: () => void;
}

export function OrderResponseDialog({ orders, errors, message, onClose }: OrderResponseDialogProps) {
  const hasErrors = errors.length > 0;
  const hasOrders = orders.length > 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center">
            {hasErrors ? (
              <XCircle className="h-6 w-6 text-red-500 mr-2" />
            ) : (
              <CheckCircle className="h-6 w-6 text-green-500 mr-2" />
            )}
            <h2 className="text-lg font-semibold text-gray-900">
              {hasErrors ? 'Order Processing Failed' : 'Orders Created Successfully'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="mb-6">
          <p className="text-gray-600 mb-4">{message}</p>

          {/* Successful Orders */}
          {hasOrders && (
            <div className="space-y-2 mb-4">
              <h3 className="font-medium text-gray-900">Successful Orders:</h3>
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
          )}

          {/* Error Messages */}
          {hasErrors && (
            <div className="space-y-2">
              <h3 className="font-medium text-gray-900">Errors:</h3>
              {errors.map((error, index) => (
                <div
                  key={index}
                  className="p-3 bg-red-50 border border-red-100 rounded-lg text-red-700"
                >
                  {error.message}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-lg text-white transition-colors ${
              hasErrors 
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-primary-600 hover:bg-primary-700'
            }`}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}