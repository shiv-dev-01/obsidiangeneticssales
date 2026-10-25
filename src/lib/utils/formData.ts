import type {
  Customer,
  Payment,
  Product,
  ShippingMethod,
  BillingModel,
  Gateway,
} from '../types';

export function createOrderFormData({
  customer,
  payment,
  products,
  selectedBillingModel,
  productGateways,
  productBillingModels,
  productCoupons,
  useSameAddress,
  isCallCenter,
  adminId,
}: {
  customer: Customer | null;
  payment: Payment;
  products: Product[];
  selectedBillingModel?: BillingModel | null;
  productGateways: Record<number, Gateway>;
  productBillingModels: Record<number, BillingModel>;
  productCoupons: Record<number, any>;
  useSameAddress: boolean;
  isCallCenter: boolean;
  adminId?: number | null;
}) {
  const formData = new FormData();

  if (adminId != null) {
    formData.append('admin_id', adminId.toString());
  }

  // Add call center value
  formData.append('call_center_value', isCallCenter ? 'true' : 'false');

  // Add billing same as shipping flag
  formData.append('billingSameAsShipping', useSameAddress ? 'YES' : 'NO');

  // Add customer information
  if (customer) {
    // Shipping information
    formData.append('email', customer.email);
    formData.append('first_name', customer.firstName);
    formData.append('last_name', customer.lastName);
    formData.append('phone', customer.phone.replace(/\D/g, ''));
    formData.append('address', customer.shippingAddress.street);
    formData.append('city_name', customer.shippingAddress.city);
    formData.append('state_name', customer.shippingAddress.state);
    formData.append('zip_code', customer.shippingAddress.zipCode);

    // Add billing information only if different from shipping
    if (!useSameAddress) {
      formData.append('billing_first_name', customer.billingAddress.firstName);
      formData.append('billing_last_name', customer.billingAddress.lastName);
      formData.append('billing_email', customer.billingAddress.email || '');
      formData.append('billing_phone', (customer.billingAddress.phone || '').replace(/\D/g, ''));
      formData.append('billing_address', customer.billingAddress.street);
      formData.append('billing_city', customer.billingAddress.city);
      formData.append('billing_state', customer.billingAddress.state);
      formData.append('billing_zip_code', customer.billingAddress.zipCode);
    }
  }

  // Add payment information
  formData.append('card_type', payment.cardType);
  formData.append('card_no', payment.cardNumber.replace(/\s/g, ''));
  formData.append('ex_month', payment.expiryDate.split('/')[0]);
  formData.append('ex_year', payment.expiryDate.split('/')[1]);
  formData.append('cvv_no', payment.cvv);
  formData.append('card_holder_name', payment.cardholderName);

  // Add products, gateways, billing models, and coupons
  products.forEach((product) => {
    const productId = product.product_id.toString();
    formData.append('product_id[]', product.uniq_id || productId);
    
    // Add gateway ID
    const gateway = productGateways[product.product_id];
    formData.append('gateway_id[]', gateway?.gateway_id.toString() || '');
    
    // Add billing model ID
    const billingModel = productBillingModels[product.product_id];
    formData.append('billing_model_id[]', billingModel?.id || '');
    
    // Add coupon code
    const couponInfo = productCoupons[product.product_id];
    formData.append('promoCodes[]', couponInfo?.isValid ? couponInfo.code : '0');
  });

  // Log form data for debugging
  const formDataObj: Record<string, any> = {};
  formData.forEach((value, key) => {
    formDataObj[key] = value;
  });
  console.log('Form Data:', formDataObj);

  return formData;
}

export function createCheckoutLinkFormData({
  customer,
  products,
  productGateways,
  productBillingModels,
  productCoupons,
  useSameAddress,
  selectedShippingMethod,
  isCallCenter,
}: {
  customer: Customer | null;
  products: Product[];
  productGateways: Record<number, Gateway>;
  productBillingModels: Record<number, BillingModel>;
  productCoupons: Record<number, any>;
  useSameAddress: boolean;
  selectedShippingMethod: ShippingMethod;
  isCallCenter: boolean;
}) {
  const formData = new FormData();

  formData.append('call_center_value', isCallCenter ? 'true' : 'false');
  formData.append('billingSameAsShipping', useSameAddress ? 'YES' : 'NO');
  formData.append('payment_type', 'offline');

  if (customer) {
    const shipping = customer.shippingAddress;
    const billing = customer.billingAddress;

    formData.append('email', customer.email);
    formData.append('first_name', customer.firstName);
    formData.append('last_name', customer.lastName);
    formData.append('phone', customer.phone.replace(/\D/g, ''));
    formData.append('address', shipping?.street || '');
    formData.append('city_name', shipping?.city || '');
    formData.append('state_name', shipping?.state || '');
    formData.append('zip_code', shipping?.zipCode || '');

    if (!useSameAddress) {
      formData.append('billing_first_name', billing?.firstName || '');
      formData.append('billing_last_name', billing?.lastName || '');
      formData.append('billing_email', billing?.email || '');
      formData.append('billing_phone', (billing?.phone || '').replace(/\D/g, ''));
      formData.append('billing_address', billing?.street || '');
      formData.append('billing_city', billing?.city || '');
      formData.append('billing_state', billing?.state || '');
      formData.append('billing_zip_code', billing?.zipCode || '');
    }
  }

  const shipAmount = parseFloat(selectedShippingMethod.initial_amount || '0');
  const shipFormatted = shipAmount.toFixed(2);
  formData.append('new_shipping_id', String(selectedShippingMethod.id));
  formData.append('shipping_code', selectedShippingMethod.code);
  formData.append('new_shipping_cost', shipFormatted);
  formData.append('shipping_cost', String(Math.round(shipAmount * 100) / 100));
  formData.append('shipping_name', selectedShippingMethod.name);

  products.forEach((product) => {
    formData.append('product_id[]', product.product_sku);

    const gateway = productGateways[product.product_id];
    formData.append('gateway_id[]', gateway?.gateway_id.toString() || '');

    const billingModel = productBillingModels[product.product_id];
    formData.append('billing_model_id[]', billingModel?.id || '');

    const couponInfo = productCoupons[product.product_id];
    formData.append('promoCodes[]', couponInfo?.isValid ? couponInfo.code : '0');

    const qty = product.quantity || 1;
    const lineUnit = product.product_price;
    const lineTotal = (lineUnit * qty).toFixed(2);
    formData.append('product_price[]', lineTotal);
    formData.append('original_price[]', lineTotal);
  });

  return formData;
}