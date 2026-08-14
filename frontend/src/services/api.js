import axios from 'axios';
import toast from 'react-hot-toast';
import { TOKEN_KEY } from '../utils/constants';

// =============================================
// AXIOS INSTANCE
// All requests go through Vite proxy → Spring Boot :8080
// =============================================
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// =============================================
// REQUEST INTERCEPTOR
// Automatically attach JWT Bearer token to every request
// =============================================
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// =============================================
// RESPONSE INTERCEPTOR
// Auto logout on 401 Unauthorized
// =============================================
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isLoginEndpoint = error.config?.url?.includes('/auth/login');
    if (error.response?.status === 401 && !isLoginEndpoint) {
      // Clear auth state and redirect to login only if not already logging in
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem('serviceit_user');
      toast.error('Session expired. Please login again.');
      setTimeout(() => {
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }, 1000);
    }
    return Promise.reject(error);
  }
);

export default api;
