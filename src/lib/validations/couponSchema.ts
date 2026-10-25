import { z } from 'zod';

export const couponSchema = z.object({
  name: z.string()
    .min(1, 'Coupon name is required')
    .transform(val => val.toUpperCase()),
  
  code: z.string()
    .min(3, 'Coupon code must be at least 3 characters')
    .transform(val => val.toUpperCase()),
  
  description: z.string()
    .min(1, 'Description is required'),
  
  percent: z.number()
    .min(0, 'Percentage must be at least 0')
    .max(100, 'Percentage cannot exceed 100'),
  
  minimum_purchase: z.number()
    .min(0, 'Minimum purchase must be at least 0'),
  
  date: z.string()
    .min(1, 'Expiry date is required'),
  
  total: z.number()
    .min(0, 'Total uses must be at least 0'),
  
  per_customer: z.number()
    .min(0, 'Per customer uses must be at least 0'),
  
  per_code: z.number()
    .min(0, 'Per code uses must be at least 0'),
  
  per_code_per_customer: z.number()
    .min(0, 'Per code per customer must be at least 0')
});

export type CouponFormData = z.infer<typeof couponSchema>;