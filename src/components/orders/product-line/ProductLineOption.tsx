import React from 'react';
import { cn } from '../../../lib/utils';
import type { ProductLine } from '../../../lib/constants/productLines';

interface ProductLineOptionProps {
  id: ProductLine;
  name: string;
  logo: string;
  isSelected: boolean;
  onSelect: (line: ProductLine) => void;
  disabled?: boolean;
}

export function ProductLineOption({ 
  id, 
  name, 
  logo, 
  isSelected, 
  onSelect,
  disabled = false
}: ProductLineOptionProps) {
  return (
    <div
      className={cn(
        'flex items-center p-4 border rounded-lg transition-all duration-200',
        isSelected
          ? 'border-primary-500 bg-primary-50'
          : 'border-gray-200 hover:border-primary-200',
        !disabled && 'cursor-pointer'
      )}
      onClick={() => !disabled && onSelect(id)}
    >
      <input
        type="radio"
        name="productLine"
        checked={isSelected}
        onChange={() => !disabled && onSelect(id)}
        disabled={disabled}
        className={cn(
          "h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300",
          disabled && "cursor-not-allowed opacity-50"
        )}
      />
      <div className="ml-3 flex items-center gap-3">
        <img 
          src={logo}
          alt={`${name} Logo`}
          className="h-8 w-auto"
        />
        <span className="font-medium">{name}</span>
      </div>
    </div>
  );
}