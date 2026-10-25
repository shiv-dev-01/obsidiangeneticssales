import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, Calendar, DollarSign, Package, Clock,
  Truck, MapPin, CreditCard, User, Phone, Mail
} from 'lucide-react';
import { formatCurrency, formatDate } from '../../lib/utils';

// Sample order details (in production, this would come from an API)
const orderDetails = {
  id: 'ORD-2024-001',
  customer: {
    name: 'John Smith',
    email: 'john.smith@example.com',
    phone: '(555) 123-4567'
  },
  date: new Date('2024-03-15'),
  status: 'completed',
  paymentStatus: 'paid',
  total: 299.99,
  subtotal: 279.99,
  tax: 20.00,
  shippingCost: 0,
  items: [
    {
      id: '1',
      name: 'Premium Medical Product',
      sku: 'MED001',
      quantity: 2,
      price: 139.99,
      image: 'https://via.placeholder.com/150'
    },
    {
      id: '2',
      name: 'Medical Supplies Pack',
      sku: 'MED002',
      quantity: 1,
      price: 99.99,
      image: 'https://via.placeholder.com/150'
    }
  ],
  shippingAddress: {
    street: '123 Medical Center Dr',
    city: 'Los Angeles',
    state: 'CA',
    zipCode: '90001',
    country: 'USA'
  },
  billingAddress: {
    street: '123 Medical Center Dr',
    city: 'Los Angeles',
    state: 'CA',
    zipCode: '90001',
    country: 'USA'
  },
  paymentMethod: {
    type: 'visa',
    last4: '4242'
  },
  shippingMethod: {
    name: 'Free Shipping',
    estimatedDays: '5-7 business days'
  }
};

const statusColors = {
  completed: 'bg-green-100 text-green-800',
  processing: 'bg-blue-100 text-blue-800',
  pending: 'bg-yellow-100 text-yellow-800',
  cancelled: 'bg-red-100 text-red-800'
};

export function OrderDetailsPage() {
  const { orderId } = useParams();
  // In production, fetch order details using orderId

  return (
    <div className="max-w-[1400px] mx-auto pb-12">
      {/* Header */}
      <div className="mb-8">
        <Link
          to="/orders"
          className="inline-flex items-center text-gray-600 hover:text-primary-600 mb-6 group transition-colors duration-200"
        >
          <ArrowLeft className="h-5 w-5 mr-2 transition-transform duration-200 group-hover:-translate-x-1" />
          Back to Orders
        </Link>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Order {orderDetails.id}
            </h1>
            <p className="text-gray-600">
              Placed on {formatDate(orderDetails.date)}
            </p>
          </div>
          <span className={`px-4 py-2 rounded-full text-sm font-medium ${statusColors[orderDetails.status as keyof typeof statusColors]}`}>
            {orderDetails.status.charAt(0).toUpperCase() + orderDetails.status.slice(1)}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Order Items */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-6">Order Items</h2>
              <div className="space-y-6">
                {orderDetails.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 pb-6 border-b last:border-0 last:pb-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-500">SKU: {item.sku}</p>
                      <div className="mt-1 text-sm text-gray-700">
                        Quantity: {item.quantity}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-gray-900">
                        {formatCurrency(item.price)}
                      </div>
                      <div className="text-sm text-gray-500">
                        per unit
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Customer Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-6">Customer Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-start gap-3">
                  <User className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Customer Name</p>
                    <p className="text-gray-600">{orderDetails.customer.name}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Email</p>
                    <p className="text-gray-600">{orderDetails.customer.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Phone</p>
                    <p className="text-gray-600">{orderDetails.customer.phone}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Shipping & Payment */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6">
                <div className="flex items-center gap-2 mb-6">
                  <MapPin className="h-5 w-5 text-gray-400" />
                  <h2 className="text-xl font-semibold">Shipping Details</h2>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Shipping Address</p>
                    <p className="text-gray-600">{orderDetails.shippingAddress.street}</p>
                    <p className="text-gray-600">
                      {orderDetails.shippingAddress.city}, {orderDetails.shippingAddress.state} {orderDetails.shippingAddress.zipCode}
                    </p>
                    <p className="text-gray-600">{orderDetails.shippingAddress.country}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Shipping Method</p>
                    <p className="text-gray-600">{orderDetails.shippingMethod.name}</p>
                    <p className="text-sm text-gray-500">
                      Estimated delivery: {orderDetails.shippingMethod.estimatedDays}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6">
                <div className="flex items-center gap-2 mb-6">
                  <CreditCard className="h-5 w-5 text-gray-400" />
                  <h2 className="text-xl font-semibold">Payment Details</h2>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Payment Method</p>
                    <p className="text-gray-600">
                      {orderDetails.paymentMethod.type.toUpperCase()} ending in {orderDetails.paymentMethod.last4}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Billing Address</p>
                    <p className="text-gray-600">{orderDetails.billingAddress.street}</p>
                    <p className="text-gray-600">
                      {orderDetails.billingAddress.city}, {orderDetails.billingAddress.state} {orderDetails.billingAddress.zipCode}
                    </p>
                    <p className="text-gray-600">{orderDetails.billingAddress.country}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">{formatCurrency(orderDetails.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">{formatCurrency(orderDetails.shippingCost)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-medium">{formatCurrency(orderDetails.tax)}</span>
                  </div>
                  <div className="pt-4 border-t">
                    <div className="flex justify-between">
                      <span className="font-semibold">Total</span>
                      <span className="font-semibold">{formatCurrency(orderDetails.total)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <button className="w-full py-2.5 px-4 rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200">
                Download Invoice
              </button>
              <button className="w-full py-2.5 px-4 rounded-lg text-primary-600 bg-primary-50 hover:bg-primary-100 focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200">
                Print Order Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}