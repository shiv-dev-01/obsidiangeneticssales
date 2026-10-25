import { useState, useEffect } from 'react';
import { useProductLineStore } from '../../store/productLineStore';
import { productService } from '../api/services/products';
import type { Product } from '../types/product';
import toast from 'react-hot-toast';

export function useProductList(searchTerm: string) {
  const { selectedLine } = useProductLineStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      if (!selectedLine) return;
      
      setIsLoading(true);
      try {
        const response = await productService.getProducts(selectedLine);
        if (response.status === 1) {
          setProducts(response.product || []);
        } else {
          toast.error('Failed to load products');
        }
      } catch (error) {
        toast.error('Error loading products');
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, [selectedLine]);

  const filteredProducts = products.filter(product =>
    product.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.product_sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return {
    products,
    isLoading,
    filteredProducts
  };
}