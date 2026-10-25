// Base API configuration
export const API_BASE_URL = 'https://panel.whitelabelmd.com/obsidian/api';

export const API_ENDPOINTS = {
  PRODUCTS: '/get_products_test',
  GATEWAYS: '/get_gateway',
  SHIPPING: '/shipping_method_find', 
  BILLING_MODELS: '/billing_model_view',
  COUPONS: '/check_coupons',
  CREATE_ORDER: '/add_user_check_product_agent_test'
} as const;