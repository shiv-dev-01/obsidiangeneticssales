export interface Agent {
  id: number;
  email: string;
  name: string;
  commission: string;
  created_at: string;
  commission_type: 'percentage' | 'dollar';
}

export interface AgentsListResponse {
  status: number;
  message: string;
  data: Agent[];
}

export interface EditCommissionPayload {
  id: number;
  commission: number;
  commission_type: 'percentage' | 'dollar';
}

export interface EditCommissionResponse {
  status: number;
  message: string;
}
