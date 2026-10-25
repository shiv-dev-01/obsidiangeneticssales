import React, { useEffect, useState } from 'react';
import { Loader2, X } from 'lucide-react';
import type { WebProduct } from '../../lib/types/pricing';

interface EditPriceModalProps {
  product: WebProduct;
  isSubmitting: boolean;
  onClose: () => void;
  onSave: (price: number) => void;
}

function money(value: number): string {
  return `$${value.toFixed(2)}`;
}

export function EditPriceModal({
  product,
  isSubmitting,
  onClose,
  onSave,
}: EditPriceModalProps) {
  const [price, setPrice] = useState(product.price.toFixed(2));
  const [error, setError] = useState('');

  useEffect(() => {
    setPrice(product.price.toFixed(2));
    setError('');
  }, [product]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const next = Number(price);
    if (price.trim() === '' || Number.isNaN(next)) {
      setError('Enter a valid price.');
      return;
    }
    if (next < 0) {
      setError('Price cannot be negative.');
      return;
    }
    onSave(next);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="presentation"
      onClick={() => !isSubmitting && onClose()}
    >
      <div
        className="w-full max-w-md rounded-xl bg-white shadow-xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-price-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 id="edit-price-title" className="text-lg font-semibold text-gray-900">
            Edit product price
          </h2>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-lg p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-50"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <dl className="grid grid-cols-2 gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm">
            <div className="col-span-2">
              <dt className="text-xs uppercase tracking-wide text-gray-500">Product Name</dt>
              <dd className="mt-0.5 font-medium text-gray-900">{product.productName || '—'}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-gray-500">Product ID</dt>
              <dd className="mt-0.5 font-medium text-gray-900">{product.productId || '—'}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-gray-500">SKU</dt>
              <dd className="mt-0.5 font-medium text-gray-900 break-all">{product.sku || '—'}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-gray-500">Sticky ID</dt>
              <dd className="mt-0.5 font-medium text-gray-900">{product.stickyProductId || '—'}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-gray-500">Current price</dt>
              <dd className="mt-0.5 font-semibold text-primary-700">{money(product.price)}</dd>
            </div>
          </dl>

          <div>
            <label htmlFor="product-price" className="block text-sm font-medium text-gray-700 mb-2">
              Price
            </label>
            <input
              id="product-price"
              type="number"
              min={0}
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              disabled={isSubmitting}
              className="w-full rounded-lg border border-gray-300 py-2.5 px-3 text-sm text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 disabled:opacity-50"
            />
            {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
          </div>

          <div className="flex justify-end gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-lg border border-gray-300 bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
