import api from './api';

// POST /api/auth/register
export const register = (userData) => api.post('/auth/register', userData);

// POST /api/auth/login
export const login = (credentials) => api.post('/auth/login', credentials);

// GET /api/auth/verify-email?token=...
export const verifyEmail = (token) =>
  api.get(`/auth/verify-email`, { params: { token } });

// POST /api/auth/forgot-password
export const forgotPassword = (data) => api.post('/auth/forgot-password', data);

// POST /api/auth/reset-password
export const resetPassword = (data) => api.post('/auth/reset-password', data);

// GET /api/users/me
export const getCurrentUser = () => api.get('/users/me');

// PUT /api/users/me
export const updateCurrentUser = (data) => api.put('/users/me', data);
