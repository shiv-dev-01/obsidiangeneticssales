export interface ShippingMethod {
  id: number;
  name: string;
  description: string;
  group_name: string;
  code: string;
  initial_amount: string;
  subscription_amount: string;
  price?: number;
}