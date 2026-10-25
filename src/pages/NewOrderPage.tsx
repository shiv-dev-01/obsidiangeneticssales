import React from 'react';
import { CustomerSection } from '../components/orders/CustomerSection';
import { AddressSection } from '../components/orders/AddressSection';
import { ProductSection } from '../components/orders/ProductSection';
import { ShippingMethodSection } from '../components/orders/ShippingMethodSection';
import { PaymentSection } from '../components/orders/PaymentSection';
import { OrderSummary } from '../components/orders/OrderSummary';
import { useOrderStore } from '../store/orderStore';
import { ArrowRight, Loader2 } from 'lucide-react';

export function NewOrderPage() {
  const { createOrder, isSubmitting } = useOrderStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createOrder();
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">New Order</h1>
        <p className="mt-2 text-gray-600">
          Create a new order by filling out the information below
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <CustomerSection />
            <AddressSection />
            <ProductSection />
            <ShippingMethodSection />
            <PaymentSection />
          </div>
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <OrderSummary />
              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-6 w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                    Processing Order...
                  </div>
                ) : (
                  <>
                    Place Order
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}