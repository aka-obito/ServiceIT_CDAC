import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProtectedRoute from './ProtectedRoute';
import RoleRoute from './RoleRoute';
import PageLoader from '../components/common/PageLoader';
import PublicLayout from '../layouts/PublicLayout';
import ConsumerLayout from '../layouts/ConsumerLayout';
import ProviderLayout from '../layouts/ProviderLayout';
import AdminLayout from '../layouts/AdminLayout';

// Lazy-load all pages
const LandingPage = lazy(() => import('../pages/public/LandingPage'));
const LoginPage = lazy(() => import('../pages/public/LoginPage'));
const RegisterPage = lazy(() => import('../pages/public/RegisterPage'));
const VerifyEmailPage = lazy(() => import('../pages/public/VerifyEmailPage'));
const VerifyPendingPage = lazy(() => import('../pages/public/VerifyPendingPage'));
const ForgotPasswordPage = lazy(() => import('../pages/public/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('../pages/public/ResetPasswordPage'));

const ConsumerDashboard = lazy(() => import('../pages/consumer/ConsumerDashboard'));
const ConsumerProfile = lazy(() => import('../pages/consumer/ConsumerProfile'));
const SearchServices = lazy(() => import('../pages/consumer/SearchServices'));
const BookingPage = lazy(() => import('../pages/consumer/BookingPage'));
const MyBookings = lazy(() => import('../pages/consumer/MyBookings'));
const PaymentStatus = lazy(() => import('../pages/consumer/PaymentStatus'));

const ProviderDashboard = lazy(() => import('../pages/provider/ProviderDashboard'));
const ProviderProfile = lazy(() => import('../pages/provider/ProviderProfile'));
const ManageServices = lazy(() => import('../pages/provider/ManageServices'));
const ProviderBookings = lazy(() => import('../pages/provider/ProviderBookings'));

const AdminDashboard = lazy(() => import('../pages/admin/AdminDashboard'));
const UserManagement = lazy(() => import('../pages/admin/UserManagement'));
const ServiceCatalog = lazy(() => import('../pages/admin/ServiceCatalog'));
const BookingManagement = lazy(() => import('../pages/admin/BookingManagement'));
const PaymentManagement = lazy(() => import('../pages/admin/PaymentManagement'));
const ActivityLogs = lazy(() => import('../pages/admin/ActivityLogs'));

/** Redirect authenticated users to their role dashboard */
const AuthRedirect = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  if (isAuthenticated && user && user.role) {
    const map = {
      ADMIN: '/admin/dashboard',
      CONSUMER: '/consumer/dashboard',
      PROVIDER: '/provider/dashboard',
    };
    const target = map[user.role];
    if (target) {
      return <Navigate to={target} replace />;
    }
  }
  return children;
};

const AppRouter = () => (
  <Suspense fallback={<PageLoader />}>
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<AuthRedirect><LandingPage /></AuthRedirect>} />
        <Route path="/login" element={<AuthRedirect><LoginPage /></AuthRedirect>} />
        <Route path="/register" element={<AuthRedirect><RegisterPage /></AuthRedirect>} />
        <Route path="/forgot-password" element={<AuthRedirect><ForgotPasswordPage /></AuthRedirect>} />
        <Route path="/reset-password" element={<AuthRedirect><ResetPasswordPage /></AuthRedirect>} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/verify-pending" element={<VerifyPendingPage />} />
      </Route>

      {/* Consumer Routes */}
      <Route element={<ProtectedRoute><RoleRoute allowedRoles={['CONSUMER']}><ConsumerLayout /></RoleRoute></ProtectedRoute>}>
        <Route path="/consumer/dashboard" element={<ConsumerDashboard />} />
        <Route path="/consumer/profile" element={<ConsumerProfile />} />
        <Route path="/consumer/search" element={<SearchServices />} />
        <Route path="/consumer/book/:providerServiceId" element={<BookingPage />} />
        <Route path="/consumer/bookings" element={<MyBookings />} />
        <Route path="/consumer/payment-status" element={<PaymentStatus />} />
      </Route>

      {/* Provider Routes */}
      <Route element={<ProtectedRoute><RoleRoute allowedRoles={['PROVIDER']}><ProviderLayout /></RoleRoute></ProtectedRoute>}>
        <Route path="/provider/dashboard" element={<ProviderDashboard />} />
        <Route path="/provider/profile" element={<ProviderProfile />} />
        <Route path="/provider/services" element={<ManageServices />} />
        <Route path="/provider/bookings" element={<ProviderBookings />} />
      </Route>

      {/* Admin Routes */}
      <Route element={<ProtectedRoute><RoleRoute allowedRoles={['ADMIN']}><AdminLayout /></RoleRoute></ProtectedRoute>}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<UserManagement />} />
        <Route path="/admin/services" element={<ServiceCatalog />} />
        <Route path="/admin/bookings" element={<BookingManagement />} />
        <Route path="/admin/payments" element={<PaymentManagement />} />
        <Route path="/admin/logs" element={<ActivityLogs />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </Suspense>
);

export default AppRouter;
