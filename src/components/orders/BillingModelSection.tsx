import React, { useEffect } from 'react';
import { Calendar, Loader2, Clock } from 'lucide-react';
import { useBillingModelStore } from '../../store/billingModelStore';
import { useProductLineStore } from '../../store/productLineStore';
import { cn } from '../../lib/utils';

export function BillingModelSection() {
  const { selectedLine } = useProductLineStore();
  const {
    selectedModel,
    availableModels,
    isLoading,
    error,
    loadBillingModels,
    setSelectedModel
  } = useBillingModelStore();

  useEffect(() => {
    loadBillingModels();
  }, [loadBillingModels, selectedLine]); // Reload when product line changes

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
      <h2 className="text-lg font-medium text-gray-900 mb-4">Billing Model</h2>

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
                name="billingModel"
                checked={selectedModel?.id === model.id}
                onChange={() => setSelectedModel(model)}
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