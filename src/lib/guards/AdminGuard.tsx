import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { SUPER_ADMIN_ID } from '../constants/admin';

interface AdminGuardProps {
  children: React.ReactNode;
}

export function AdminGuard({ children }: AdminGuardProps) {
  const adminId = useAuthStore((state) => state.getAdminId());

  if (adminId !== SUPER_ADMIN_ID) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}
