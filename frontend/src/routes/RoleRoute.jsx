import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Restricts access to a route based on user role.
 * allowedRoles: array of roles that can access this route.
 * If user's role doesn't match, redirects to their own dashboard.
 */
const RoleRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  if (!allowedRoles.includes(user.role)) {
    // Redirect to correct dashboard
    const dashboardMap = {
      ADMIN: '/admin/dashboard',
      CONSUMER: '/consumer/dashboard',
      PROVIDER: '/provider/dashboard',
    };
    return <Navigate to={dashboardMap[user.role] || '/login'} replace />;
  }

  return children;
};

export default RoleRoute;
