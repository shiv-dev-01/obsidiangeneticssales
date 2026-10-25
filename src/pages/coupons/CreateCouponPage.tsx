import React from 'react';
import { CreateCouponForm } from '../../components/coupons/CreateCouponForm';
import { ProductLineSelector } from '../../components/orders/ProductLineSelector';
import { Ticket } from 'lucide-react';

export function CreateCouponPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-primary-100 rounded-lg">
            <Ticket className="h-6 w-6 text-primary-600" />
          </div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-secondary-600">
            Create New Coupon
          </h1>
        </div>
        <p className="text-gray-600 text-lg">
          Create a new coupon code with specific rules and restrictions
        </p>
      </div>

      <div className="space-y-6">
        {/* <ProductLineSelector /> */}
        
        <div className="bg-white shadow-md rounded-xl p-6">
          <CreateCouponForm />
        </div>
      </div>
    </div>
  );
}