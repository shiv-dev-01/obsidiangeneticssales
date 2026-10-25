import React from 'react';
import { useOrderStore } from '../../store/orderStore';
import { formatPhoneNumber, validatePhoneNumber } from '../../lib/addressUtils';
import { cn } from '../../lib/utils';

export function CustomerSection() {
  const { customer, setCustomer } = useOrderStore();

  const handleCustomerChange = (field: string, value: string) => {
    if (field === 'phone') {
      value = formatPhoneNumber(value);
    }
    setCustomer({
      ...customer,
      [field]: value
    });
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Customer Information</h2>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">First Name</label>
          <input
            type="text"
            value={customer?.firstName || ''}
            onChange={(e) => handleCustomerChange('firstName', e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="John"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Last Name</label>
          <input
            type="text"
            value={customer?.lastName || ''}
            onChange={(e) => handleCustomerChange('lastName', e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Doe"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={customer?.email || ''}
            onChange={(e) => handleCustomerChange('email', e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="john.doe@example.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Phone</label>
          <input
            type="tel"
            value={customer?.phone || ''}
            onChange={(e) => handleCustomerChange('phone', e.target.value)}
            className={cn(
              "mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500",
              validatePhoneNumber(customer?.phone || '') 
                ? "border-gray-300 focus:border-indigo-500"
                : "border-red-300 focus:border-red-500"
            )}
            placeholder="(123) 456-7890"
          />
          {customer?.phone && !validatePhoneNumber(customer.phone) && (
            <p className="mt-1 text-sm text-red-600">
              Please enter a valid 10-digit phone number
            </p>
          )}
        </div>
      </div>
    </div>
  );
}