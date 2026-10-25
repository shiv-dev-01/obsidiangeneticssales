import React from 'react';
import { useProductLineStore } from '../../store/productLineStore';
import { ProductLineHeader } from './product-line/ProductLineHeader';
import { ProductLineGrid } from './product-line/ProductLineGrid';
import { useAuthStore } from '../../store/authStore';

export function ProductLineSelector() {
  const { selectedLine, availableLines, setSelectedLine } = useProductLineStore();
  const permission = useAuthStore((state) => state.getPermissionLevel());

  // Show message if no permission or no available lines
  if (!permission || availableLines.length === 0) {
    return (
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="text-center text-red-600">
          No product lines available. Please contact your administrator.
        </div>
      </div>
    );
  }

  // Disable selection if only one line available
  const disableSelection = availableLines.length === 1;

  return (
    <div className="bg-white shadow rounded-lg p-6 mb-6">
      <ProductLineHeader />
      <ProductLineGrid 
        selectedLine={selectedLine!}
        onSelect={setSelectedLine}
        availableLines={availableLines}
        disabled={disableSelection}
      />
    </div>
  );
}