import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getGateways } from '../lib/api/gateways';
import type { Gateway } from '../types/gateway';
import toast from 'react-hot-toast';

interface GatewayState {
  availableGateways: Gateway[];
  isLoading: boolean;
  error: string | null;
  loadGateways: () => Promise<void>;
  reset: () => void;
}

export const useGatewayStore = create<GatewayState>()(
  persist(
    (set) => ({
      availableGateways: [],
      isLoading: false,
      error: null,

      loadGateways: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await getGateways();
          if (response.status === 1 && Array.isArray(response.gateway_data)) {
            set({ availableGateways: response.gateway_data });
          } else {
            throw new Error(response.message || 'Failed to load payment gateways');
          }
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to load payment gateways';
          set({ error: message });
          toast.error(message);
        } finally {
          set({ isLoading: false });
        }
      },

      reset: () => set({
        availableGateways: [],
        isLoading: false,
        error: null
      })
    }),
    {
      name: 'gateway-store',
      version: 1
    }
  )
);