export interface OrderProduct {
  product_id: string;
  sku: string;
  price: string;
  product_qty: string;
  name: string;
  billing_model: {
    id: string;
    name: string;
    description: string;
  };
}

export interface OrderCustomer {
  order_id: string;
  first_name: string;
  last_name: string;
  email_address: string;
  order_date?: string;
  order_total?: string;
  agent_commission?: string;
  agent_commission_type?: 'percentage' | 'dollar';
  agent_commission_amount?: string;
}

export interface Order {
  customer_info: OrderCustomer;
  products: OrderProduct[];
}

export interface OrderListPagination {
  current_page: number;
  total_pages: number;
  total_records: number;
  per_page: number;
  has_next_page: boolean;
  has_previous_page: boolean;
}

export interface OrderListResponse {
  status: number;
  message: string;
  data: Order[];
  pagination: OrderListPagination;
}

export interface OrderSuccess {
  order_id: string;
  status: number;
}

export interface OrderError {
  status: string;
  message: string;
}

export interface OrderResponse {
  status: number;
  message: string;
  orders?: OrderSuccess[];
  errors?: OrderError[];
}