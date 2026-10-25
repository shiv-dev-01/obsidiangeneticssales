import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { PRODUCT_LINES, type ProductLine } from '../lib/constants/productLines';

interface ProductLineState {
  selectedLine: ProductLine;
  availableLines: ProductLine[];
}

interface ProductLineActions {
  setSelectedLine: (line: ProductLine) => void;
  initializeProductLine: (permission: string) => void;
  reset: () => void;
}

const getProductLinesByPermission = (permission: string): ProductLine[] => {
  switch (permission) {
    case '1': return ['JOINTRIM'];
    default: return [];
  }
};

export const useProductLineStore = create<ProductLineState & ProductLineActions>()(
  persist(
    (set) => ({
      selectedLine: 'JOINTRIM',
      availableLines: [],

      setSelectedLine: (line) => set({ selectedLine: line }),

      initializeProductLine: (permission: string) => {
        const availableLines = getProductLinesByPermission(permission);
        set({ 
          availableLines,
          selectedLine: availableLines[0] || 'JOINTRIM'
        });
      },

      reset: () => set({ selectedLine: 'JOINTRIM', availableLines: [] })
    }),
    {
      name: 'product-line-store',
      storage: createJSONStorage(() => localStorage),
      version: 1,
    }
  )
);