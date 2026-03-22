import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

/**
 * Wrapper component for React Router.
 * Usage: <ProtectedRoute><ChatLayout /></ProtectedRoute>
 * 
 * If a user is not logged in, it intercepts the render and redirects them to /login
 * while remembering where they WERE trying to go (state={{ from: location }}).
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAdmin = false 
}) => {
  const { isAuthenticated, isAdmin } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect unauthenticated users to login, pass the original requested URL
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireAdmin && !isAdmin) {
    // Authenticated, but not an admin attempting to access an admin-only route
    return <Navigate to="/chat" replace />;
  }

  return <>{children}</>;
};
