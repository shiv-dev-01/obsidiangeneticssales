import React from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';

interface DialogHeaderProps {
  hasErrors: boolean;
  onClose: () => void;
}

export function DialogHeader({ hasErrors, onClose }: DialogHeaderProps) {
  return (
    <div className="flex justify-between items-start mb-4">
      <div className="flex items-center">
        {hasErrors ? (
          <XCircle className="h-6 w-6 text-red-500 mr-2 animate-fadeIn" />
        ) : (
          <CheckCircle className="h-6 w-6 text-green-500 mr-2 animate-fadeIn" />
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
  );
}