import React from 'react';
import { Truck } from 'lucide-react';
import type { ShippingMethod } from '../../../lib/types';
import { cn } from '../../../lib/utils';

interface ShippingMethodCardProps {
  method: ShippingMethod;
  isSelected: boolean;
  onSelect: (method: ShippingMethod) => void;
}

export function ShippingMethodCard({ method, isSelected, onSelect }: ShippingMethodCardProps) {
  return (
    <label
      className={cn(
        'flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all duration-200',
        isSelected
          ? 'border-primary-500 bg-primary-50'
          : 'border-gray-200 hover:border-primary-200'
      )}
    >
      <div className="flex items-center">
        <input
          type="radio"
          name="shippingMethod"
          checked={isSelected}
          onChange={() => onSelect({
            ...method,
            price: parseFloat(method.initial_amount)
          })}
          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
        />
        <div className="ml-4">
          <div className="flex items-center">
            <Truck className="h-5 w-5 text-gray-400 mr-2" />
            <span className="font-medium">{method.name}</span>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            {method.description}
          </p>
        </div>
      </div>
      <span className="font-medium">
        {parseFloat(method.initial_amount) === 0 ? 'FREE' : `$${method.initial_amount}`}
      </span>
    </label>
  );
}