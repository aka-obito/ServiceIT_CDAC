import api from './api';

// GET /api/providers/profile
export const getMyProviderProfile = () => api.get('/providers/profile');

// POST or PUT /api/providers/profile (Backend creates or updates on PUT)
export const createProviderProfile = (data) => api.put('/providers/profile', data);

// PUT /api/providers/profile
export const updateProviderProfile = (data) => api.put('/providers/profile', data);

// DELETE /api/providers/profile
export const deleteProviderProfile = () => api.put('/providers/profile', {
  businessName: '',
  description: '',
  address: '',
  city: '',
  state: '',
  pincode: '',
  experienceYears: 0,
});

// GET /api/providers/{id}
export const getProviderById = (id) => api.get(`/providers/${id}`);
