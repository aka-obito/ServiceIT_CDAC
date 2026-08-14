import api from './api';

// GET /api/provider-services/available (public)
export const searchProviderServices = (params) =>
  api.get('/provider-services/available', { params });

// GET /api/provider-services/{id}
export const getProviderServiceById = (id) =>
  api.get(`/provider-services/${id}`);

// GET /api/provider-services/provider/{providerId}
export const getServicesByProvider = (providerId) =>
  api.get(`/provider-services/provider/${providerId}`);

// GET /api/provider-services/service/{serviceId}
export const getProvidersByService = (serviceId) =>
  api.get(`/provider-services/service/${serviceId}`);

// GET /api/provider-services/my-services (PROVIDER)
export const getMyProviderServices = () =>
  api.get('/provider-services/my-services');

// POST /api/provider-services (PROVIDER)
export const createProviderService = (data) =>
  api.post('/provider-services', data);

// PUT /api/provider-services/{id} (PROVIDER)
export const updateProviderService = (id, data) =>
  api.put(`/provider-services/${id}`, data);

// PATCH /api/provider-services/{id}/availability (PROVIDER)
export const toggleProviderServiceAvailability = (id) =>
  api.patch(`/provider-services/${id}/availability`);

// DELETE /api/provider-services/{id} (PROVIDER)
export const deleteProviderService = (id) =>
  api.delete(`/provider-services/${id}`);
