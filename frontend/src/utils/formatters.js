import { format, parseISO } from 'date-fns';

/**
 * Format a date string or LocalDate from backend (YYYY-MM-DD or ISO timestamp) to readable form: "10 Aug 2026".
 */
export const formatDate = (dateInput) => {
  if (!dateInput) return '—';
  try {
    if (Array.isArray(dateInput)) {
      const [year, month, day] = dateInput;
      return format(new Date(year, month - 1, day), 'dd MMM yyyy');
    }
    if (typeof dateInput === 'string') {
      const cleanStr = dateInput.replace(/\[.*\]$/, '');
      const d = new Date(cleanStr);
      if (!isNaN(d.getTime())) {
        return format(d, 'dd MMM yyyy');
      }
    }
    const d = new Date(dateInput);
    if (!isNaN(d.getTime())) {
      return format(d, 'dd MMM yyyy');
    }
    return String(dateInput);
  } catch {
    return String(dateInput);
  }
};

/**
 * Format a time string (HH:mm:ss, ISO DateTime, or Array) to readable 12-hour format: "02:30 PM".
 */
export const formatTime = (timeInput) => {
  if (!timeInput) return '—';
  try {
    // If it's an Array format from Jackson: [year, month, day, hour, min, sec]
    if (Array.isArray(timeInput)) {
      const [year, month, day, hour = 0, min = 0, sec = 0] = timeInput;
      const d = new Date(year, month - 1, day, hour, min, sec);
      return format(d, 'hh:mm a');
    }

    if (typeof timeInput === 'string') {
      const cleanStr = timeInput.replace(/\[.*\]$/, '');

      // If it's an ISO DateTime string (e.g., "2026-08-10T00:15:30" or "2026-08-10 00:15:30")
      if (cleanStr.includes('T') || (cleanStr.includes('-') && cleanStr.includes(':'))) {
        const d = new Date(cleanStr);
        if (!isNaN(d.getTime())) {
          return format(d, 'hh:mm a');
        }
      }

      // If it's a plain LocalTime string (e.g., "14:30:00" or "14:30")
      if (cleanStr.includes(':')) {
        const parts = cleanStr.split(':');
        const h = parseInt(parts[0], 10);
        const m = parts[1] || '00';
        if (!isNaN(h)) {
          const ampm = h >= 12 ? 'PM' : 'AM';
          const hour12 = h % 12 || 12;
          return `${hour12}:${m} ${ampm}`;
        }
      }
    }

    // If it's already a Date object
    if (timeInput instanceof Date && !isNaN(timeInput.getTime())) {
      return format(timeInput, 'hh:mm a');
    }

    return String(timeInput);
  } catch {
    return String(timeInput);
  }
};

/**
 * Format datetime string from backend (ISO).
 */
export const formatDateTime = (dateTimeStr) => {
  if (!dateTimeStr) return '—';
  try {
    return `${formatDate(dateTimeStr)} at ${formatTime(dateTimeStr)}`;
  } catch {
    return String(dateTimeStr);
  }
};

/**
 * Format currency in Indian Rupees.
 */
export const formatCurrency = (amount) => {
  if (amount === null || amount === undefined) return '—';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Format experience years.
 */
export const formatExperience = (years) => {
  if (years === null || years === undefined) return '—';
  if (years === 0) return 'Fresher';
  return `${years} year${years > 1 ? 's' : ''}`;
};

/**
 * Format duration in minutes to human-readable.
 */
export const formatDuration = (minutes) => {
  if (!minutes) return '—';
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
};

/**
 * Get initials from a full name (for avatar).
 */
export const getInitials = (name) => {
  if (!name) return '?';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

/**
 * Extract error message from Axios error response.
 * Backend always returns { message, timestamp } on errors.
 */
export const getErrorMessage = (error) => {
  return (
    error?.response?.data?.message ||
    error?.message ||
    'Something went wrong. Please try again.'
  );
};
