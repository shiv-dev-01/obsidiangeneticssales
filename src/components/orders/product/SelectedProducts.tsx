import React from 'react';
import { X } from 'lucide-react';
import type { Product } from '../../../lib/api/services/products';
import { formatCurrency } from '../../../lib/utils';
import bottleImg from '../../../assets/bottel_img.png';


interface SelectedProductsProps {
  products: Product[];
  onRemove: (productId: string) => void;
}

export function SelectedProducts({ products, onRemove }: SelectedProductsProps) {
  const handleImageError = (event: React.SyntheticEvent<HTMLImageElement>) => {
    event.currentTarget.src = 'https://via.placeholder.com/150?text=No+Image';
  };

  if (products.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h3 className="font-medium text-gray-700">Selected Products</h3>
      {products.map((product) => (
        <div key={product.product_id} className="flex items-center justify-between border-b pb-4">
          <div className="flex items-center space-x-4">
          <img
              src={product.product_img?.[0]?.img_video || bottleImg} // Use the fallback image if no image is provided
              alt={product.product_name}
              className="w-10 h-18 object-cover rounded bg-gray-100"
              onError={handleImageError}
            />
            <div>
              <h3 className="font-medium">{product.product_name}</h3>
              <p className="text-sm text-gray-500">SKU: {product.product_sku}</p>
              <p className="text-sm font-medium">{formatCurrency(product.product_price)}</p>
              <p className="text-xs text-gray-500">Quantity: {product.quantity || 1}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onRemove(product.product_id.toString())}
            className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      ))}
    </div>
  );
}