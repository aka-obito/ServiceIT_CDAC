import api from './api';

// =============================================
// User & Provider Management (Admin)
// =============================================

// GET /api/admin/users
export const adminGetAllUsers = () => api.get('/admin/users');

// Helper to get providers from user list
export const adminGetAllProviders = () => api.get('/admin/users');

// GET /api/admin/providers/pending
export const adminGetPendingProviders = () => api.get('/admin/providers/pending');

// PATCH /api/admin/providers/{providerId}/status
export const adminUpdateProviderStatus = (providerId, data) =>
  api.patch(`/admin/providers/${providerId}/status`, data);

// Approve provider shortcut
export const adminApproveProvider = (providerId) =>
  api.patch(`/admin/providers/${providerId}/status`, { status: 'ACTIVE' });

// Reject provider shortcut
export const adminRejectProvider = (providerId) =>
  api.patch(`/admin/providers/${providerId}/status`, { status: 'REJECTED' });

// Toggle / Deactivate user status
export const adminToggleUserStatus = (userId) =>
  api.patch(`/admin/users/${userId}/status`);

// Delete user (soft delete / toggle status)
export const adminDeleteUser = (userId) =>
  api.patch(`/admin/users/${userId}/status`);

// =============================================
// Service Catalog Management (Admin CRUD)
// =============================================

// GET /api/admin/services
export const adminGetAllServices = () => api.get('/admin/services');

// GET /api/services/{id}
export const adminGetServiceById = (id) => api.get(`/services/${id}`);

// POST /api/admin/services
export const adminCreateService = (data) => api.post('/admin/services', data);

// PUT /api/admin/services/{id}
export const adminUpdateService = (id, data) =>
  api.put(`/admin/services/${id}`, data);

// PATCH /api/admin/services/{id}/status (toggle active/inactive)
export const adminToggleServiceStatus = (id) =>
  api.patch(`/admin/services/${id}/status`);

// Delete service alias
export const adminDeleteService = (id) =>
  api.patch(`/admin/services/${id}/status`);

// =============================================
// Booking Management (Admin)
// =============================================

// GET /api/admin/bookings
export const adminGetAllBookings = () => api.get('/admin/bookings');

// =============================================
// Payment Management (Admin)
// =============================================

// GET /api/admin/payments
export const adminGetAllPayments = () => api.get('/admin/payments');

// =============================================
// Audit Logs (Admin)
// =============================================

// GET /api/admin/logs
export const adminGetAuditLogs = (params) => api.get('/admin/logs', { params });
