import React, { useEffect } from 'react';
import { Calendar, Loader2, Clock } from 'lucide-react';
import { useOrderStore } from '../../store/orderStore';
import { useProductLineStore } from '../../store/productLineStore';
import { billingService } from '../../lib/api/services/billing';
import { cn } from '../../lib/utils';
import type { Product, BillingModel } from '../../lib/types';
import toast from 'react-hot-toast';

interface ProductBillingSectionProps {
  product: Product;
}

export function ProductBillingSection({ product }: ProductBillingSectionProps) {
  const { selectedLine } = useProductLineStore();
  const { productBillingModels, setProductBillingModel } = useOrderStore();
  const [availableModels, setAvailableModels] = React.useState<BillingModel[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  useEffect(() => {
    const loadBillingModels = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await billingService.getBillingModels();
        if (response.status === 1 && Array.isArray(response.data)) {
          setAvailableModels(response.data);
          // Auto-select first model if none selected
          if (!productBillingModels[product.product_id] && response.data.length > 0) {
            setProductBillingModel(product.product_id, response.data[0]);
          }
        } else {
          throw new Error('Failed to load billing models');
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to load billing models';
        setError(message);
        toast.error(message);
      } finally {
        setIsLoading(false);
      }
    };

    loadBillingModels();
  }, [selectedLine, product.product_id, setProductBillingModel]);

  const selectedModel = productBillingModels[product.product_id];

  if (isLoading) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
          <span className="ml-2 text-gray-600">Loading billing models...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">
          Billing Model for {product.product_name}
        </h3>
        <span className="text-sm text-gray-500">
          SKU: {product.product_sku}
        </span>
      </div>

      <div className="space-y-4">
        {availableModels.map((model) => (
          <label
            key={model.id}
            className={cn(
              'flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all duration-200',
              selectedModel?.id === model.id
                ? 'border-primary-500 bg-primary-50'
                : 'border-gray-200 hover:border-primary-200'
            )}
          >
            <div className="flex items-center">
              <input
                type="radio"
                name={`billingModel-${product.product_id}`}
                checked={selectedModel?.id === model.id}
                onChange={() => setProductBillingModel(product.product_id, model)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
              />
              <div className="ml-4">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="font-medium">{model.name}</span>
                </div>
                <div className="mt-1 space-y-1">
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>Billing Type: {model.bill_by_type}</span>
                  </div>
                  {model.bill_by_days && (
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>Billing Days: {model.bill_by_days}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </label>
        ))}

        {availableModels.length === 0 && (
          <div className="text-center py-4 text-gray-500">
            No billing models available
          </div>
        )}
      </div>
    </div>
  );
}