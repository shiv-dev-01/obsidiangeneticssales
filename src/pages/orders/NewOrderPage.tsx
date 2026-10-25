import React from "react";
import { useOrderStore } from "../../store/orderStore";
import { CustomerSection } from "../../components/orders/CustomerSection";
import { AddressSection } from "../../components/orders/AddressSection";
import { ProductSection } from "../../components/orders/ProductSection";
import { ProductPaymentSection } from "../../components/orders/ProductPaymentSection";
import { ProductBillingSection } from "../../components/orders/ProductBillingSection";
import { ProductCouponSection } from "../../components/orders/ProductCouponSection";
import { ShippingMethodSection } from "../../components/orders/ShippingMethodSection";
import { PaymentSection } from "../../components/orders/PaymentSection";
import { OrderSummary } from "../../components/orders/OrderSummary";
import { OrderResponseDialog } from "../../components/ui/OrderResponseDialog";
import { CheckoutLinkDialog } from "../../components/ui/CheckoutLinkDialog";
import { ArrowRight, Link2, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { OrderSourceSection } from "../../components/orders/OrderSourceSection";

export function NewOrderPage() {
  const {
    products = [], // Provide default empty array
    createOrder,
    generateCheckoutLink,
    isSubmitting,
    isGeneratingCheckoutLink,
    orderResponse,
    setOrderResponse,
    checkoutLinkModal,
    setCheckoutLinkModal,
  } = useOrderStore();

  const handleGenerateCheckoutLink = async () => {
    try {
      await generateCheckoutLink();
    } catch {
      toast.error("Failed to generate checkout link");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createOrder();
    } catch (error) {
      toast.error("Failed to create order");
    }
  };

  return (
    <div className="w-full">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          New Order
        </h1>
        <p className="mt-2 text-gray-600">
          Create a new order by filling out the information below
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
        {/* <ProductLineSelector /> */}
        <OrderSourceSection />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          <div className="lg:col-span-2 space-y-6">
            <CustomerSection />

            <AddressSection />
            <ProductSection />

            {/* Payment Gateway, Billing Model and Coupon Selection for Each Product */}
            {products && products.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-lg font-medium text-gray-900">
                  Product Settings
                </h2>
                {products.map((product) => (
                  <div key={product.product_id} className="space-y-4">
                    <ProductPaymentSection product={product} />
                    <ProductBillingSection product={product} />
                    <ProductCouponSection product={product} />
                  </div>
                ))}
              </div>
            )}

            <ShippingMethodSection />
            <PaymentSection />
          </div>

          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-6 space-y-6">
              <OrderSummary />
              <button
                type="button"
                onClick={handleGenerateCheckoutLink}
                disabled={isGeneratingCheckoutLink || isSubmitting}
                className="w-full flex items-center justify-center py-3 px-4 border border-primary-600 rounded-lg shadow-sm text-base font-medium text-primary-700 bg-white hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 transition-colors"
              >
                {isGeneratingCheckoutLink ? (
                  <div className="flex items-center">
                    <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                    Generating link...
                  </div>
                ) : (
                  <>
                    <Link2 className="mr-2 h-5 w-5" />
                    Generate checkout link
                  </>
                )}
              </button>
              <button
                type="submit"
                disabled={isSubmitting || isGeneratingCheckoutLink}
                className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 transition-colors"
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

      {orderResponse && (
        <OrderResponseDialog
          orders={orderResponse.orders}
          errors={orderResponse.errors}
          message={orderResponse.message}
          onClose={() => setOrderResponse(null)}
        />
      )}

      {checkoutLinkModal && (
        <CheckoutLinkDialog
          checkoutLink={checkoutLinkModal.checkoutLink}
          message={checkoutLinkModal.message}
          onClose={() => setCheckoutLinkModal(null)}
        />
      )}
    </div>
  );
}
