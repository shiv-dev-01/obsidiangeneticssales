import React from 'react';
import { Store } from 'lucide-react';

export function ProductLineHeader() {
  return (
    <div className="flex items-center gap-2 mb-4">
      <Store className="h-5 w-5 text-gray-400" />
      <h2 className="text-lg font-medium text-gray-900">Product Line</h2>
    </div>
  );
}