import type { OrderState } from '../../store/orderStore';
import { validatePhoneNumber } from '../utils/validation';

export function validateOrder(state: OrderState): string | null {
  const { customer, products, payment, productGateways, selectedShippingMethod } = state;

  // Customer validation
  if (!customer?.firstName?.trim()) return 'Customer first name is required';
  if (!customer?.lastName?.trim()) return 'Customer last name is required';
  if (!customer?.email?.trim()) return 'Customer email is required';
  if (!customer?.phone?.trim()) return 'Customer phone number is required';
  if (!validatePhoneNumber(customer.phone)) return 'Invalid customer phone number';

  // Shipping address validation
  if (!customer?.shippingAddress?.firstName?.trim()) return 'Shipping first name is required';
  if (!customer?.shippingAddress?.lastName?.trim()) return 'Shipping last name is required';
  if (!customer?.shippingAddress?.street?.trim()) return 'Shipping street address is required';
  if (!customer?.shippingAddress?.city?.trim()) return 'Shipping city is required';
  if (!customer?.shippingAddress?.state?.trim()) return 'Shipping state is required';
  if (!customer?.shippingAddress?.zipCode?.trim()) return 'Shipping ZIP code is required';
  if (!customer?.shippingAddress?.email?.trim()) return 'Shipping email is required';
  if (!customer?.shippingAddress?.phone?.trim()) return 'Shipping phone is required';
  if (!validatePhoneNumber(customer.shippingAddress.phone)) return 'Invalid shipping phone number';

  // Product validation
  if (!products.length) return 'Please select at least one product';

  // Payment gateway validation for each product
  for (const product of products) {
    if (!productGateways[product.product_id]) {
      return `Please select a payment gateway for ${product.product_name}`;
    }
  }

  // Payment validation
  if (!payment?.cardholderName?.trim()) return 'Cardholder name is required';
  if (!payment?.cardNumber?.trim()) return 'Card number is required';
  if (!payment?.expiryDate?.trim()) return 'Card expiry date is required';
  if (!payment?.cvv?.trim()) return 'CVV is required';

  // Shipping method validation
  if (!selectedShippingMethod) return 'Please select a shipping method';

  return null;
}

/** Same as order creation except card details are not required (checkout uses payment_type offline). */
export function validateCheckoutLink(state: OrderState): string | null {
  const {
    customer,
    products,
    productGateways,
    productBillingModels,
    selectedShippingMethod,
  } = state;

  if (!customer?.firstName?.trim()) return 'Customer first name is required';
  if (!customer?.lastName?.trim()) return 'Customer last name is required';
  if (!customer?.email?.trim()) return 'Customer email is required';
  if (!customer?.phone?.trim()) return 'Customer phone number is required';
  if (!validatePhoneNumber(customer.phone)) return 'Invalid customer phone number';

  if (!products.length) return 'Please select at least one product';

  for (const product of products) {
    if (!productGateways[product.product_id]) {
      return `Please select a payment gateway for ${product.product_name}`;
    }
  }

  if (!selectedShippingMethod) return 'Please select a shipping method';

  for (const product of products) {
    if (!productBillingModels[product.product_id]) {
      return `Please select a billing model for ${product.product_name}`;
    }
  }

  return null;
}