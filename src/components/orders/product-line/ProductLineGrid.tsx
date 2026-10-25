import React from 'react';
import { ProductLineOption } from './ProductLineOption';
import { PRODUCT_LINES, type ProductLine } from '../../../lib/constants/productLines';

interface ProductLineGridProps {
  selectedLine: ProductLine;
  onSelect: (line: ProductLine) => void;
  availableLines: ProductLine[];
  disabled?: boolean;
}

export function ProductLineGrid({ 
  selectedLine, 
  onSelect, 
  availableLines,
  disabled = false 
}: ProductLineGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {Object.entries(PRODUCT_LINES)
        .filter(([key]) => availableLines.includes(key as ProductLine))
        .map(([key, line]) => (
          <ProductLineOption
            key={key}
            id={key as ProductLine}
            name={line.name}
            logo={line.logo}
            isSelected={selectedLine === key}
            onSelect={onSelect}
            disabled={disabled}
          />
        ))}
    </div>
  );
}