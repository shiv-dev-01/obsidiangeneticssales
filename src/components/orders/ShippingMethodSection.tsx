import React, { useEffect, useState } from 'react';
import { useOrderStore } from '../../store/orderStore';
import { useProductLineStore } from '../../store/productLineStore';
import { shippingService } from '../../lib/api/services/shipping';
import type { ShippingMethod } from '../../lib/types';
import toast from 'react-hot-toast';
import { ShippingMethodCard } from './shipping/ShippingMethodCard';
import { LoadingState } from './shipping/LoadingState';
import { EmptyState } from './shipping/EmptyState';

export function ShippingMethodSection() {
  const { selectedLine } = useProductLineStore();
  const { selectedShippingMethod, setShippingMethod } = useOrderStore();
  const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadShippingMethods = async () => {
      setIsLoading(true);
      try {
        const response = await shippingService.getShippingMethods();
        if (response.status === 1) {
          setShippingMethods(response.shipping_methods);
          // Automatically select the first shipping method if none is selected
          if (!selectedShippingMethod && response.shipping_methods.length > 0) {
            const firstMethod = response.shipping_methods[0];
            setShippingMethod({
              ...firstMethod,
              price: parseFloat(firstMethod.initial_amount)
            });
          }
        } else {
          toast.error('Failed to load shipping methods');
        }
      } catch (error) {
        toast.error('Error loading shipping methods');
      } finally {
        setIsLoading(false);
      }
    };

    loadShippingMethods();
  }, [selectedLine, selectedShippingMethod, setShippingMethod]);

  if (isLoading) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <LoadingState />
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Shipping Method</h2>

      <div className="space-y-4">
        {shippingMethods.length === 0 ? (
          <EmptyState />
        ) : (
          shippingMethods.map((method) => (
            <ShippingMethodCard
              key={method.id}
              method={method}
              isSelected={selectedShippingMethod?.id === method.id}
              onSelect={setShippingMethod}
            />
          ))
        )}
      </div>
    </div>
  );
}