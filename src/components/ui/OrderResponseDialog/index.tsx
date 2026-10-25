import React from 'react';
import { DialogHeader } from './DialogHeader';
import { OrderList } from './OrderList';
import { ErrorList } from './ErrorList';
import type { OrderSuccess, OrderError } from '../../../lib/types/order';

interface OrderResponseDialogProps {
  orders: OrderSuccess[];
  errors: OrderError[];
  message: string;
  onClose: () => void;
}

export function OrderResponseDialog({ orders, errors, message, onClose }: OrderResponseDialogProps) {
  const hasErrors = errors.length > 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl transform transition-all animate-scaleIn">
        <DialogHeader hasErrors={hasErrors} onClose={onClose} />
        
        <div className="mb-6">
          <p className="text-gray-600 mb-4">{message}</p>
          <OrderList orders={orders} />
          <ErrorList errors={errors} />
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