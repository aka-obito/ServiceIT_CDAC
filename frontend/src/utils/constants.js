// =============================================
// APPLICATION CONSTANTS
// Match exactly with backend enums and config
// =============================================

// API Base URL — using Vite proxy, so just /api
export const API_BASE_URL = '/api';

// =============================================
// ENUMS — mirrored from backend
// =============================================
export const UserRole = {
  ADMIN: 'ADMIN',
  PROVIDER: 'PROVIDER',
  CONSUMER: 'CONSUMER',
};

export const UserStatus = {
  PENDING: 'PENDING',
  ACTIVE: 'ACTIVE',
  BLOCKED: 'BLOCKED',
  REJECTED: 'REJECTED',
};

export const BookingStatus = {
  PENDING_PAYMENT: 'PENDING_PAYMENT',
  CONFIRMED: 'CONFIRMED',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
};

export const PaymentStatus = {
  PENDING: 'PENDING',
  SUCCESS: 'SUCCESS',
  FAILED: 'FAILED',
  REFUNDED: 'REFUNDED',
};

export const PaymentMethod = {
  ONLINE: 'ONLINE',
};

// =============================================
// VALIDATION REGEX — mirrored from ValidationConstants.java
// =============================================
export const PHONE_REGEX = /^[6-9]\d{9}$/;
export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
export const PINCODE_REGEX = /^\d{6}$/;

// =============================================
// LOCAL STORAGE KEYS
// =============================================
export const TOKEN_KEY = 'serviceit_token';
export const USER_KEY = 'serviceit_user';

// =============================================
// RAZORPAY KEY (test)
// =============================================
export const RAZORPAY_KEY_ID = 'rzp_test_placeholder';

// =============================================
// SORT OPTIONS for service search
// =============================================
export const SORT_OPTIONS = [
  { label: 'Default', value: '' },
  { label: 'Price: Low to High', value: 'priceAsc' },
  { label: 'Price: High to Low', value: 'priceDesc' },
];

// =============================================
// BOOKING STATUS LABELS & COLORS
// =============================================
export const BOOKING_STATUS_META = {
  PENDING_PAYMENT: { label: 'Pending Payment', color: 'warning' },
  CONFIRMED: { label: 'Confirmed', color: 'info' },
  COMPLETED: { label: 'Completed', color: 'success' },
  CANCELLED: { label: 'Cancelled', color: 'error' },
};

export const PAYMENT_STATUS_META = {
  PENDING: { label: 'Pending', color: 'warning' },
  SUCCESS: { label: 'Success', color: 'success' },
  FAILED: { label: 'Failed', color: 'error' },
  REFUNDED: { label: 'Refunded', color: 'info' },
};

export const USER_STATUS_META = {
  PENDING: { label: 'Pending', color: 'warning' },
  ACTIVE: { label: 'Active', color: 'success' },
  BLOCKED: { label: 'Blocked', color: 'error' },
  REJECTED: { label: 'Rejected', color: 'default' },
};
