export interface BillingModel {
  id: string;
  name: string;
  bill_by_type: string;
  bill_by_type_id: string;
  interval_day: string;
  interval_week: string;
  preserve_quantity: string;
  bill_by_days: string;
  expire_cycles: string;
  buffer_days: string;
  frequency_dates: string[];
}

export interface BillingModelResponse {
  status: number;
  message: string;
  data: BillingModel[];
}