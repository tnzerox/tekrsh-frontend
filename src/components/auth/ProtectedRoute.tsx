
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { LoadingSpinner } from '@/components/common/Loading';

interface ProtectedRouteProps {
  children: React.ReactNode;
  permission?: string;
  userType?: 'admin' | 'superadmin';
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  permission,
  userType 
}) => {
  const { isAuthenticated, isLoading, checkPermission, userType: currentUserType } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    const redirectPath = userType === 'superadmin' ? '/superadmin/login' : '/admin/login';
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  // Check user type if specified
  if (userType && currentUserType !== userType) {
    const redirectPath = currentUserType === 'superadmin' ? '/superadmin/dashboard' : '/admin/dashboard';
    return <Navigate to={redirectPath} replace />;
  }

  if (permission && !checkPermission(permission)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
