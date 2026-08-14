import api from './api';

// GET /api/consumers/profile
export const getMyConsumerProfile = () => api.get('/consumers/profile');

// POST or PUT /api/consumers/profile (Backend creates or updates on PUT)
export const createConsumerProfile = (data) => api.put('/consumers/profile', data);

// PUT /api/consumers/profile
export const updateConsumerProfile = (data) => api.put('/consumers/profile', data);

// DELETE /api/consumers/profile (Clear profile)
export const deleteConsumerProfile = () => api.put('/consumers/profile', { address: '', city: '', state: '', pincode: '' });

// GET /api/consumers/{id}
export const getConsumerById = (id) => api.get(`/consumers/${id}`);
