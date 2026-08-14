import React, { useEffect, useState } from 'react';
import {
  Box, Grid, Card, CardContent, Typography, Button, Skeleton, Chip,
} from '@mui/material';
import MiscellaneousServicesRoundedIcon from '@mui/icons-material/MiscellaneousServicesRounded';
import BookmarkRoundedIcon from '@mui/icons-material/BookmarkRounded';
import AttachMoneyRoundedIcon from '@mui/icons-material/AttachMoneyRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import HourglassEmptyRoundedIcon from '@mui/icons-material/HourglassEmptyRounded';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { getMyProviderProfile } from '../../services/providerService';
import { getMyProviderServices } from '../../services/providerServiceService';
import { getProviderBookings } from '../../services/bookingService';
import { formatCurrency, getErrorMessage } from '../../utils/formatters';
import { BookingStatusChip } from '../../components/common/StatusChips';
import { formatDate, formatTime } from '../../utils/formatters';
import EmptyState from '../../components/common/EmptyState';

const StatCard = ({ icon: Icon, label, value, color, delay }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}>
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 3 }}>
        <Box sx={{ width: 52, height: 52, borderRadius: 2.5, bgcolor: `${color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon sx={{ color, fontSize: 26 }} />
        </Box>
        <Box>
          <Typography variant="h4" fontWeight={800}>{value}</Typography>
          <Typography variant="body2" color="text.secondary">{label}</Typography>
        </Box>
      </CardContent>
    </Card>
  </motion.div>
);

const ProviderDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [services, setServices] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, svcRes, bkRes] = await Promise.allSettled([
          getMyProviderProfile(),
          getMyProviderServices(),
          getProviderBookings(),
        ]);
        if (profileRes.status === 'fulfilled') setProfile(profileRes.value.data);
        if (svcRes.status === 'fulfilled') setServices(svcRes.value.data);
        if (bkRes.status === 'fulfilled') setBookings(bkRes.value.data);
      } catch (err) {
        toast.error(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Include both CONFIRMED (paid) and COMPLETED bookings in total earnings
  const earnings = bookings
    .filter(b => b.bookingStatus === 'CONFIRMED' || b.bookingStatus === 'COMPLETED')
    .reduce((sum, b) => sum + Number(b.totalAmount || 0), 0);

  const stats = [
    { icon: MiscellaneousServicesRoundedIcon, label: 'Total Services', value: services.length, color: '#6C63FF', delay: 0.1 },
    { icon: CheckCircleRoundedIcon, label: 'Active Services', value: services.filter(s => s.available).length, color: '#43E97B', delay: 0.2 },
    { icon: BookmarkRoundedIcon, label: 'Total Bookings', value: bookings.length, color: '#FF6584', delay: 0.3 },
    { icon: HourglassEmptyRoundedIcon, label: 'Pending Payment', value: bookings.filter(b => b.bookingStatus === 'PENDING_PAYMENT').length, color: '#FFA726', delay: 0.4 },
  ];

  return (
    <Box>
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
        <Box sx={{ mb: 4, p: 3, borderRadius: 3, background: 'linear-gradient(135deg, #FF6584, #6C63FF)', color: '#fff' }}>
          <Typography variant="h4" fontWeight={800}>Welcome, {user?.fullName?.split(' ')[0]}! 🙌</Typography>
          <Typography sx={{ mt: 0.5, opacity: 0.85 }}>{profile?.businessName || 'Set up your business profile'}</Typography>
          {!profile && (
            <Button variant="contained" sx={{ mt: 2, bgcolor: '#fff', color: '#6C63FF', '&:hover': { bgcolor: '#f0f0ff' } }} onClick={() => navigate('/provider/profile')}>
              Create Profile
            </Button>
          )}
        </Box>
      </motion.div>

      <Grid container spacing={2.5} sx={{ mb: 4 }}>
        {loading
          ? Array(4).fill(0).map((_, i) => (<Grid item xs={12} sm={6} md={3} key={i}><Skeleton variant="rounded" height={90} sx={{ borderRadius: 2 }} /></Grid>))
          : stats.map(s => (<Grid item xs={12} sm={6} md={3} key={s.label}><StatCard {...s} /></Grid>))
        }
      </Grid>

      {/* Earnings Card */}
      {!loading && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
          <Card sx={{ mb: 4, background: 'linear-gradient(135deg, #6C63FF15, #FF658415)', border: '1px solid', borderColor: 'primary.light' }}>
            <CardContent sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ width: 52, height: 52, borderRadius: 2.5, bgcolor: '#6C63FF20', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <AttachMoneyRoundedIcon sx={{ color: '#6C63FF', fontSize: 28 }} />
              </Box>
              <Box>
                <Typography variant="h4" fontWeight={800} color="primary.main">{formatCurrency(earnings)}</Typography>
                <Typography variant="body2" color="text.secondary">Total Earnings (Confirmed & Paid Bookings)</Typography>
              </Box>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Recent Bookings */}
      <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Recent Bookings</Typography>
      {loading ? (
        Array(3).fill(0).map((_, i) => <Skeleton key={i} variant="rounded" height={64} sx={{ mb: 1.5, borderRadius: 2 }} />)
      ) : bookings.length === 0 ? (
        <EmptyState title="No bookings received yet" description="Once consumers book your services, they will appear here." icon={BookmarkRoundedIcon} />
      ) : (
        bookings.slice(0, 5).map((b, i) => (
          <motion.div key={b.bookingId} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
            <Card sx={{ mb: 1.5 }}>
              <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1, py: '12px !important' }}>
                <Box>
                  <Typography fontWeight={600}>{b.serviceName}</Typography>
                  <Typography variant="caption" color="text.secondary">{b.consumerName} • {formatDate(b.serviceDate)} at {formatTime(b.serviceTime)}</Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <Typography fontWeight={700} color="primary.main">{formatCurrency(b.totalAmount)}</Typography>
                  <BookingStatusChip status={b.bookingStatus} />
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        ))
      )}
    </Box>
  );
};

export default ProviderDashboard;
