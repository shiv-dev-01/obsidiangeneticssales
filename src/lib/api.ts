import axios from 'axios';

const api = axios.create({
  baseURL: 'https://panel.whitelabelmd.com/obsidian/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface LoginResponse {
  status: number;
  message: string;
  admin_id?: number;
  name?: string;
  email?: string;
}

export interface Campaign {
  campaign_id: string;
  campaign_name: string;
}

export interface Product {
  product_id: number;
  uniq_id?: string;
  product_name: string;
  product_description: string;
  product_price: number;
  product_sku: string;
  product_max_quantity: string;
  product_img?: Array<{ img_video: string }>;
  quantity?: number;
}

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

export interface Gateway {
  gateway_id: number;
  name: string;
}

export interface GetGatewaysResponse {
  status: number;
  message: string;
  gateway_data: Gateway[];
}

export interface OrderResponse {
  status: number;
  message: string;
  orders: Array<{
    order_id: string;
    status: number;
  }>;
}

export async function loginUser(email: string, password: string): Promise<LoginResponse> {
  try {
    const response = await api.post('/super_admin_login', {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        status: 0,
        message: error.response?.data?.message || 'An error occurred during login',
      };
    }
    return {
      status: 0,
      message: 'An unexpected error occurred',
    };
  }
}

export async function getCampaigns(): Promise<{ campaigns: Campaign[] }> {
  const response = await api.get('/get_all_campaign');
  return response.data;
}

export async function getProducts(): Promise<{ status: number; product: Product[]; message: string }> {
  const response = await api.get('/get_products_test');
  return response.data;
}

export async function getShippingMethods(): Promise<{ status: number; shipping_methods: ShippingMethod[]; message: string }> {
  const response = await api.get('/shipping_method_find');
  return response.data;
}

export async function getGateways(): Promise<GetGatewaysResponse> {
  const response = await api.get('/get_gateway');
  return response.data;
}

export async function createOrder(orderData: any): Promise<OrderResponse> {
  try {
    const response = await axios.post(
      'https://panel.whitelabelmd.com/obsidian/api/add_user_check_product_agent_test',
      orderData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to create order');
    }
    throw new Error('Failed to create order');
  }
}

export async function validateCoupon(code: string, amount: number, productCount: number): Promise<{
  status: number;
  message: string;
  discount_percent: string;
  discount_amount: string;
  minimum_purchase: string;
}> {
  try {
    const response = await api.post('/check_coupons', {
      promo_codes: code,
      amount: amount.toString(),
      product_count: productCount
    });
    return response.data;
  } catch (error) {
    return {
      status: 0,
      message: 'Failed to validate coupon',
      discount_percent: '0',
      discount_amount: '0',
      minimum_purchase: '0'
    };
  }
}