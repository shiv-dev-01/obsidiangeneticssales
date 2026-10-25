import React from 'react';
import { useOrderStore } from '../../store/orderStore';
import { ProductDropdown } from './product/ProductDropdown';
import { SelectedProducts } from './product/SelectedProducts';
import { useProductSelection } from '../../lib/hooks/useProductSelection';
import { useProductList } from '../../lib/hooks/useProductList';

export function ProductSection() {
  const { products = [], removeProduct } = useOrderStore();
  const { 
    isOpen, 
    setIsOpen, 
    searchTerm, 
    setSearchTerm, 
    handleProductSelect 
  } = useProductSelection();
  
  const { filteredProducts, isLoading } = useProductList(searchTerm);

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Products</h2>
      
      <div className="mb-6">
        <ProductDropdown
          isOpen={isOpen}
          onToggle={() => setIsOpen(!isOpen)}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          products={filteredProducts}
          isLoading={isLoading}
          onSelect={handleProductSelect}
        />
      </div>

      {products && products.length > 0 && (
        <SelectedProducts
          products={products}
          onRemove={removeProduct}
        />
      )}
    </div>
  );
}