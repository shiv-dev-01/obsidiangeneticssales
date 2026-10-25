import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, FileText, Loader2, Hash } from 'lucide-react';
import { orderService } from '../../lib/api/services/orders';
import { useProductLineStore } from '../../store/productLineStore';
import { ProductLineSelector } from '../../components/orders/ProductLineSelector';
import { OrderCard } from '../../components/orders/OrderCard';
import { PaginationControls } from '../../components/ui/pagination/PaginationControls';
import type { Order, OrderListPagination } from '../../lib/types/order';
import toast from 'react-hot-toast';
import axios from 'axios';
import { OrderCardByEmail } from '../../components/orders/OrderCardByEmail';

export function OrderListEmail() {
  const [searchParams] = useSearchParams();
  const { selectedLine } = useProductLineStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [pagination, setPagination] = useState<OrderListPagination | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [emailId, setEmailId] = useState(() => searchParams.get('email') ?? '');
  const [debouncedOrderId, setDebouncedOrderId] = useState('');

  // Debounce order ID search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedOrderId(emailId);
    }, 300);

    return () => clearTimeout(timer);
  }, [emailId]);

  // Load orders
  useEffect(() => {
    const loadOrders = async () => {
      if (!selectedLine) return;
      
      setIsLoading(true);
      try {
        const response = await orderService.getOrdersEmail(
          selectedLine, 
          currentPage,
          debouncedOrderId
        );
        // const response = await axios.post('https://panel.whitelabelmd.com/obsidian/api/get_user_orders', {
        //   'email' : emailId
        // })
        if (response.status === 1) {
          setOrders(response.data);
          setPagination(response.pagination);
        } else {
          toast.error(response.message || 'Failed to load orders');
        }
      } catch (error) {
        toast.error('Failed to load orders');
      } finally {
        setIsLoading(false);
      }
    };

    loadOrders();
  }, [selectedLine, currentPage, debouncedOrderId]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-primary-100 rounded-lg">
            <FileText className="h-6 w-6 text-primary-600" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-secondary-600">
            Orders
          </h1>
        </div>
        <p className="text-gray-600 text-lg">
          View and manage all customer orders
        </p>
      </div>

      {/* Product Line Selector */}
      {/* <ProductLineSelector /> */}

      {/* Search by Order ID */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Search by Email..."
            value={emailId}
            onChange={(e) => setEmailId(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
          />
          <Hash className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
      </div>

      {/* Orders List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
          <span className="ml-2 text-gray-600">Loading orders...</span>
        </div>
      ) : orders.length > 0 ? (
        <div>
          <div className="grid grid-cols-1 gap-4 mb-6">
            {orders.map((order) =>{
              console.log("555", order);
              
               return(
              <OrderCardByEmail
                key={order.order_id}
                order={order}
              />
            )})}
          </div>

          {/* Pagination */}
          {pagination && (
            <div className="mt-8 mb-12">
              <PaginationControls
                currentPage={pagination.current_page}
                totalPages={pagination.total_pages}
                onPageChange={handlePageChange}
              />
              <div className="mt-4 text-center text-sm text-gray-500">
                Showing page {pagination.current_page} of {pagination.total_pages} ({pagination.total_records} total orders)
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">No orders found</h3>
          <p className="mt-1 text-gray-500">Try searching with a different Email.</p>
        </div>
      )}
    </div>
  );
}