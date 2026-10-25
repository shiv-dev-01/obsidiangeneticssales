export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface Address {
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  email?: string;
  phone?: string;
}

export interface Customer {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  shippingAddress: Address;
  billingAddress: Address;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  image: string;
  quantity: number;
}

export interface ShippingMethod {
  id: string;
  name: string;
  price: number;
  estimatedDays: string;
}

export interface PaymentMethod {
  id: string;
  type: 'visa' | 'mastercard' | 'amex' | 'discover';
  name: string;
}