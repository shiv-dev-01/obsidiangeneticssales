import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

interface PermissionGuardProps {
  children: React.ReactNode;
  requiredPermission?: string[];
}

export function PermissionGuard({ children, requiredPermission }: PermissionGuardProps) {
  const permission = useAuthStore((state) => state.getPermissionLevel());

  // If no specific permission is required, just check authentication
  if (!requiredPermission) {
    return <>{children}</>;
  }

  // Check if user has required permission
  if (!permission || !requiredPermission.includes(permission)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}