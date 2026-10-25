import React from 'react';
import { Loader2 } from 'lucide-react';

export function LoadingState() {
  return (
    <div className="flex items-center justify-center py-8">
      <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      <span className="ml-2 text-gray-600">Loading shipping methods...</span>
    </div>
  );
}