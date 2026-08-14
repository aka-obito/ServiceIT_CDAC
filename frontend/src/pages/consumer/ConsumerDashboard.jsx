import React, { useEffect, useState } from 'react';
import {
  Box, Grid, Card, CardContent, Typography, Button, Skeleton,
  Avatar, LinearProgress, Chip,
} from '@mui/material';
import BookmarkRoundedIcon from '@mui/icons-material/BookmarkRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { getMyConsumerProfile } from '../../services/consumerService';
import { getMyBookings } from '../../services/bookingService';
import { formatDate, getErrorMessage } from '../../utils/formatters';
import { BookingStatusChip } from '../../components/common/StatusChips';
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

const ConsumerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, bookingsRes] = await Promise.allSettled([
          getMyConsumerProfile(),
          getMyBookings(),
        ]);
        if (profileRes.status === 'fulfilled') setProfile(profileRes.value.data);
        if (bookingsRes.status === 'fulfilled') setBookings(bookingsRes.value.data);
      } catch (err) {
        toast.error(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const stats = [
    { icon: BookmarkRoundedIcon, label: 'Total Bookings', value: bookings.length, color: '#6C63FF', delay: 0.1 },
    { icon: TrendingUpRoundedIcon, label: 'Confirmed', value: bookings.filter(b => b.bookingStatus === 'CONFIRMED').length, color: '#43E97B', delay: 0.2 },
    { icon: TrendingUpRoundedIcon, label: 'Completed', value: bookings.filter(b => b.bookingStatus === 'COMPLETED').length, color: '#FF6584', delay: 0.3 },
    { icon: TrendingUpRoundedIcon, label: 'Pending Payment', value: bookings.filter(b => b.bookingStatus === 'PENDING_PAYMENT').length, color: '#FFA726', delay: 0.4 },
  ];

  const profileComplete = profile ? 100 : 30;

  return (
    <Box>
      {/* Welcome */}
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
        <Box sx={{ mb: 4, p: 3, borderRadius: 3, background: 'linear-gradient(135deg, #6C63FF, #FF6584)', color: '#fff' }}>
          <Typography variant="h4" fontWeight={800}>Welcome back, {user?.fullName?.split(' ')[0]}! 👋</Typography>
          <Typography sx={{ mt: 0.5, opacity: 0.85 }}>What service can we help you with today?</Typography>
          <Button variant="contained" sx={{ mt: 2, bgcolor: '#fff', color: '#6C63FF', '&:hover': { bgcolor: '#f0f0ff' } }} startIcon={<SearchRoundedIcon />} onClick={() => navigate('/consumer/search')}>
            Search Services
          </Button>
        </Box>
      </motion.div>

      {/* Profile Completion */}
      {!profile && !loading && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Card sx={{ mb: 3, border: '2px dashed', borderColor: 'warning.main' }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
              <Box>
                <Typography fontWeight={600}>Complete Your Profile</Typography>
                <Typography variant="body2" color="text.secondary">Add your address details to start booking services.</Typography>
              </Box>
              <Button variant="contained" color="warning" onClick={() => navigate('/consumer/profile')} startIcon={<PersonRoundedIcon />}>
                Create Profile
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Stats */}
      <Grid container spacing={2.5} sx={{ mb: 4 }}>
        {loading
          ? Array(4).fill(0).map((_, i) => (<Grid item xs={12} sm={6} md={3} key={i}><Skeleton variant="rounded" height={90} sx={{ borderRadius: 2 }} /></Grid>))
          : stats.map((s) => (<Grid item xs={12} sm={6} md={3} key={s.label}><StatCard {...s} /></Grid>))
        }
      </Grid>

      {/* Quick Actions */}
      <Grid container spacing={2.5} sx={{ mb: 4 }}>
        {[
          { label: 'Search Services', desc: 'Find and book local services', icon: SearchRoundedIcon, path: '/consumer/search', color: '#6C63FF' },
          { label: 'My Bookings', desc: 'View all your bookings', icon: BookmarkRoundedIcon, path: '/consumer/bookings', color: '#FF6584' },
          { label: 'My Profile', desc: 'Manage your account', icon: PersonRoundedIcon, path: '/consumer/profile', color: '#43E97B' },
        ].map((action, i) => (
          <Grid item xs={12} sm={4} key={action.label}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.1 }}>
              <Card onClick={() => navigate(action.path)} sx={{ cursor: 'pointer', p: 1 }}>
                <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ width: 48, height: 48, borderRadius: 2, bgcolor: `${action.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <action.icon sx={{ color: action.color }} />
                  </Box>
                  <Box>
                    <Typography fontWeight={600} variant="body1">{action.label}</Typography>
                    <Typography variant="caption" color="text.secondary">{action.desc}</Typography>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      {/* Recent Bookings */}
      <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Recent Bookings</Typography>
      {loading ? (
        Array(3).fill(0).map((_, i) => <Skeleton key={i} variant="rounded" height={64} sx={{ mb: 1.5, borderRadius: 2 }} />)
      ) : bookings.length === 0 ? (
        <EmptyState title="No bookings yet" description="Search for a service and make your first booking!" actionLabel="Find Services" onAction={() => navigate('/consumer/search')} icon={BookmarkRoundedIcon} />
      ) : (
        bookings.slice(0, 5).map((b) => (
          <Card key={b.bookingId} sx={{ mb: 1.5 }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1, py: '12px !important' }}>
              <Box>
                <Typography fontWeight={600}>{b.serviceName}</Typography>
                <Typography variant="caption" color="text.secondary">{b.providerName} • {formatDate(b.serviceDate)}</Typography>
              </Box>
              <BookingStatusChip status={b.bookingStatus} />
            </CardContent>
          </Card>
        ))
      )}
    </Box>
  );
};

export default ConsumerDashboard;
