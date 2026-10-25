import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { orderService } from '../../lib/api/services/orders';
import { useProductLineStore } from '../productLineStore';
import { useAuthStore } from '../authStore';
import { createCheckoutLinkFormData, createOrderFormData } from '../../lib/utils/formData';
import { validateCheckoutLink, validateOrder } from '../../lib/validations/orderValidation';
import { initialState } from './initialState';
import type { OrderState, OrderActions } from './types';
import toast from 'react-hot-toast';

export type { OrderState, OrderActions } from './types';

export const useOrderStore = create<OrderState & OrderActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      setCustomer: (customer) => set({ customer }),
      
      addProduct: (product) => set((state) => ({
        products: [...state.products, product]
      })),
      
      removeProduct: (productId) => set((state) => ({
        products: state.products.filter((p) => p.product_id.toString() !== productId),
        productGateways: Object.fromEntries(
          Object.entries(state.productGateways).filter(([id]) => id.toString() !== productId)
        ),
        productBillingModels: Object.fromEntries(
          Object.entries(state.productBillingModels).filter(([id]) => id.toString() !== productId)
        ),
        productCoupons: Object.fromEntries(
          Object.entries(state.productCoupons).filter(([id]) => id.toString() !== productId)
        )
      })),
      
      setShippingMethod: (method) => set({ selectedShippingMethod: method }),
      
      setPayment: (payment) => set((state) => ({
        payment: { ...state.payment, ...payment }
      })),
      
      setProductGateway: (productId, gateway) => set((state) => ({
        productGateways: { ...state.productGateways, [productId]: gateway }
      })),
      
      setProductBillingModel: (productId, model) => set((state) => ({
        productBillingModels: { ...state.productBillingModels, [productId]: model }
      })),
      
      setProductCoupon: (productId, couponInfo) => set((state) => ({
        productCoupons: { ...state.productCoupons, [productId]: couponInfo }
      })),
      
      clearProductCoupon: (productId) => set((state) => {
        const { [productId]: _, ...rest } = state.productCoupons;
        return { productCoupons: rest };
      }),
      
      setUseSameAddress: (same) => set({ useSameAddress: same }),
      
      setOrderResponse: (response) => set({ orderResponse: response }),

      setIsCallCenter: (isCallCenter) => set({ isCallCenter }),

      setCheckoutLinkModal: (modal) => set({ checkoutLinkModal: modal }),

      generateCheckoutLink: async () => {
        const state = get();
        const validationError = validateCheckoutLink(state);

        if (validationError) {
          toast.error(validationError);
          return;
        }

        const shipping = state.selectedShippingMethod;
        if (!shipping) return;

        set({ isGeneratingCheckoutLink: true });

        try {
          const productLine = useProductLineStore.getState().selectedLine;
          const formData = createCheckoutLinkFormData({
            customer: state.customer,
            products: state.products,
            productGateways: state.productGateways,
            productBillingModels: state.productBillingModels,
            productCoupons: state.productCoupons,
            useSameAddress: state.useSameAddress,
            selectedShippingMethod: shipping,
            isCallCenter: state.isCallCenter,
          });

          const response = await orderService.createCheckoutLink(productLine, formData);

          if (response.status === 1 && response.checkout_link) {
            set({
              checkoutLinkModal: {
                checkoutLink: response.checkout_link,
                message: response.message,
              },
            });
            toast.success(response.message);
          } else {
            toast.error(
              response.message || 'Checkout link was not returned. Please try again.'
            );
          }
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : 'Failed to create checkout link';
          toast.error(errorMessage);
        } finally {
          set({ isGeneratingCheckoutLink: false });
        }
      },

      createOrder: async () => {
        const state = get();
        const validationError = validateOrder(state);
        
        if (validationError) {
          toast.error(validationError);
          return;
        }

        set({ isSubmitting: true });

        try {
          const productLine = useProductLineStore.getState().selectedLine;
          const adminId = useAuthStore.getState().getAdminId();
          const formData = createOrderFormData({
            customer: state.customer,
            payment: state.payment,
            products: state.products,
            productGateways: state.productGateways,
            productBillingModels: state.productBillingModels,
            productCoupons: state.productCoupons,
            useSameAddress: state.useSameAddress,
            isCallCenter: state.isCallCenter,
            adminId,
          });

          const response = await orderService.createOrder(productLine, formData);
          
          set({ 
            orderResponse: {
              message: response.message,
              orders: response.orders || [],
              errors: response.errors || []
            }
          });

          if (response.status === 1 && (!response.errors || response.errors.length === 0)) {
            setTimeout(() => get().reset(), 2000);
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to process order';
          set({ 
            orderResponse: {
              message: errorMessage,
              orders: [],
              errors: [{ status: 'error', message: errorMessage }]
            }
          });
          toast.error(errorMessage);
        } finally {
          set({ isSubmitting: false });
        }
      },

      reset: () => set(initialState)
    }),
    {
      name: 'order-store',
      version: 1,
      partialize: (state) => ({
        isCallCenter: state.isCallCenter,
        useSameAddress: state.useSameAddress
      })
    }
  )
);