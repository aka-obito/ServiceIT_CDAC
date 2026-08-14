import React, { useEffect, useState } from 'react';
import {
  Box, Card, CardContent, Typography, TextField, Button, Grid,
  Divider, CircularProgress, Skeleton, Alert, Chip, Paper, Avatar,
  Stack,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded';
import SecurityRoundedIcon from '@mui/icons-material/SecurityRounded';
import VerifiedRoundedIcon from '@mui/icons-material/VerifiedRounded';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import LockRoundedIcon from '@mui/icons-material/LockRounded';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import WbSunnyRoundedIcon from '@mui/icons-material/WbSunnyRounded';
import NightsStayRoundedIcon from '@mui/icons-material/NightsStayRounded';
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';

import { bookingSchema } from '../../utils/validators';
import { getProviderServiceById } from '../../services/providerServiceService';
import { getMyConsumerProfile } from '../../services/consumerService';
import { createBooking } from '../../services/bookingService';
import { createRazorpayOrder, verifyPayment } from '../../services/paymentService';
import { formatCurrency, formatDuration, getErrorMessage, getInitials } from '../../utils/formatters';

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

const TIME_SLOTS = [
  { label: 'Morning', time: '09:00', icon: <WbSunnyRoundedIcon sx={{ fontSize: 15 }} /> },
  { label: 'Afternoon', time: '13:30', icon: <LightModeRoundedIcon sx={{ fontSize: 15 }} /> },
  { label: 'Evening', time: '17:00', icon: <NightsStayRoundedIcon sx={{ fontSize: 15 }} /> },
];

const BookingPage = () => {
  const { providerServiceId } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [consumerProfile, setConsumerProfile] = useState(null);
  const [loadingService, setLoadingService] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const { control, handleSubmit, setValue, formState: { errors } } = useForm({
    resolver: yupResolver(bookingSchema),
    defaultValues: { serviceDate: '', serviceTime: '', serviceAddress: '', specialInstructions: '' },
  });

  useEffect(() => {
    Promise.allSettled([
      getProviderServiceById(providerServiceId),
      getMyConsumerProfile(),
    ]).then(([serviceRes, profileRes]) => {
      if (serviceRes.status === 'fulfilled') {
        setService(serviceRes.value.data);
      } else {
        toast.error('Service not found.');
      }

      if (profileRes.status === 'fulfilled' && profileRes.value.data) {
        const p = profileRes.value.data;
        setConsumerProfile(p);
        // Pre-fill address if available in profile
        if (p.address) {
          const fullAddr = [p.address, p.city, p.state, p.pincode].filter(Boolean).join(', ');
          setValue('serviceAddress', fullAddr);
        }
      }
    }).finally(() => setLoadingService(false));
  }, [providerServiceId, setValue]);

  const handleUseSavedAddress = () => {
    if (consumerProfile && consumerProfile.address) {
      const fullAddr = [consumerProfile.address, consumerProfile.city, consumerProfile.state, consumerProfile.pincode].filter(Boolean).join(', ');
      setValue('serviceAddress', fullAddr, { shouldValidate: true });
      toast.success('Saved profile address applied!');
    }
  };

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      // Step 1: Create Booking
      const formattedTime = data.serviceTime?.length === 5 ? data.serviceTime + ':00' : data.serviceTime;
      const bookingPayload = {
        providerServiceId: Number(providerServiceId),
        serviceDate: data.serviceDate,
        serviceTime: formattedTime,
        serviceAddress: data.serviceAddress,
        specialInstructions: data.specialInstructions || '',
      };
      const bookingRes = await createBooking(bookingPayload);
      const booking = bookingRes.data;

      // Step 2: Create Razorpay Order
      const orderRes = await createRazorpayOrder(booking.bookingId);
      const order = orderRes.data;

      // Step 3: Load Razorpay & Open Checkout
      const loaded = await loadRazorpay();
      if (!loaded) {
        toast.error('Payment gateway failed to load. Please try again.');
        setSubmitting(false);
        return;
      }

      const options = {
        key: order.razorpayKeyId || order.razorpayKey,
        amount: Math.round(Number(order.amount) * 100), // in paise
        currency: order.currency || 'INR',
        name: 'SERVICEiT',
        description: `Booking for ${service.serviceName}`,
        order_id: order.razorpayOrderId || order.orderId,
        handler: async (response) => {
          try {
            // Step 4: Verify Payment
            const verifyPayload = {
              bookingId: booking.bookingId,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            };
            await verifyPayment(verifyPayload);
            toast.success('Payment successful! Booking confirmed.');
            navigate('/consumer/payment-status', { state: { success: true, bookingId: booking.bookingId } });
          } catch (err) {
            toast.error('Payment verification failed: ' + getErrorMessage(err));
            navigate('/consumer/payment-status', { state: { success: false, bookingId: booking.bookingId } });
          }
        },
        prefill: {},
        theme: { color: '#6C63FF' },
        modal: {
          ondismiss: () => {
            toast('Payment cancelled. Your booking is saved in My Bookings.', { icon: 'ℹ️' });
            navigate('/consumer/bookings');
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingService) {
    return (
      <Box sx={{ maxWidth: 1100, mx: 'auto', p: 3 }}>
        <Skeleton variant="rounded" height={60} sx={{ mb: 3, borderRadius: 3 }} />
        <Grid container spacing={3.5}>
          <Grid item xs={12} md={6.5}><Skeleton variant="rounded" height={450} sx={{ borderRadius: 4 }} /></Grid>
          <Grid item xs={12} md={5.5}><Skeleton variant="rounded" height={450} sx={{ borderRadius: 4 }} /></Grid>
        </Grid>
      </Box>
    );
  }

  if (!service) return <Alert severity="error">Service not found.</Alert>;

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
      <Box sx={{ maxWidth: 1150, mx: 'auto', pb: 4 }}>
        
        {/* Navigation & Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3.5, flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<ArrowBackRoundedIcon />}
              onClick={() => navigate(-1)}
              sx={{
                borderRadius: 3,
                textTransform: 'none',
                fontWeight: 600,
                px: 2,
                py: 0.8,
                borderColor: 'divider',
                bgcolor: 'background.paper',
                '&:hover': { bgcolor: 'action.hover' },
              }}
            >
              Back
            </Button>
            <Box>
              <Typography variant="h5" fontWeight={800} sx={{ letterSpacing: -0.5 }}>
                Book Appointment
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Select your convenient appointment schedule and address
              </Typography>
            </Box>
          </Box>

          {/* Stepper Indicator */}
          <Stack direction="row" spacing={1} alignItems="center">
            <Chip
              label="1. Schedule"
              color="primary"
              size="small"
              sx={{ fontWeight: 700, borderRadius: 2, px: 0.5 }}
            />
            <Typography variant="caption" color="text.secondary">→</Typography>
            <Chip
              label="2. Address"
              color="primary"
              size="small"
              sx={{ fontWeight: 700, borderRadius: 2, px: 0.5 }}
            />
            <Typography variant="caption" color="text.secondary">→</Typography>
            <Chip
              label="3. Payment"
              variant="outlined"
              size="small"
              sx={{ color: 'text.secondary', borderRadius: 2, px: 0.5 }}
            />
          </Stack>
        </Box>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          {/* TWO COLUMNS: Details on Left, Summary on Right */}
          <Grid container spacing={3.5} alignItems="stretch">
            
            {/* LEFT COLUMN: Schedule & Address Form */}
            <Grid item xs={12} md={6.5}>
              <Stack spacing={3} sx={{ height: '100%' }}>
                
                {/* 1. Schedule Selection Card */}
                <Card
                  sx={{
                    borderRadius: 4,
                    border: '1px solid',
                    borderColor: 'divider',
                    boxShadow: '0 6px 25px rgba(0,0,0,0.04)',
                    overflow: 'hidden',
                  }}
                >
                  <Box sx={{ p: 3, pb: 0 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
                      <Box
                        sx={{
                          width: 32, height: 32, borderRadius: 2,
                          bgcolor: 'primary.main', color: '#fff',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}
                      >
                        <CalendarMonthRoundedIcon sx={{ fontSize: 18 }} />
                      </Box>
                      <Typography variant="h6" fontWeight={700} fontSize={17}>
                        Select Date & Arrival Time
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 5.5, mb: 2 }}>
                      Choose when the service expert should arrive
                    </Typography>
                  </Box>

                  <CardContent sx={{ p: 3, pt: 0 }}>
                    <Grid container spacing={2.5}>
                      <Grid item xs={12} sm={6}>
                        <Controller
                          name="serviceDate"
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              label="Service Date"
                              type="date"
                              fullWidth
                              InputLabelProps={{ shrink: true }}
                              inputProps={{ min: new Date().toISOString().split('T')[0] }}
                              error={!!errors.serviceDate}
                              helperText={errors.serviceDate?.message || 'Pick appointment date'}
                              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2.5 } }}
                            />
                          )}
                        />
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <Controller
                          name="serviceTime"
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              label="Arrival Time"
                              type="time"
                              fullWidth
                              InputLabelProps={{ shrink: true }}
                              inputProps={{ min: '08:00', max: '22:00' }}
                              error={!!errors.serviceTime}
                              helperText={errors.serviceTime?.message || 'Between 08:00 AM & 10:00 PM'}
                              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2.5 } }}
                            />
                          )}
                        />
                      </Grid>
                    </Grid>

                    {/* Preset Slot Chips */}
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ mb: 1, display: 'block' }}>
                        Quick Select Slot:
                      </Typography>
                      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                        {TIME_SLOTS.map((slot) => (
                          <Chip
                            key={slot.time}
                            icon={slot.icon}
                            label={`${slot.label} (${slot.time})`}
                            onClick={() => setValue('serviceTime', slot.time, { shouldValidate: true })}
                            clickable
                            size="small"
                            variant="outlined"
                            sx={{
                              borderRadius: 2,
                              py: 1.75,
                              px: 0.5,
                              fontWeight: 600,
                              borderColor: 'divider',
                              '&:hover': { bgcolor: 'primary.50', borderColor: 'primary.main' },
                            }}
                          />
                        ))}
                      </Stack>
                    </Box>

                    {/* Operating hours note */}
                    <Box
                      sx={{
                        mt: 2.5, p: 1.75, borderRadius: 2.5,
                        bgcolor: 'rgba(108, 99, 255, 0.05)',
                        border: '1px solid rgba(108, 99, 255, 0.15)',
                        display: 'flex', alignItems: 'flex-start', gap: 1.5,
                      }}
                    >
                      <InfoOutlinedIcon fontSize="small" color="primary" sx={{ mt: 0.2 }} />
                      <Box>
                        <Typography variant="body2" fontWeight={700} color="text.primary">
                          Service Hours: 08:00 AM – 10:00 PM
                        </Typography>
                        <Typography variant="caption" color="text.secondary" display="block">
                          Estimated duration is ~{service.estimatedDuration || 60} mins. A 1-hour buffer is reserved for the provider to guarantee prompt delivery.
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>

                {/* 2. Service Address Card */}
                <Card
                  sx={{
                    borderRadius: 4,
                    border: '1px solid',
                    borderColor: 'divider',
                    boxShadow: '0 6px 25px rgba(0,0,0,0.04)',
                    overflow: 'hidden',
                  }}
                >
                  <Box sx={{ p: 3, pb: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 1 }}>
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
                        <Box
                          sx={{
                            width: 32, height: 32, borderRadius: 2,
                            bgcolor: 'primary.main', color: '#fff',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}
                        >
                          <LocationOnRoundedIcon sx={{ fontSize: 18 }} />
                        </Box>
                        <Typography variant="h6" fontWeight={700} fontSize={17}>
                          Service Address & Landmark
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ ml: 5.5 }}>
                        Where should the professional arrive?
                      </Typography>
                    </Box>

                    {consumerProfile?.address && (
                      <Button
                        size="small"
                        startIcon={<HomeRoundedIcon />}
                        onClick={handleUseSavedAddress}
                        sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2 }}
                      >
                        Use Saved Address
                      </Button>
                    )}
                  </Box>

                  <CardContent sx={{ p: 3 }}>
                    <Stack spacing={2.5}>
                      <Controller
                        name="serviceAddress"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Complete Service Address"
                            placeholder="Flat/House No., Building Name, Street, Landmark, City & Pincode"
                            fullWidth
                            multiline
                            rows={3}
                            error={!!errors.serviceAddress}
                            helperText={errors.serviceAddress?.message || 'Detailed address for smooth navigation'}
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2.5 } }}
                          />
                        )}
                      />

                      <Controller
                        name="specialInstructions"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Special Notes or Instructions (Optional)"
                            placeholder="e.g. Call before reaching, doorbell on the right, flat on 3rd floor..."
                            fullWidth
                            multiline
                            rows={2}
                            error={!!errors.specialInstructions}
                            helperText={errors.specialInstructions?.message}
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2.5 } }}
                          />
                        )}
                      />
                    </Stack>
                  </CardContent>
                </Card>

              </Stack>
            </Grid>

            {/* RIGHT COLUMN: Booking Summary Card */}
            <Grid item xs={12} md={5.5}>
              <Card
                sx={{
                  borderRadius: 4,
                  border: '1px solid',
                  borderColor: 'divider',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.05)',
                  overflow: 'hidden',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {/* Gradient Summary Header */}
                <Box
                  sx={{
                    p: 3,
                    background: 'linear-gradient(135deg, #6C63FF, #FF6584)',
                    color: '#fff',
                  }}
                >
                  <Typography variant="overline" sx={{ letterSpacing: 1.5, opacity: 0.9, fontWeight: 700 }}>
                    BOOKING SUMMARY
                  </Typography>
                  <Typography variant="h5" fontWeight={800} sx={{ mt: 0.5, lineHeight: 1.2 }}>
                    {service.serviceName}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                    <Typography variant="body2" sx={{ opacity: 0.95, fontWeight: 600 }}>
                      by {service.providerName}
                    </Typography>
                    <VerifiedRoundedIcon sx={{ fontSize: 16, color: '#fff' }} />
                  </Box>
                </Box>

                <CardContent sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  
                  {/* Highlights */}
                  <Stack direction="row" spacing={1.5} sx={{ mb: 2.5 }} flexWrap="wrap">
                    <Chip
                      icon={<AccessTimeRoundedIcon fontSize="small" />}
                      label={`~${formatDuration(service.estimatedDuration)}`}
                      size="small"
                      sx={{ fontWeight: 700, borderRadius: 2, bgcolor: 'action.hover' }}
                    />
                    <Chip
                      icon={<VerifiedRoundedIcon sx={{ fontSize: 16, color: 'success.main' }} />}
                      label="Verified Provider"
                      color="success"
                      variant="outlined"
                      size="small"
                      sx={{ fontWeight: 700, borderRadius: 2 }}
                    />
                  </Stack>

                  {service.description && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        p: 2, mb: 3, borderRadius: 2.5,
                        bgcolor: 'action.hover', fontSize: 13, lineHeight: 1.6,
                      }}
                    >
                      {service.description}
                    </Typography>
                  )}

                  <Divider sx={{ mb: 2.5 }} />

                  {/* Pricing Breakdown Table */}
                  <Typography variant="caption" fontWeight={800} color="text.secondary" sx={{ letterSpacing: 0.8, display: 'block', mb: 2 }}>
                    PRICE DETAILS
                  </Typography>

                  <Stack spacing={1.5} sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" color="text.secondary">Item Service Price</Typography>
                      <Typography variant="body2" fontWeight={600}>{formatCurrency(service.price)}</Typography>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" color="text.secondary">Platform & Booking Fee</Typography>
                      <Typography variant="body2" color="success.main" fontWeight={700}>FREE</Typography>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" color="text.secondary">Taxes & Charges</Typography>
                      <Typography variant="body2" color="text.secondary">Included</Typography>
                    </Box>
                  </Stack>

                  <Divider sx={{ my: 2 }} />

                  {/* Total Payable */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', mb: 3 }}>
                    <Typography variant="subtitle1" fontWeight={800}>
                      Total Amount
                    </Typography>
                    <Typography variant="h4" fontWeight={900} color="primary.main">
                      {formatCurrency(service.price)}
                    </Typography>
                  </Box>

                  {/* Trust & Guarantee Badges */}
                  <Paper
                    elevation={0}
                    sx={{
                      mt: 'auto',
                      p: 2, borderRadius: 3,
                      bgcolor: 'action.hover', border: '1px solid', borderColor: 'divider',
                    }}
                  >
                    <Stack spacing={1.2}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CheckCircleRoundedIcon color="success" sx={{ fontSize: 18 }} />
                        <Typography variant="caption" fontWeight={600} color="text.primary">
                          100% Safe & Encrypted Razorpay Checkout
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CheckCircleRoundedIcon color="success" sx={{ fontSize: 18 }} />
                        <Typography variant="caption" fontWeight={600} color="text.primary">
                          Instant Appointment Confirmation & Receipt
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CheckCircleRoundedIcon color="success" sx={{ fontSize: 18 }} />
                        <Typography variant="caption" fontWeight={600} color="text.primary">
                          Verified & Background-Checked Professional
                        </Typography>
                      </Box>
                    </Stack>
                  </Paper>

                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* BOTTOM: Center-Aligned Proceed to Pay Action */}
          <Box sx={{ mt: 5, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={submitting}
              sx={{
                width: { xs: '100%', sm: 440 },
                py: 2,
                fontSize: 17,
                fontWeight: 800,
                borderRadius: 3.5,
                background: 'linear-gradient(135deg, #6C63FF, #FF6584)',
                boxShadow: '0 10px 30px rgba(108, 99, 255, 0.35)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5B52E0, #E05572)',
                  boxShadow: '0 12px 35px rgba(108, 99, 255, 0.45)',
                },
              }}
              startIcon={submitting ? <CircularProgress size={22} color="inherit" /> : <LockRoundedIcon />}
            >
              {submitting ? 'Creating Order...' : `Proceed to Pay ${formatCurrency(service.price)}`}
            </Button>
            
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1.5, display: 'flex', alignItems: 'center', gap: 0.75 }}>
              <SecurityRoundedIcon sx={{ fontSize: 16, color: 'primary.main' }} />
              Guaranteed 256-bit SSL encrypted checkout powered by <strong>Razorpay</strong>
            </Typography>
          </Box>
        </form>

      </Box>
    </motion.div>
  );
};

export default BookingPage;
