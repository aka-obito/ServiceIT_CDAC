import api from './api';

// POST /api/payments/create-order (CONSUMER)
// Body: { bookingId }
export const createRazorpayOrder = (bookingId) =>
  api.post('/payments/create-order', { bookingId });

// POST /api/payments/verify (CONSUMER)
// Body: { bookingId, razorpayOrderId, razorpayPaymentId, razorpaySignature }
export const verifyPayment = (data) => api.post('/payments/verify', data);

// GET /api/payments/booking/{bookingId} (ADMIN/CONSUMER/PROVIDER)
export const getPaymentByBookingId = (bookingId) =>
  api.get(`/payments/booking/${bookingId}`);

// GET /api/payments/{paymentId} (ADMIN/CONSUMER/PROVIDER)
export const getPaymentById = (paymentId) =>
  api.get(`/payments/${paymentId}`);

// GET /api/payments (ADMIN)
export const getAllPayments = () => api.get('/payments');
