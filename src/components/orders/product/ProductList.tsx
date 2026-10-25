import React from 'react';
import { Loader2 } from 'lucide-react';
import type { Product } from '../../../lib/types/product';
import { formatCurrency } from '../../../lib/utils';
import bottleImg from '../../../assets/bottel_img.png';


interface ProductListProps {
  products: Product[];
  isLoading: boolean;
  onSelect: (product: Product) => void;
}

export function ProductList({ products, isLoading, onSelect }: ProductListProps) {
  const handleImageError = (event: React.SyntheticEvent<HTMLImageElement>) => {
    event.currentTarget.src = bottleImg;
  };

  if (isLoading) {
    return (
      <div className="p-4 text-center text-gray-500">
        <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
        Loading products...
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        No products found
      </div>
    );
  }

  return (
    <div className="py-2">
      {products.map((product) => (
        <div
          key={product.product_id}
          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
          onClick={() => onSelect(product)}
        >
          <div className="flex items-start space-x-3">
            <img
              src={product.product_img?.[0]?.img_video || bottleImg} // Use the fallback image if no image is present
              alt={product.product_name}
              className="h-14 w-14 shrink-0 rounded bg-gray-100 object-contain p-1"
              onError={handleImageError}
            />
            <div className="flex-1">
              <div className="font-medium">{product.product_name}</div>
              <div className="text-sm text-gray-500">SKU: {product.product_sku}</div>
              <div className="text-sm font-medium text-primary-600">
                {formatCurrency(product.product_price)}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}