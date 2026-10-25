import React from 'react';
import { CreditCard } from 'lucide-react';
import { useOrderStore } from '../../store/orderStore';
import { cn } from '../../lib/utils';

const CARD_TYPES = [
  { id: '', name: 'Select card' },
  { id: 'visa', name: 'Visa' },
  { id: 'mastercard', name: 'Mastercard' },
  { id: 'amex', name: 'American Express' },
  { id: 'discover', name: 'Discover' }
] as const;

export function PaymentSection() {
  const { payment, setPayment } = useOrderStore();

  const handlePaymentChange = (field: string, value: string) => {
    setPayment({ [field]: value });
  };

  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  // Format expiry date (MM/YY)
  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.slice(0, 2) + '/' + v.slice(2, 4);
    }
    return v;
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Payment Information</h2>
      
      <div className="space-y-4">
        {/* Card Type Dropdown */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Card Type
            <span className="text-red-500 ml-1">*</span>
          </label>
          <div className="relative">
            <select
              value={payment.cardType}
              onChange={(e) => handlePaymentChange('cardType', e.target.value)}
              className={cn(
                "block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 pr-8",
                "focus:outline-none focus:ring-indigo-500 focus:border-indigo-500",
                !payment.cardType && "text-gray-500"
              )}
              required
            >
              {CARD_TYPES.map((type) => (
                <option 
                  key={type.id} 
                  value={type.id}
                  disabled={type.id === ''}
                >
                  {type.name}
                </option>
              ))}
            </select>
            <CreditCard className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Cardholder Name
            <span className="text-red-500 ml-1">*</span>
          </label>
          <input
            type="text"
            value={payment.cardholderName}
            onChange={(e) => handlePaymentChange('cardholderName', e.target.value)}
            placeholder="John Doe"
            className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Card Number
            <span className="text-red-500 ml-1">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={payment.cardNumber}
              onChange={(e) => handlePaymentChange('cardNumber', formatCardNumber(e.target.value))}
              maxLength={19}
              placeholder="1234 5678 9012 3456"
              className="block w-full pr-10 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
            <CreditCard className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Expiry Date
              <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="text"
              value={payment.expiryDate}
              onChange={(e) => handlePaymentChange('expiryDate', formatExpiryDate(e.target.value))}
              maxLength={5}
              placeholder="MM/YY"
              className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              CVV
              <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="text"
              value={payment.cvv}
              onChange={(e) => handlePaymentChange('cvv', e.target.value.replace(/\D/g, ''))}
              maxLength={4}
              placeholder="123"
              className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
        </div>
      </div>
    </div>
  );
}