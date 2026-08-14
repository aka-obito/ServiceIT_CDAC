import api from './api';

// GET /api/admin/logs (ADMIN only)
export const getAllAuditLogs = (params) => api.get('/admin/logs', { params });

// GET /api/admin/logs (Returns logs, sliced to recent on client if needed)
export const getRecentAuditLogs = () => api.get('/admin/logs');
