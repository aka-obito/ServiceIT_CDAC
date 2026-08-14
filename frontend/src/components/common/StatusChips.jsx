import React from 'react';
import { Chip } from '@mui/material';
import { BOOKING_STATUS_META, PAYMENT_STATUS_META, USER_STATUS_META } from '../../utils/constants';

export const BookingStatusChip = ({ status }) => {
  const meta = BOOKING_STATUS_META[status] || { label: status, color: 'default' };
  return <Chip label={meta.label} color={meta.color} size="small" />;
};

export const PaymentStatusChip = ({ status }) => {
  const meta = PAYMENT_STATUS_META[status] || { label: status, color: 'default' };
  return <Chip label={meta.label} color={meta.color} size="small" />;
};

export const UserStatusChip = ({ status }) => {
  const meta = USER_STATUS_META[status] || { label: status, color: 'default' };
  return <Chip label={meta.label} color={meta.color} size="small" />;
};
