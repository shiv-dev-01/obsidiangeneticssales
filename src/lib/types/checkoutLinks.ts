export interface CheckoutLinkUserData {
  call_center_value?: string;
  billingSameAsShipping?: string;
  payment_type?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  address?: string;
  city_name?: string;
  state_name?: string;
  zip_code?: string;
  product_id?: string[];
  gateway_id?: string[];
  billing_model_id?: string[];
  promoCodes?: string[];
  product_price?: string[];
  original_price?: string[];
  admin_id?: string;
  [key: string]: unknown;
}

export interface CheckoutLinkRecord {
  checkout_link_id: number;
  product_id: string;
  email: string;
  status: number;
  user_data: CheckoutLinkUserData;
  checkout_link: string;
  created_at: string;
  updated_at: string;
}

export interface CheckoutLinksListResponse {
  status: number;
  message: string;
  data: CheckoutLinkRecord[];
}
