import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Download,
  FileText,
  Filter,
  Loader2,
} from 'lucide-react';
import { Link, useLocation, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { orderService } from '../../lib/api/services/orders';
import { useProductLineStore } from '../../store/productLineStore';
import { cn } from '../../lib/utils';
import type { Order, OrderListPagination } from '../../lib/types/order';

const PER_PAGE_OPTIONS = [5, 10, 25, 50];

function formatOrderDate(value?: string): string {
  if (!value) return '—';
  const normalized = value.includes('T') ? value : value.replace(' ', 'T');
  const d = new Date(normalized);
  if (Number.isNaN(d.getTime())) return value;
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(d);
}

function formatCurrency(value?: string | number): string {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (num == null || Number.isNaN(num)) return '$0.00';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(num);
}

function parseOrderDate(value?: string): Date | null {
  if (!value) return null;
  const normalized = value.includes('T') ? value : value.replace(' ', 'T');
  const d = new Date(normalized);
  return Number.isNaN(d.getTime()) ? null : d;
}

function formatCommission(order: Order): string {
  const amount = order.customer_info.agent_commission_amount;
  const commission = order.customer_info.agent_commission;
  if (!amount || amount === '0') return '—';
  if (order.customer_info.agent_commission_type === 'dollar') {
    return formatCurrency(amount);
  }
  return `$${commission ?? amount}`;
}

function customerName(order: Order): string {
  const { first_name, last_name } = order.customer_info;
  return [first_name, last_name].filter(Boolean).join(' ');
}

function isWithinDateRange(
  orderDate: string | undefined,
  from: string,
  to: string
): boolean {
  const date = parseOrderDate(orderDate);
  if (!date) return true;

  if (from) {
    const fromDate = new Date(from);
    fromDate.setHours(0, 0, 0, 0);
    if (date < fromDate) return false;
  }

  if (to) {
    const toDate = new Date(to);
    toDate.setHours(23, 59, 59, 999);
    if (date > toDate) return false;
  }

  return true;
}

interface ProductSalesRow {
  name: string;
  sku: string;
  quantity: number;
  total: number;
}

export function AgentOrdersPage() {
  const { agentId } = useParams<{ agentId: string }>();
  const location = useLocation();
  const agentName =
    (location.state as { agentName?: string } | null)?.agentName ??
    `Agent ${agentId}`;

  const { selectedLine } = useProductLineStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [pagination, setPagination] = useState<OrderListPagination | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(5);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [showProductSales, setShowProductSales] = useState(false);

  const parsedAgentId = Number(agentId);

  const load = useCallback(async () => {
    if (!selectedLine || !parsedAgentId || Number.isNaN(parsedAgentId)) return;

    setIsLoading(true);
    try {
      const res = await orderService.getAgentOrders(
        selectedLine,
        parsedAgentId,
        currentPage,
        perPage
      );
      if (res.status === 1) {
        setOrders(res.data ?? []);
        setPagination(res.pagination ?? null);
      } else {
        setOrders([]);
        setPagination(null);
        toast.error(res.message || 'Failed to load agent orders');
      }
    } catch {
      setOrders([]);
      setPagination(null);
      toast.error('Failed to load agent orders');
    } finally {
      setIsLoading(false);
    }
  }, [selectedLine, parsedAgentId, currentPage, perPage]);

  useEffect(() => {
    load();
  }, [load]);

  const filteredOrders = useMemo(
    () =>
      orders.filter((order) =>
        isWithinDateRange(order.customer_info.order_date, dateFrom, dateTo)
      ),
    [orders, dateFrom, dateTo]
  );

  const totalSalesCount = filteredOrders.length;
  const totalSalesAmount = useMemo(
    () =>
      filteredOrders.reduce(
        (sum, order) => sum + parseFloat(order.customer_info.order_total ?? '0'),
        0
      ),
    [filteredOrders]
  );

  const productSales = useMemo(() => {
    const map = new Map<string, ProductSalesRow>();

    filteredOrders.forEach((order) => {
      order.products.forEach((product) => {
        const key = product.product_id;
        const qty = parseInt(product.product_qty, 10) || 0;
        const price = parseFloat(product.price) || 0;
        const existing = map.get(key);

        if (existing) {
          existing.quantity += qty;
          existing.total += qty * price;
        } else {
          map.set(key, {
            name: product.name,
            sku: product.sku,
            quantity: qty,
            total: qty * price,
          });
        }
      });
    });

    return Array.from(map.values()).sort((a, b) => b.total - a.total);
  }, [filteredOrders]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePerPageChange = (value: number) => {
    setPerPage(value);
    setCurrentPage(1);
  };

  const handleExportCsv = () => {
    if (filteredOrders.length === 0) {
      toast.error('No orders to export');
      return;
    }

    const headers = [
      'Order ID',
      'Customer',
      'Email',
      'Date',
      'Products',
      'Order Total',
      'Commission',
    ];

    const rows = filteredOrders.map((order) => [
      order.customer_info.order_id,
      customerName(order),
      order.customer_info.email_address,
      formatOrderDate(order.customer_info.order_date),
      order.products
        .map(
          (p) =>
            `${p.name} (Qty: ${p.product_qty}, ${formatCurrency(p.price)})`
        )
        .join('; '),
      order.customer_info.order_total ?? '',
      formatCommission(order),
    ]);

    const csv = [headers, ...rows]
      .map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')
      )
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `agent-${agentId}-orders-page-${currentPage}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('CSV exported');
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pb-10">
      <Link
        to="/agents"
        className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-violet-900 mb-4 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Agents
      </Link>

      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="p-2 bg-violet-100 rounded-lg">
            <FileText className="h-6 w-6 text-violet-700" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Agent Orders
          </h1>
        </div>
        <p className="text-gray-600 ml-12">Orders for {agentName}</p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5 mb-6 shadow-sm">
        <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-4">
          <Filter className="h-4 w-4" />
          Filters
        </div>

        <div className="rounded-lg bg-blue-50 border border-blue-100 px-4 py-3 text-sm text-blue-800 mb-4">
          Note: filters, statistics, and CSV export are based on the current page
          table data only.
        </div>

        <div className="flex flex-wrap items-end gap-4 mb-5">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              From:
            </label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              To:
            </label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-4">
            <div className="rounded-lg bg-violet-50 border border-violet-100 px-5 py-3 min-w-[140px]">
              <div className="text-xs font-medium text-violet-600 uppercase tracking-wide">
                Total Sales Count
              </div>
              <div className="text-2xl font-bold text-violet-900 mt-1">
                {totalSalesCount}
              </div>
            </div>
            <div className="rounded-lg bg-emerald-50 border border-emerald-100 px-5 py-3 min-w-[160px]">
              <div className="text-xs font-medium text-emerald-600 uppercase tracking-wide">
                Total Sales Amount
              </div>
              <div className="text-2xl font-bold text-emerald-900 mt-1">
                {formatCurrency(totalSalesAmount)}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setShowProductSales(true)}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Show Product Sales
            </button>
            <button
              type="button"
              onClick={handleExportCsv}
              className="inline-flex items-center gap-2 rounded-lg bg-violet-900 px-4 py-2 text-sm font-medium text-white hover:bg-violet-950 transition-colors"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16 text-gray-600">
          <Loader2 className="h-8 w-8 animate-spin text-violet-700 mr-2" />
          Loading orders…
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 py-16 text-center text-gray-500">
          No orders found.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm mb-6">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/90">
                {[
                  'Order ID',
                  'Customer',
                  'Email',
                  'Date',
                  'Products',
                  'Order Total',
                  'Commission',
                ].map((col) => (
                  <th
                    key={col}
                    className="px-5 py-3 font-semibold text-xs uppercase tracking-wide text-gray-500"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOrders.map((order) => (
                <tr key={order.customer_info.order_id} className="hover:bg-gray-50/80">
                  <td className="px-5 py-4 align-top font-medium text-gray-900 whitespace-nowrap">
                    #{order.customer_info.order_id}
                  </td>
                  <td className="px-5 py-4 align-top text-gray-900 min-w-[120px]">
                    {customerName(order)}
                  </td>
                  <td className="px-5 py-4 align-top text-gray-700 min-w-[180px] break-all">
                    {order.customer_info.email_address}
                  </td>
                  <td className="px-5 py-4 align-top text-gray-700 whitespace-nowrap">
                    {formatOrderDate(order.customer_info.order_date)}
                  </td>
                  <td className="px-5 py-4 align-top text-gray-700 min-w-[260px]">
                    <div className="space-y-1">
                      {order.products.map((product) => (
                        <div key={product.product_id}>
                          {product.name} (Qty: {product.product_qty},{' '}
                          {formatCurrency(product.price)})
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-5 py-4 align-top font-medium text-gray-900 whitespace-nowrap">
                    {formatCurrency(order.customer_info.order_total)}
                  </td>
                  <td className="px-5 py-4 align-top text-gray-500 whitespace-nowrap">
                    {formatCommission(order)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {pagination && pagination.total_pages > 0 && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>Show per page:</span>
              <select
                value={perPage}
                onChange={(e) => handlePerPageChange(Number(e.target.value))}
                className="rounded-lg border border-gray-300 px-2 py-1.5 text-sm focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
              >
                {PER_PAGE_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={!pagination.has_previous_page}
                className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              {Array.from({ length: pagination.total_pages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => handlePageChange(page)}
                    className={cn(
                      'h-9 w-9 rounded-full text-sm font-medium transition-colors',
                      currentPage === page
                        ? 'bg-violet-900 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    )}
                  >
                    {page}
                  </button>
                )
              )}

              <button
                type="button"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={!pagination.has_next_page}
                className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>

          <p className="text-center text-sm text-gray-500">
            Showing page {pagination.current_page} of {pagination.total_pages} (
            {pagination.total_records} total orders)
          </p>
        </div>
      )}

      {showProductSales && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          role="presentation"
          onClick={() => setShowProductSales(false)}
        >
          <div
            className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl max-h-[80vh] overflow-y-auto"
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Product Sales (current page)
            </h2>
            {productSales.length === 0 ? (
              <p className="text-sm text-gray-500">No product data available.</p>
            ) : (
              <div className="space-y-3">
                {productSales.map((row) => (
                  <div
                    key={row.sku}
                    className="flex items-start justify-between gap-4 border-b border-gray-100 pb-3 last:border-0"
                  >
                    <div>
                      <div className="font-medium text-gray-900">{row.name}</div>
                      <div className="text-xs text-gray-500">{row.sku}</div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-sm text-gray-700">Qty: {row.quantity}</div>
                      <div className="text-sm font-medium text-gray-900">
                        {formatCurrency(row.total)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="flex justify-end mt-6">
              <button
                type="button"
                onClick={() => setShowProductSales(false)}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
