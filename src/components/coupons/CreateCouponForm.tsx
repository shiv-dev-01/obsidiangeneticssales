import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Tag, Percent, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';
import { couponService } from '../../lib/api/services/coupons';
import { couponSchema, type CouponFormData } from '../../lib/validations/couponSchema';
import { cn } from '../../lib/utils';

export function CreateCouponForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch
  } = useForm<CouponFormData>({
    resolver: zodResolver(couponSchema),
    defaultValues: {
      minimum_purchase: 0,
      total: 0,
      per_customer: 0,
      per_code: 0,
      per_code_per_customer: 0,
      percent: 10,
    }
  });

  // Watch name and code fields to transform to uppercase
  const name = watch('name');
  const code = watch('code');

  React.useEffect(() => {
    if (name) {
      setValue('name', name.toUpperCase());
    }
  }, [name, setValue]);

  React.useEffect(() => {
    if (code) {
      setValue('code', code.toUpperCase());
    }
  }, [code, setValue]);

  const onSubmit = async (data: CouponFormData) => {
    try {
      const response = await couponService.createCoupon(data);
      if (response.status === 1) {
        toast.success('Coupon created successfully');
        reset();
      } else {
        toast.error(response.message || 'Failed to create coupon');
      }
    } catch (error) {
      toast.error('Failed to create coupon');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Basic Information Section */}
      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-1 rounded-xl">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center gap-2 mb-6">
            <Tag className="h-5 w-5 text-gray-400" />
            <h2 className="text-lg font-medium text-gray-900">Basic Information</h2>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Coupon Name
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                {...register('name')}
                className={cn(
                  "mt-1 block w-full rounded-lg shadow-sm py-2 px-3 uppercase",
                  "focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500",
                  errors.name ? "border-red-300" : "border-gray-300"
                )}
                placeholder="SUMMER SALE"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Coupon Code
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                {...register('code')}
                className={cn(
                  "mt-1 block w-full rounded-lg shadow-sm py-2 px-3 uppercase",
                  "focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500",
                  errors.code ? "border-red-300" : "border-gray-300"
                )}
                placeholder="SUMMER2024"
              />
              {errors.code && (
                <p className="mt-1 text-sm text-red-600">{errors.code.message}</p>
              )}
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Description
                <span className="text-red-500 ml-1">*</span>
              </label>
              <textarea
                {...register('description')}
                rows={3}
                className={cn(
                  "mt-1 block w-full rounded-lg shadow-sm py-2 px-3",
                  "focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500",
                  errors.description ? "border-red-300" : "border-gray-300"
                )}
                placeholder="Describe the purpose and terms of this coupon"
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Discount Rules Section */}
      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-1 rounded-xl">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center gap-2 mb-6">
            <Percent className="h-5 w-5 text-gray-400" />
            <h2 className="text-lg font-medium text-gray-900">Discount Rules</h2>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Discount Percentage (%)
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="number"
                {...register('percent', { valueAsNumber: true })}
                className={cn(
                  "mt-1 block w-full rounded-lg shadow-sm py-2 px-3",
                  "focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500",
                  errors.percent ? "border-red-300" : "border-gray-300"
                )}
              />
              {errors.percent && (
                <p className="mt-1 text-sm text-red-600">{errors.percent.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Minimum Purchase ($)
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="number"
                {...register('minimum_purchase', { valueAsNumber: true })}
                className={cn(
                  "mt-1 block w-full rounded-lg shadow-sm py-2 px-3",
                  "focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500",
                  errors.minimum_purchase ? "border-red-300" : "border-gray-300"
                )}
              />
              {errors.minimum_purchase && (
                <p className="mt-1 text-sm text-red-600">{errors.minimum_purchase.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Expiry Date
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="date"
                {...register('date')}
                className={cn(
                  "mt-1 block w-full rounded-lg shadow-sm py-2 px-3",
                  "focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500",
                  errors.date ? "border-red-300" : "border-gray-300"
                )}
              />
              {errors.date && (
                <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Usage Limits Section */}
      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-1 rounded-xl">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center gap-2 mb-6">
            <Calendar className="h-5 w-5 text-gray-400" />
            <h2 className="text-lg font-medium text-gray-900">Usage Limits</h2>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Total Uses
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="number"
                {...register('total', { valueAsNumber: true })}
                className={cn(
                  "mt-1 block w-full rounded-lg shadow-sm py-2 px-3",
                  "focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500",
                  errors.total ? "border-red-300" : "border-gray-300"
                )}
              />
              {errors.total && (
                <p className="mt-1 text-sm text-red-600">{errors.total.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Uses Per Customer
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="number"
                {...register('per_customer', { valueAsNumber: true })}
                className={cn(
                  "mt-1 block w-full rounded-lg shadow-sm py-2 px-3",
                  "focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500",
                  errors.per_customer ? "border-red-300" : "border-gray-300"
                )}
              />
              {errors.per_customer && (
                <p className="mt-1 text-sm text-red-600">{errors.per_customer.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Uses Per Code
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="number"
                {...register('per_code', { valueAsNumber: true })}
                className={cn(
                  "mt-1 block w-full rounded-lg shadow-sm py-2 px-3",
                  "focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500",
                  errors.per_code ? "border-red-300" : "border-gray-300"
                )}
              />
              {errors.per_code && (
                <p className="mt-1 text-sm text-red-600">{errors.per_code.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Uses Per Code Per Customer
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="number"
                {...register('per_code_per_customer', { valueAsNumber: true })}
                className={cn(
                  "mt-1 block w-full rounded-lg shadow-sm py-2 px-3",
                  "focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500",
                  errors.per_code_per_customer ? "border-red-300" : "border-gray-300"
                )}
              />
              {errors.per_code_per_customer && (
                <p className="mt-1 text-sm text-red-600">{errors.per_code_per_customer.message}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 transition-all duration-200 transform hover:scale-[1.02]"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
              Creating Coupon...
            </>
          ) : (
            'Create Coupon'
          )}
        </button>
      </div>
    </form>
  );
}