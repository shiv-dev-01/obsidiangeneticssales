export interface CouponInfo {
  code: string;
  isValid: boolean;
  discount: number;
  discountType?: 'percent' | 'amount';
  discountValue?: number;
  error?: string;
}

export interface Customer {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  shippingAddress: Address;
  billingAddress: Address;
}

export interface Address {
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  email: string;
  phone: string;
  stateName?: string;
}

export interface Payment {
  cardType: string;
  cardholderName: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
}

export * from './order';
export * from './product';
export * from './shipping';
export * from './gateway';
export * from './billingModel';