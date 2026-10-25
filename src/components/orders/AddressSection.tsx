import React, { useState, useEffect } from 'react';
import { useOrderStore } from '../../store/orderStore';
import { StateSelect } from '../ui/StateSelect';
import { CitySelect } from '../ui/CitySelect';
import { getUSStates, type State, formatPhoneNumber, validatePhoneNumber } from '../../lib/addressUtils';
import { cn } from '../../lib/utils';

export function AddressSection() {
  const { customer, setCustomer, useSameAddress, setUseSameAddress } = useOrderStore();
  const [states, setStates] = useState<State[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStates = async () => {
      try {
        const data = await getUSStates();
        setStates(data);
      } catch (err) {
        setError('Failed to load states');
      } finally {
        setIsLoading(false);
      }
    };

    loadStates();
  }, []);

  const handleShippingChange = (field: string, value: string, stateName?: string) => {
    if (field === 'phone') {
      value = formatPhoneNumber(value);
    }
    
    const updatedCustomer = {
      ...customer,
      shippingAddress: {
        ...customer?.shippingAddress,
        [field]: value,
        country: 'US',
        ...(stateName && { stateName })
      }
    };

    if (useSameAddress) {
      updatedCustomer.billingAddress = { ...updatedCustomer.shippingAddress };
    }

    setCustomer(updatedCustomer);
  };

  const handleBillingChange = (field: string, value: string, stateName?: string) => {
    if (field === 'phone') {
      value = formatPhoneNumber(value);
    }
    
    setCustomer({
      ...customer,
      billingAddress: {
        ...customer?.billingAddress,
        [field]: value,
        country: 'US',
        ...(stateName && { stateName })
      }
    });
  };

  const handleUseSameAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setUseSameAddress(checked);
    
    if (checked && customer) {
      setCustomer({
        ...customer,
        billingAddress: { ...customer.shippingAddress }
      });
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-4 sm:p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Address Information</h2>

      {/* Shipping Address */}
      <div className="mb-6">
        <h3 className="text-md font-medium text-gray-700 mb-4">Shipping Address</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">First Name</label>
            <input
              type="text"
              value={customer?.shippingAddress?.firstName || ''}
              onChange={(e) => handleShippingChange('firstName', e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Last Name</label>
            <input
              type="text"
              value={customer?.shippingAddress?.lastName || ''}
              onChange={(e) => handleShippingChange('lastName', e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={customer?.shippingAddress?.email || ''}
              onChange={(e) => handleShippingChange('email', e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <input
              type="tel"
              value={customer?.shippingAddress?.phone || ''}
              onChange={(e) => handleShippingChange('phone', e.target.value)}
              className={cn(
                "mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500",
                validatePhoneNumber(customer?.shippingAddress?.phone || '') 
                  ? "border-gray-300 focus:border-indigo-500"
                  : "border-red-300 focus:border-red-500"
              )}
              placeholder="(123) 456-7890"
            />
            {customer?.shippingAddress?.phone && !validatePhoneNumber(customer.shippingAddress.phone) && (
              <p className="mt-1 text-sm text-red-600">
                Please enter a valid 10-digit phone number
              </p>
            )}
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Street Address</label>
            <input
              type="text"
              value={customer?.shippingAddress?.street || ''}
              onChange={(e) => handleShippingChange('street', e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">State</label>
            <StateSelect
              value={customer?.shippingAddress?.state || ''}
              onChange={(stateCode, stateName) => handleShippingChange('state', stateCode, stateName)}
              states={states}
              isLoading={isLoading}
              error={error || undefined}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">City</label>
            <CitySelect
              value={customer?.shippingAddress?.city || ''}
              onChange={(value) => handleShippingChange('city', value)}
              stateName={customer?.shippingAddress?.stateName || ''}
              disabled={!customer?.shippingAddress?.state}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">ZIP Code</label>
            <input
              type="text"
              value={customer?.shippingAddress?.zipCode || ''}
              onChange={(e) => handleShippingChange('zipCode', e.target.value.replace(/\D/g, '').slice(0, 5))}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              maxLength={5}
              placeholder="12345"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Country</label>
            <input
              type="text"
              value="US"
              disabled
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-50 text-gray-500"
            />
          </div>
        </div>
      </div>

      {/* Same as Shipping Address Toggle */}
      <div className="mb-6">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={useSameAddress}
            onChange={handleUseSameAddressChange}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <span className="ml-2 text-sm text-gray-600">
            Billing address is the same as shipping address
          </span>
        </label>
      </div>

      {/* Billing Address */}
      {!useSameAddress && (
        <div>
          <h3 className="text-md font-medium text-gray-700 mb-4">Billing Address</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">First Name</label>
              <input
                type="text"
                value={customer?.billingAddress?.firstName || ''}
                onChange={(e) => handleBillingChange('firstName', e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Last Name</label>
              <input
                type="text"
                value={customer?.billingAddress?.lastName || ''}
                onChange={(e) => handleBillingChange('lastName', e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={customer?.billingAddress?.email || ''}
                onChange={(e) => handleBillingChange('email', e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <input
                type="tel"
                value={customer?.billingAddress?.phone || ''}
                onChange={(e) => handleBillingChange('phone', e.target.value)}
                className={cn(
                  "mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500",
                  validatePhoneNumber(customer?.billingAddress?.phone || '') 
                    ? "border-gray-300 focus:border-indigo-500"
                    : "border-red-300 focus:border-red-500"
                )}
                placeholder="(123) 456-7890"
              />
              {customer?.billingAddress?.phone && !validatePhoneNumber(customer.billingAddress.phone) && (
                <p className="mt-1 text-sm text-red-600">
                  Please enter a valid 10-digit phone number
                </p>
              )}
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Street Address</label>
              <input
                type="text"
                value={customer?.billingAddress?.street || ''}
                onChange={(e) => handleBillingChange('street', e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">State</label>
              <StateSelect
                value={customer?.billingAddress?.state || ''}
                onChange={(stateCode, stateName) => handleBillingChange('state', stateCode, stateName)}
                states={states}
                isLoading={isLoading}
                error={error || undefined}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">City</label>
              <CitySelect
                value={customer?.billingAddress?.city || ''}
                onChange={(value) => handleBillingChange('city', value)}
                stateName={customer?.billingAddress?.stateName || ''}
                disabled={!customer?.billingAddress?.state}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">ZIP Code</label>
              <input
                type="text"
                value={customer?.billingAddress?.zipCode || ''}
                onChange={(e) => handleBillingChange('zipCode', e.target.value.replace(/\D/g, '').slice(0, 5))}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                maxLength={5}
                placeholder="12345"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Country</label>
              <input
                type="text"
                value="US"
                disabled
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-50 text-gray-500"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}