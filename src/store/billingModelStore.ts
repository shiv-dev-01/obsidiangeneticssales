import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getBillingModels } from '../lib/api/billingModel';
import type { BillingModel } from '../types/billingModel';
import toast from 'react-hot-toast';

interface BillingModelState {
  selectedModel: BillingModel | null;
  availableModels: BillingModel[];
  isLoading: boolean;
  error: string | null;
  setSelectedModel: (model: BillingModel | null) => void;
  loadBillingModels: () => Promise<void>;
  reset: () => void;
}

export const useBillingModelStore = create<BillingModelState>()(
  persist(
    (set) => ({
      selectedModel: null,
      availableModels: [],
      isLoading: false,
      error: null,

      setSelectedModel: (model) => set({ selectedModel: model }),

      loadBillingModels: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await getBillingModels();
          if (response.status === 1 && Array.isArray(response.data)) {
            set({ 
              availableModels: response.data,
              // Auto-select first model if none selected
              selectedModel: response.data[0]
            });
          } else {
            throw new Error(response.message || 'Failed to load billing models');
          }
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to load billing models';
          set({ error: message });
          toast.error(message);
        } finally {
          set({ isLoading: false });
        }
      },

      reset: () => set({
        selectedModel: null,
        availableModels: [],
        isLoading: false,
        error: null
      })
    }),
    {
      name: 'billing-model-store',
      version: 1
    }
  )
);