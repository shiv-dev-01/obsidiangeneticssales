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