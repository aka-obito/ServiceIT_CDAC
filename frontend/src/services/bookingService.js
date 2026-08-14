import api from './api';

// POST /api/bookings (CONSUMER)
export const createBooking = (data) => api.post('/bookings', data);

// GET /api/bookings/consumer/my-bookings (CONSUMER)
export const getMyBookings = () => api.get('/bookings/consumer/my-bookings');

// GET /api/bookings/provider/my-bookings (PROVIDER)
export const getProviderBookings = () => api.get('/bookings/provider/my-bookings');

// GET /api/bookings/{bookingId}
export const getBookingById = (id) => api.get(`/bookings/${id}`);

// PATCH /api/bookings/{bookingId}/cancel
export const cancelBooking = (id) => api.patch(`/bookings/${id}/cancel`);

// PATCH /api/bookings/{bookingId}/status (PROVIDER/ADMIN)
export const updateBookingStatus = (id, data) => api.patch(`/bookings/${id}/status`, data);

// Complete booking shortcut (PROVIDER)
export const completeBooking = (id) => api.patch(`/bookings/${id}/status`, { status: 'COMPLETED' });

// GET /api/admin/bookings (ADMIN)
export const getAllBookings = () => api.get('/admin/bookings');
