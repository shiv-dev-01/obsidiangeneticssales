import React from 'react';
import type { OrderError } from '../../../lib/types/order';

interface ErrorListProps {
  errors: OrderError[];
}

export function ErrorList({ errors }: ErrorListProps) {
  if (errors.length === 0) return null;

  return (
    <div className="space-y-2">
      <h3 className="font-medium text-gray-900">Errors:</h3>
      {errors.map((error, index) => (
        <div
          key={index}
          className="p-3 bg-red-50 border border-red-100 rounded-lg text-red-700 animate-fadeIn"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          {error.message}
        </div>
      ))}
    </div>
  );
}