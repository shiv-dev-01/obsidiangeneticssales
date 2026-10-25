import React from "react";
import { CustomerSection } from "./CustomerSection";
import { AddressSection } from "./AddressSection";
import { ProductSection } from "./ProductSection";
import { ProductPaymentSection } from "./ProductPaymentSection";
import { ProductCouponSection } from "./ProductCouponSection";
import { ShippingMethodSection } from "./ShippingMethodSection";
import { BillingModelSection } from "./BillingModelSection";
import { PaymentSection } from "./PaymentSection";
import { OrderSummary } from "./OrderSummary";
import { OrderSuccessDialog } from "../ui/OrderSuccessDialog";
import { useOrderStore } from "../../store/orderStore";
import { ArrowRight, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { OrderSourceSection } from "./OrderSourceSection";

export function NewOrderPage() {
  const {
    createOrder,
    isSubmitting,
    successOrders,
    setSuccessOrders,
    customer,
    products,
    payment,
    selectedShippingMethod,
    productGateways,
    selectedBillingModel,
    setSelectedBillingModel,
  } = useOrderStore();

  const validateForm = () => {
    // Customer validation
    if (!customer?.firstName?.trim()) return "Customer first name is required";
    if (!customer?.lastName?.trim()) return "Customer last name is required";
    if (!customer?.email?.trim()) return "Customer email is required";
    if (!customer?.phone?.trim()) return "Customer phone number is required";

    // Shipping address validation
    if (!customer?.shippingAddress?.firstName?.trim())
      return "Shipping first name is required";
    if (!customer?.shippingAddress?.lastName?.trim())
      return "Shipping last name is required";
    if (!customer?.shippingAddress?.street?.trim())
      return "Shipping street address is required";
    if (!customer?.shippingAddress?.city?.trim())
      return "Shipping city is required";
    if (!customer?.shippingAddress?.state?.trim())
      return "Shipping state is required";
    if (!customer?.shippingAddress?.zipCode?.trim())
      return "Shipping ZIP code is required";
    if (!customer?.shippingAddress?.email?.trim())
      return "Shipping email is required";
    if (!customer?.shippingAddress?.phone?.trim())
      return "Shipping phone is required";

    // Product validation
    if (!products.length) return "Please select at least one product";

    // Payment gateway validation for each product
    for (const product of products) {
      if (!productGateways[product.product_id]) {
        return `Please select a payment gateway for ${product.product_name}`;
      }
    }

    // Billing model validation
    if (!selectedBillingModel) return "Please select a billing model";

    // Payment validation
    if (!payment?.cardholderName?.trim()) return "Cardholder name is required";
    if (!payment?.cardNumber?.trim()) return "Card number is required";
    if (!payment?.expiryDate?.trim()) return "Card expiry date is required";
    if (!payment?.cvv?.trim()) return "CVV is required";

    // Shipping method validation
    if (!selectedShippingMethod) return "Please select a shipping method";

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const error = validateForm();
    if (error) {
      toast.error(error, {
        duration: 4000,
        position: "top-center",
        style: {
          background: "#FEE2E2",
          color: "#991B1B",
          border: "1px solid #F87171",
        },
      });
      return;
    }

    await createOrder();
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          <div className="lg:col-span-2 space-y-6">
            <OrderSourceSection />

            <CustomerSection />
            <AddressSection />
            <ProductSection />

            {/* Billing Model Section */}
            <BillingModelSection
              value={selectedBillingModel?.id}
              onChange={(model) => setSelectedBillingModel(model)}
            />

            {/* Payment Gateway and Coupon Selection for Each Product */}
            {products.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-lg font-medium text-gray-900">
                  Product Settings
                </h2>
                {products.map((product) => (
                  <div key={product.product_id} className="space-y-4">
                    <ProductPaymentSection product={product} />
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
                type="submit"
                disabled={isSubmitting}
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

      {successOrders && (
        <OrderSuccessDialog
          orders={successOrders}
          onClose={() => setSuccessOrders(null)}
        />
      )}
    </div>
  );
}
