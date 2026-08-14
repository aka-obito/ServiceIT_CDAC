import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Card, CardContent, Skeleton, Grid, Divider,
  Accordion, AccordionSummary, AccordionDetails, Button, CircularProgress, Tooltip,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import BookmarkRoundedIcon from '@mui/icons-material/BookmarkRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import LockClockRoundedIcon from '@mui/icons-material/LockClockRounded';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { getProviderBookings, completeBooking } from '../../services/bookingService';
import { getPaymentByBookingId } from '../../services/paymentService';
import { formatDate, formatTime, formatCurrency, getErrorMessage } from '../../utils/formatters';
import { BookingStatusChip, PaymentStatusChip } from '../../components/common/StatusChips';
import EmptyState from '../../components/common/EmptyState';

const ProviderBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [payments, setPayments] = useState({});
  const [completingId, setCompletingId] = useState(null);

  useEffect(() => {
    getProviderBookings()
      .then(res => setBookings(res.data))
      .catch(err => toast.error(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  const fetchPayment = async (bookingId) => {
    if (payments[bookingId] !== undefined) return;
    try {
      const res = await getPaymentByBookingId(bookingId);
      setPayments(prev => ({ ...prev, [bookingId]: res.data }));
    } catch { setPayments(prev => ({ ...prev, [bookingId]: null })); }
  };

  const handleComplete = async (bookingId) => {
    setCompletingId(bookingId);
    try {
      const res = await completeBooking(bookingId);
      setBookings(prev => prev.map(b => b.bookingId === bookingId ? res.data : b));
      toast.success('Service marked as COMPLETED! 🎉');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setCompletingId(null);
    }
  };

  // Helper to check if scheduled date and time has passed
  const isScheduledTimePassed = (serviceDate, serviceTime) => {
    if (!serviceDate) return true;
    const timeStr = serviceTime || '00:00:00';
    const scheduled = new Date(`${serviceDate}T${timeStr}`);
    return new Date() >= scheduled;
  };

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>Received Bookings</Typography>
      {loading ? (
        Array(4).fill(0).map((_, i) => <Skeleton key={i} variant="rounded" height={80} sx={{ mb: 2, borderRadius: 2 }} />)
      ) : bookings.length === 0 ? (
        <EmptyState title="No bookings yet" description="Once consumers book your services, they will appear here." icon={BookmarkRoundedIcon} />
      ) : (
        bookings.map((b, i) => {
          const canCompleteNow = isScheduledTimePassed(b.serviceDate, b.serviceTime);

          return (
            <motion.div key={b.bookingId} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Accordion onChange={(_, expanded) => expanded && fetchPayment(b.bookingId)} sx={{ mb: 1.5, borderRadius: '12px !important', '&:before': { display: 'none' }, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', pr: 1, flexWrap: 'wrap', gap: 1 }}>
                    <Box>
                      <Typography fontWeight={600}>{b.serviceName}</Typography>
                      <Typography variant="caption" color="text.secondary">{b.consumerName} • {formatDate(b.serviceDate)} at {formatTime(b.serviceTime)}</Typography>
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
                    <Grid item xs={12} sm={4}>
                      <Typography variant="caption" color="text.secondary">Payment Status</Typography>
                      <Box sx={{ mt: 0.5 }}>
                        {payments[b.bookingId] === undefined ? <Skeleton variant="text" width={80} /> : payments[b.bookingId] ? <PaymentStatusChip status={payments[b.bookingId].paymentStatus} /> : <Typography variant="body2" color="text.secondary">—</Typography>}
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Typography variant="caption" color="text.secondary">Amount</Typography>
                      <Typography variant="body2" fontWeight={700}>{formatCurrency(b.totalAmount)}</Typography>
                    </Grid>
                  </Grid>

                  {b.bookingStatus === 'CONFIRMED' && (
                    <Box sx={{ mt: 2.5, display: 'flex', justifyContent: 'flex-end' }}>
                      {canCompleteNow ? (
                        <Button
                          variant="contained"
                          color="success"
                          size="small"
                          startIcon={completingId === b.bookingId ? <CircularProgress size={16} color="inherit" /> : <CheckCircleRoundedIcon />}
                          onClick={() => handleComplete(b.bookingId)}
                          disabled={completingId === b.bookingId}
                        >
                          {completingId === b.bookingId ? 'Updating...' : 'Mark Service Completed'}
                        </Button>
                      ) : (
                        <Tooltip title={`Service can only be marked completed after scheduled appointment (${formatDate(b.serviceDate)} at ${formatTime(b.serviceTime)})`}>
                          <span>
                            <Button
                              variant="outlined"
                              color="warning"
                              size="small"
                              disabled
                              startIcon={<LockClockRoundedIcon />}
                            >
                              Locked Until {formatDate(b.serviceDate)} {formatTime(b.serviceTime)}
                            </Button>
                          </span>
                        </Tooltip>
                      )}
                    </Box>
                  )}
                </AccordionDetails>
              </Accordion>
            </motion.div>
          );
        })
      )}
    </Box>
  );
};

export default ProviderBookings;
