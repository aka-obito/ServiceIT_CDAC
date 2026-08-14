import React, { useEffect, useState } from 'react';
import {
  Box, Card, CardContent, Typography, Button, Skeleton, Grid,
  Accordion, AccordionSummary, AccordionDetails, Divider, CircularProgress,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import PaymentRoundedIcon from '@mui/icons-material/PaymentRounded';
import BookmarkRoundedIcon from '@mui/icons-material/BookmarkRounded';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

import { getMyBookings, cancelBooking } from '../../services/bookingService';
import { getPaymentByBookingId, createRazorpayOrder, verifyPayment } from '../../services/paymentService';
import { formatDate, formatTime, formatCurrency, getErrorMessage } from '../../utils/formatters';
import { BookingStatusChip, PaymentStatusChip } from '../../components/common/StatusChips';
import EmptyState from '../../components/common/EmptyState';
import ConfirmDialog from '../../components/common/ConfirmDialog';

// Load Razorpay script dynamically
const loadRazorpay = () =>
  new Promise((resolve) => {
    if (window.Razorpay) { resolve(true); return; }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [payments, setPayments] = useState({});
  const [cancelId, setCancelId] = useState(null);
  const [cancelling, setCancelling] = useState(false);
  const [payingId, setPayingId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getMyBookings()
      .then(res => setBookings(res.data))
      .catch(err => toast.error(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  const fetchPayment = async (bookingId) => {
    if (payments[bookingId] !== undefined) return;
    try {
      const res = await getPaymentByBookingId(bookingId);
      setPayments(prev => ({ ...prev, [bookingId]: res.data }));
    } catch {
      setPayments(prev => ({ ...prev, [bookingId]: null }));
    }
  };

  const handleCancel = async () => {
    setCancelling(true);
    try {
      const res = await cancelBooking(cancelId);
      setBookings(prev => prev.map(b => b.bookingId === cancelId ? res.data : b));
      toast.success('Booking cancelled.');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setCancelling(false);
      setCancelId(null);
    }
  };

  const handlePayNow = async (booking) => {
    setPayingId(booking.bookingId);
    try {
      // 1. Create Razorpay Order for the existing booking
      const orderRes = await createRazorpayOrder(booking.bookingId);
      const order = orderRes.data;

      // 2. Ensure Razorpay Checkout script is loaded
      const loaded = await loadRazorpay();
      if (!loaded) {
        toast.error('Payment gateway failed to load. Please try again.');
        setPayingId(null);
        return;
      }

      // 3. Launch Razorpay modal
      const options = {
        key: order.razorpayKeyId || order.razorpayKey,
        amount: Math.round(Number(order.amount) * 100), // in paise
        currency: order.currency || 'INR',
        name: 'SERVICEiT',
        description: `Payment for ${booking.serviceName}`,
        order_id: order.razorpayOrderId || order.orderId,
        handler: async (response) => {
          try {
            const verifyPayload = {
              bookingId: booking.bookingId,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            };
            await verifyPayment(verifyPayload);
            toast.success('Payment successful! Booking confirmed.');
            
            // Update state to CONFIRMED
            setBookings(prev =>
              prev.map(item =>
                item.bookingId === booking.bookingId
                  ? { ...item, bookingStatus: 'CONFIRMED' }
                  : item
              )
            );
            navigate('/consumer/payment-status', {
              state: { success: true, bookingId: booking.bookingId },
            });
          } catch (err) {
            toast.error('Payment verification failed: ' + getErrorMessage(err));
            navigate('/consumer/payment-status', {
              state: { success: false, bookingId: booking.bookingId },
            });
          }
        },
        prefill: {},
        theme: { color: '#6C63FF' },
        modal: {
          ondismiss: () => {
            toast('Payment cancelled. You can retry payment anytime from My Bookings.', { icon: 'ℹ️' });
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setPayingId(null);
    }
  };

  const canCancel = (status) => status === 'PENDING_PAYMENT' || status === 'CONFIRMED';

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>My Bookings</Typography>
      {loading ? (
        Array(4).fill(0).map((_, i) => <Skeleton key={i} variant="rounded" height={80} sx={{ mb: 2, borderRadius: 2 }} />)
      ) : bookings.length === 0 ? (
        <EmptyState title="No bookings yet" description="Search for a service and book your first appointment!" icon={BookmarkRoundedIcon} actionLabel="Search Services" onAction={() => navigate('/consumer/search')} />
      ) : (
        bookings.map((b, i) => (
          <motion.div key={b.bookingId} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Accordion onChange={(_, expanded) => expanded && fetchPayment(b.bookingId)} sx={{ mb: 1.5, borderRadius: '12px !important', '&:before': { display: 'none' }, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', pr: 1, flexWrap: 'wrap', gap: 1 }}>
                  <Box>
                    <Typography fontWeight={600}>{b.serviceName}</Typography>
                    <Typography variant="caption" color="text.secondary">{b.providerName} • {formatDate(b.serviceDate)} at {formatTime(b.serviceTime)}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <Typography fontWeight={700} color="primary.main">{formatCurrency(b.totalAmount)}</Typography>
                    <BookingStatusChip status={b.bookingStatus} />
                  </Box>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" color="text.secondary">Service Address</Typography>
                    <Typography variant="body2">{b.serviceAddress}</Typography>
                  </Grid>
                  {b.specialInstructions && (
                    <Grid item xs={12} sm={6}>
                      <Typography variant="caption" color="text.secondary">Special Instructions</Typography>
                      <Typography variant="body2">{b.specialInstructions}</Typography>
                    </Grid>
                  )}
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" color="text.secondary">Payment Status</Typography>
                    <Box sx={{ mt: 0.5 }}>
                      {payments[b.bookingId] === undefined ? (
                        <Skeleton variant="text" width={80} />
                      ) : payments[b.bookingId] ? (
                        <PaymentStatusChip status={payments[b.bookingId].paymentStatus} />
                      ) : (
                        <Typography variant="body2" color="text.secondary">—</Typography>
                      )}
                    </Box>
                  </Grid>
                </Grid>
                <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                  {canCancel(b.bookingStatus) && (
                    <Button variant="outlined" color="error" size="small" startIcon={<CancelRoundedIcon />} onClick={() => setCancelId(b.bookingId)}>
                      Cancel
                    </Button>
                  )}
                  {b.bookingStatus === 'PENDING_PAYMENT' && (
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={payingId === b.bookingId ? <CircularProgress size={16} color="inherit" /> : <PaymentRoundedIcon />}
                      onClick={() => handlePayNow(b)}
                      disabled={payingId === b.bookingId}
                    >
                      {payingId === b.bookingId ? 'Opening Payment...' : 'Pay Now'}
                    </Button>
                  )}
                </Box>
              </AccordionDetails>
            </Accordion>
          </motion.div>
        ))
      )}
      <ConfirmDialog
        open={Boolean(cancelId)}
        title="Cancel Booking?"
        message="Are you sure you want to cancel this booking?"
        onConfirm={handleCancel}
        onCancel={() => setCancelId(null)}
        loading={cancelling}
        confirmText="Yes, Cancel"
      />
    </Box>
  );
};

export default MyBookings;
