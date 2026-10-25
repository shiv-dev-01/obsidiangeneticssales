import React, { useEffect, useMemo, useState } from 'react';
import { DollarSign, Loader2, Pencil, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import { pricingService } from '../../lib/api/services/pricing';
import { PaginationControls } from '../../components/ui/pagination/PaginationControls';
import { EditPriceModal } from '../../components/pricing/EditPriceModal';
import type { WebProduct } from '../../lib/types/pricing';

const PAGE_SIZE = 20;

function money(value: number): string {
  return `$${value.toFixed(2)}`;
}

export function ProductPricingPage() {
  const [products, setProducts] = useState<WebProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState<WebProduct | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const load = async () => {
    setIsLoading(true);
    setError('');
    try {
      const list = await pricingService.getWebProducts();
      setProducts(list);
    } catch (err) {
      setProducts([]);
      setError(err instanceof Error ? err.message : 'Failed to load products.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const categories = useMemo(() => {
    const values = [...new Set(products.map((p) => p.category).filter(Boolean))].sort();
    return ['all', ...values];
  }, [products]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return products.filter((product) => {
      const matchesCategory = category === 'all' || product.category === category;
      if (!matchesCategory) return false;
      if (!q) return true;
      return [product.productName, product.sku, product.productId, product.stickyProductId]
        .join(' ')
        .toLowerCase()
        .includes(q);
    });
  }, [products, search, category]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageRows = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const handleSave = async (price: number) => {
    if (!editing) return;
    if (!editing.stickyProductId) {
      toast.error('This product is missing a Sticky ID, so the price cannot be updated.');
      return;
    }

    setIsSaving(true);
    try {
      const result = await pricingService.updateProductPrice(editing.stickyProductId, price);
      const nextPrice = Number(result.product_price ?? price);
      setProducts((list) =>
        list.map((item) =>
          item.stickyProductId === editing.stickyProductId
            ? { ...item, price: Number.isFinite(nextPrice) ? nextPrice : price }
            : item
        )
      );
      toast.success(result.message || 'Product price updated successfully.');
      setEditing(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'The product price could not be updated.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-primary-100 rounded-lg">
            <DollarSign className="h-6 w-6 text-primary-600" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-secondary-600">
            Product Pricing
          </h1>
        </div>
        <p className="text-gray-600 text-lg">
          Review catalog prices and update them for Sticky and the local product record.
        </p>
      </div>

      <div className="mb-6 grid grid-cols-1 md:grid-cols-[1fr_220px] gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="search"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search by product name, SKU, or Product ID"
            className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
          />
        </div>
        <select
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setPage(1);
          }}
          className="rounded-lg border border-gray-300 bg-white py-2.5 px-3 text-sm text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
        >
          {categories.map((item) => (
            <option key={item} value={item}>
              {item === 'all' ? 'All categories' : item}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div className="mb-6 flex items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <span>{error}</span>
          <button
            type="button"
            onClick={load}
            className="rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-medium hover:bg-red-100"
          >
            Retry
          </button>
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-16 text-gray-600">
          <Loader2 className="h-8 w-8 animate-spin text-primary-600 mr-2" />
          Loading product pricing…
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 py-16 text-center text-gray-500">
          {search.trim() || category !== 'all'
            ? 'No products match your search.'
            : 'No products were found.'}
        </div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50/90">
                  <th className="px-5 py-3 font-semibold text-xs uppercase tracking-wide text-gray-500">
                    Product Name
                  </th>
                  <th className="px-5 py-3 font-semibold text-xs uppercase tracking-wide text-gray-500">
                    SKU
                  </th>
                  <th className="px-5 py-3 font-semibold text-xs uppercase tracking-wide text-gray-500">
                    Product ID
                  </th>
                  <th className="px-5 py-3 font-semibold text-xs uppercase tracking-wide text-gray-500 text-right">
                    Price
                  </th>
                  <th className="px-5 py-3 font-semibold text-xs uppercase tracking-wide text-gray-500">
                    Category
                  </th>
                  <th className="px-5 py-3 font-semibold text-xs uppercase tracking-wide text-gray-500 text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {pageRows.map((product) => (
                  <tr key={`${product.productId}-${product.stickyProductId}`} className="hover:bg-gray-50/80">
                    <td className="px-5 py-4 font-semibold text-gray-900 min-w-[220px]">
                      {product.productName || '—'}
                    </td>
                    <td className="px-5 py-4 text-gray-700 whitespace-nowrap">
                      {product.sku || '—'}
                    </td>
                    <td className="px-5 py-4 text-gray-700 whitespace-nowrap">
                      {product.productId || '—'}
                    </td>
                    <td className="px-5 py-4 text-right font-semibold text-primary-700 whitespace-nowrap">
                      {money(product.price)}
                    </td>
                    <td className="px-5 py-4 text-gray-700 whitespace-nowrap">
                      {product.category || '—'}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => setEditing(product)}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-orange-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-orange-600 transition-colors"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-8 mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <p className="text-sm text-gray-500">
              {filtered.length} product{filtered.length === 1 ? '' : 's'}
            </p>
            {totalPages > 1 && (
              <PaginationControls
                currentPage={safePage}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            )}
          </div>
        </>
      )}

      {editing && (
        <EditPriceModal
          product={editing}
          isSubmitting={isSaving}
          onClose={() => !isSaving && setEditing(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
