import { useState } from 'react';
import { useOrderStore } from '../../store/orderStore';
import type { Product } from '../../types/product';
import toast from 'react-hot-toast';

export function useProductSelection() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { products = [], addProduct } = useOrderStore();

  const handleProductSelect = (product: Product) => {
    const existingProduct = products?.find(p => p.product_id === product.product_id);
    if (existingProduct) {
      toast.error('Product already added to the order');
      return;
    }

    addProduct({
      ...product,
      quantity: 1
    });
    setIsOpen(false);
    setSearchTerm('');
  };

  return {
    isOpen,
    setIsOpen,
    searchTerm,
    setSearchTerm,
    handleProductSelect
  };
}