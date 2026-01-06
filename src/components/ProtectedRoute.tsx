import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useUserStore } from '../store/user';
import type { AppRouteObject } from '../utils/permission';

interface ProtectedRouteProps {
  children: React.ReactNode;
  route?: AppRouteObject;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, route }) => {
  const token = useUserStore((state) => state.token);
  const permissions = useUserStore((state) => state.permissions);
  const location = useLocation();

  // 1. Token 检查
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. 权限检查
  if (route?.meta?.permissions) {
    const hasAccess = route.meta.permissions.some((p) => permissions.includes(p));
    if (!hasAccess) {
      return <Navigate to="/403" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
