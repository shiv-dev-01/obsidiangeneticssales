import { useEffect } from 'react';
import { useBillingModelStore } from '../../store/billingModelStore';

export function useBillingModel() {
  const { 
    selectedModel,
    availableModels,
    isLoading,
    error,
    setSelectedModel,
    loadBillingModels
  } = useBillingModelStore();

  useEffect(() => {
    loadBillingModels();
  }, [loadBillingModels]);

  return {
    selectedModel,
    availableModels,
    isLoading,
    error,
    setSelectedModel
  };
}