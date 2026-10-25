import { z } from 'zod';

export const customerSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be 10 digits'),
  shippingAddress: z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    street: z.string().min(1, 'Street address is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    zipCode: z.string().min(5, 'ZIP code must be 5 digits'),
    email: z.string().email('Invalid email address'),
    phone: z.string().min(10, 'Phone number must be 10 digits'),
  }),
  billingAddress: z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    street: z.string().min(1, 'Street address is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    zipCode: z.string().min(5, 'ZIP code must be 5 digits'),
    email: z.string().email('Invalid email address'),
    phone: z.string().min(10, 'Phone number must be 10 digits'),
  }),
});

export const paymentSchema = z.object({
  cardholderName: z.string().min(1, 'Cardholder name is required'),
  cardNumber: z.string().min(16, 'Card number must be 16 digits').max(19),
  expiryDate: z.string().regex(/^(0[1-9]|1[0-2])\/([0-9]{2})$/, 'Invalid expiry date (MM/YY)'),
  cvv: z.string().min(3, 'CVV must be 3-4 digits').max(4),
});

export const orderSchema = z.object({
  customer: customerSchema,
  products: z.array(z.object({
    product_id: z.number(),
    quantity: z.number().min(1, 'Quantity is required'),
  })).min(1, 'At least one product is required'),
  payment: paymentSchema,
  shippingMethod: z.object({
    id: z.number(),
    price: z.number(),
  }).nullable(),
});