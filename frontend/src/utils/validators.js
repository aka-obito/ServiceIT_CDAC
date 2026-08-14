import * as yup from 'yup';
import { PHONE_REGEX, PASSWORD_REGEX, PINCODE_REGEX } from './constants';

// =============================================
// AUTH SCHEMAS
// =============================================

export const loginSchema = yup.object({
  email: yup
    .string()
    .email('Please enter a valid email address.')
    .required('Email is required.'),
  password: yup.string().required('Password is required.'),
});

export const registerSchema = yup.object({
  fullName: yup
    .string()
    .min(3, 'Full name must be between 3 and 100 characters.')
    .max(100, 'Full name must be between 3 and 100 characters.')
    .required('Full name is required.'),
  email: yup
    .string()
    .email('Please enter a valid email address.')
    .required('Email is required.'),
  phone: yup
    .string()
    .matches(PHONE_REGEX, 'Phone number must be exactly 10 digits and start with 6, 7, 8, or 9.')
    .required('Phone number is required.'),
  password: yup
    .string()
    .matches(
      PASSWORD_REGEX,
      'Password must be at least 8 characters long and contain uppercase, lowercase, number and special character.'
    )
    .required('Password is required.'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Passwords must match.')
    .required('Please confirm your password.'),
  role: yup
    .string()
    .oneOf(['CONSUMER', 'PROVIDER'], 'Please select a valid role.')
    .required('User role is required.'),
});

export const forgotPasswordSchema = yup.object({
  email: yup
    .string()
    .email('Please enter a valid email address.')
    .required('Email is required.'),
});

export const resetPasswordSchema = yup.object({
  newPassword: yup
    .string()
    .matches(
      PASSWORD_REGEX,
      'Password must be at least 8 characters long and contain uppercase, lowercase, number and special character.'
    )
    .required('New password is required.'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('newPassword'), null], 'Passwords must match.')
    .required('Please confirm your new password.'),
});

// =============================================
// CONSUMER PROFILE SCHEMA
// =============================================
export const consumerProfileSchema = yup.object({
  address: yup
    .string()
    .max(255, 'Address cannot exceed 255 characters.')
    .required('Address is required.'),
  city: yup
    .string()
    .max(100, 'City cannot exceed 100 characters.')
    .required('City is required.'),
  state: yup
    .string()
    .max(100, 'State cannot exceed 100 characters.')
    .required('State is required.'),
  pincode: yup
    .string()
    .matches(PINCODE_REGEX, 'Pincode must be exactly 6 digits.')
    .required('Pincode is required.'),
});

// =============================================
// PROVIDER PROFILE SCHEMA
// =============================================
export const providerProfileSchema = yup.object({
  businessName: yup
    .string()
    .max(100, 'Business name cannot exceed 100 characters.')
    .required('Business name is required.'),
  description: yup
    .string()
    .max(500, 'Description cannot exceed 500 characters.')
    .nullable(),
  address: yup
    .string()
    .max(255, 'Address cannot exceed 255 characters.')
    .required('Address is required.'),
  city: yup
    .string()
    .max(100, 'City cannot exceed 100 characters.')
    .required('City is required.'),
  state: yup
    .string()
    .max(100, 'State cannot exceed 100 characters.')
    .required('State is required.'),
  pincode: yup
    .string()
    .matches(PINCODE_REGEX, 'Pincode must be exactly 6 digits.')
    .required('Pincode is required.'),
  experienceYears: yup
    .number()
    .min(0, 'Experience cannot be negative.')
    .max(60, 'Invalid experience value.')
    .typeError('Experience must be a number.')
    .required('Experience is required.'),
});

// =============================================
// PROVIDER SERVICE SCHEMA
// =============================================
export const providerServiceSchema = yup.object({
  serviceId: yup
    .number()
    .typeError('Please select a service.')
    .required('Service is required.'),
  price: yup
    .number()
    .min(0.01, 'Price must be greater than zero.')
    .typeError('Price must be a number.')
    .required('Price is required.'),
  estimatedDuration: yup
    .number()
    .min(1, 'Estimated duration must be at least 1 minute.')
    .typeError('Duration must be a number.')
    .required('Estimated duration is required.'),
  description: yup
    .string()
    .max(500, 'Description cannot exceed 500 characters.')
    .nullable(),
  available: yup
    .boolean()
    .typeError('Availability is required.')
    .required('Availability is required.'),
});

// =============================================
// BOOKING SCHEMA
// =============================================
export const bookingSchema = yup.object({
  serviceDate: yup
    .string()
    .required('Service date is required.'),
  serviceTime: yup
    .string()
    .required('Service time is required.'),
  serviceAddress: yup
    .string()
    .max(255, 'Service address cannot exceed 255 characters.')
    .required('Service address is required.'),
  specialInstructions: yup
    .string()
    .max(500, 'Special instructions cannot exceed 500 characters.')
    .nullable(),
});

// =============================================
// SERVICE CATALOG SCHEMA (Admin)
// =============================================
export const serviceCatalogSchema = yup.object({
  serviceName: yup
    .string()
    .max(100, 'Service name cannot exceed 100 characters.')
    .required('Service name is required.'),
  description: yup
    .string()
    .max(500, 'Description cannot exceed 500 characters.')
    .nullable(),
});
