export interface User {
  id: number;
  admin_id: number;
  name: string;
  email: string;
  is_permission: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface LoginResponse {
  status: number;
  message: string;
  admin_id?: number;
  name?: string;
  email?: string;
  is_permission?: string;
}