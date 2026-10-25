import React, { useRef, useEffect } from 'react';
import { Package, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { ProductSearch } from './ProductSearch';
import { ProductList } from './ProductList';
import type { Product } from '../../../lib/types/product';

interface ProductDropdownProps {
  isOpen: boolean;
  onToggle: () => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  products: Product[];
  isLoading: boolean;
  onSelect: (product: Product) => void;
}

export function ProductDropdown({
  isOpen,
  onToggle,
  searchTerm,
  onSearchChange,
  products,
  isLoading,
  onSelect
}: ProductDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onToggle();
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onToggle]);

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        className={cn(
          "relative w-full cursor-pointer border border-gray-300 rounded-lg",
          "focus-within:ring-2 focus-within:ring-primary-500/20 focus:border-primary-500",
          isOpen && "ring-2 ring-primary-500/20 border-primary-500"
        )}
        onClick={onToggle}
      >
        <div className="flex items-center px-3 py-2">
          <Package className="h-5 w-5 text-gray-400 mr-2" />
          <span className="text-gray-500">Search and select products...</span>
          {isOpen ? (
            <ChevronUp className="h-5 w-5 text-gray-400 ml-auto" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-400 ml-auto" />
          )}
        </div>

        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
            <div className="p-2">
              <ProductSearch 
                searchTerm={searchTerm}
                onSearchChange={onSearchChange}
              />
            </div>
            
            <div className="max-h-60 overflow-auto">
              <ProductList
                products={products}
                isLoading={isLoading}
                onSelect={onSelect}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}