import type { 
  Customer, 
  Payment, 
  Product, 
  ShippingMethod,
  Gateway,
  BillingModel,
  CouponInfo,
  OrderSuccess,
  OrderError
} from '../../lib/types';

export interface OrderResponseState {
  message: string;
  orders: OrderSuccess[];
  errors: OrderError[];
}

export interface OrderState {
  customer: Customer | null;
  products: Product[];
  selectedShippingMethod: ShippingMethod | null;
  payment: Payment;
  productGateways: Record<number, Gateway>;
  productBillingModels: Record<number, BillingModel>;
  productCoupons: Record<number, CouponInfo>;
  useSameAddress: boolean;
  isCallCenter: boolean;
  isSubmitting: boolean;
  isGeneratingCheckoutLink: boolean;
  orderResponse: OrderResponseState | null;
  checkoutLinkModal: { checkoutLink: string; message: string } | null;
}

export interface OrderActions {
  setCustomer: (customer: Customer | null) => void;
  addProduct: (product: Product) => void;
  removeProduct: (productId: string) => void;
  setShippingMethod: (method: ShippingMethod) => void;
  setPayment: (payment: Partial<Payment>) => void;
  setProductGateway: (productId: number, gateway: Gateway) => void;
  setProductBillingModel: (productId: number, model: BillingModel) => void;
  setProductCoupon: (productId: number, couponInfo: CouponInfo) => void;
  clearProductCoupon: (productId: number) => void;
  setUseSameAddress: (same: boolean) => void;
  setOrderResponse: (response: OrderResponseState | null) => void;
  setIsCallCenter: (isCallCenter: boolean) => void;
  setCheckoutLinkModal: (modal: { checkoutLink: string; message: string } | null) => void;
  createOrder: () => Promise<void>;
  generateCheckoutLink: () => Promise<void>;
  reset: () => void;
}