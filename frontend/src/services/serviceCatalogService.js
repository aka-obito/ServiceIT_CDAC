import api from './api';

// GET /api/services — used by Provider when adding services (pick from catalog)
export const getAllServices = () => api.get('/services');

// GET /api/services/{serviceId}
export const getServiceById = (id) => api.get(`/services/${id}`);
