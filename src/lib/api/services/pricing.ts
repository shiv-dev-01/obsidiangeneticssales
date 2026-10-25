import axios from 'axios';
import {
  PRICING_AUTH_TOKEN,
  PRICING_SITE_ID,
  UPDATE_PRODUCT_PRICE_API,
  WEB_PRODUCTS_API,
} from '../../config/pricing';
import { handleApiError } from '../base';
import type {
  UpdateProductPriceResponse,
  WebProduct,
  WebProductApiItem,
  WebProductsResponse,
} from '../../types/pricing';

function toNumber(value: string | number | undefined): number {
  const n = Number(String(value ?? '').replace(/[$,]/g, ''));
  return Number.isFinite(n) ? n : 0;
}

function mapWebProduct(raw: WebProductApiItem): WebProduct {
  return {
    productId: String(raw.product_id ?? '').trim(),
    stickyProductId: String(raw.sticky_product_id ?? '').trim(),
    productName: String(raw.product_name ?? '').trim(),
    sku: String(raw.sku ?? '').trim(),
    price: toNumber(raw.price),
    category: String(raw.category_name ?? '').trim(),
  };
}

export const pricingService = {
  getWebProducts: async (): Promise<WebProduct[]> => {
    try {
      const response = await axios.post<WebProductsResponse>(
        WEB_PRODUCTS_API,
        {},
        { headers: { Accept: 'application/json' } }
      );
      const payload = response.data;

      if (payload?.status === 0) {
        throw new Error(payload.message || 'Failed to load products.');
      }

      const rows = payload?.data || payload?.product || [];
      return rows.map(mapWebProduct);
    } catch (error) {
      throw handleApiError(error, 'Failed to load products.');
    }
  },

  updateProductPrice: async (
    stickyProductId: string,
    price: number
  ): Promise<UpdateProductPriceResponse> => {
    const body = new FormData();
    body.append('site_id', PRICING_SITE_ID);
    body.append('product_id', stickyProductId);
    body.append('price', price.toFixed(2));

    try {
      const response = await axios.post<UpdateProductPriceResponse>(
        UPDATE_PRODUCT_PRICE_API,
        body,
        {
          headers: {
            authtoken: PRICING_AUTH_TOKEN,
            Accept: 'application/json',
          },
        }
      );

      const payload = response.data;
      if (payload?.status !== 1) {
        throw new Error(payload?.message || 'The product price could not be updated.');
      }

      return payload;
    } catch (error) {
      throw handleApiError(error, 'The product price could not be updated.');
    }
  },
};
