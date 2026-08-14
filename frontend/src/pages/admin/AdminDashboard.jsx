import React, { useEffect, useState } from 'react';
import {
  Box, Grid, Card, CardContent, Typography, Skeleton, Button,
  Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Stack,
} from '@mui/material';
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import WorkRoundedIcon from '@mui/icons-material/WorkRounded';
import HourglassEmptyRoundedIcon from '@mui/icons-material/HourglassEmptyRounded';
import BookmarkRoundedIcon from '@mui/icons-material/BookmarkRounded';
import PaymentRoundedIcon from '@mui/icons-material/PaymentRounded';
import HistoryRoundedIcon from '@mui/icons-material/HistoryRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import DonutLargeRoundedIcon from '@mui/icons-material/DonutLargeRounded';
import 'chart.js/auto';
import { Doughnut } from 'react-chartjs-2';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

import {
  adminGetAllUsers,
  adminGetAllBookings,
  adminGetAllPayments,
  adminGetPendingProviders,
} from '../../services/adminService';
import { getRecentAuditLogs } from '../../services/auditLogService';
import { formatDate, formatTime, formatCurrency, getErrorMessage } from '../../utils/formatters';
import { useTheme } from '../../context/ThemeContext';

const StatCard = ({ icon: Icon, label, value, color, delay }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}>
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 3 }}>
        <Box
          sx={{
            width: 52,
            height: 52,
            borderRadius: 2.5,
            bgcolor: `${color}20`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon sx={{ color, fontSize: 26 }} />
        </Box>
        <Box>
          <Typography variant="h4" fontWeight={800}>
            {value ?? <Skeleton width={40} />}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {label}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  </motion.div>
);

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [payments, setPayments] = useState([]);
  const [pending, setPending] = useState([]);
  const [recentLogs, setRecentLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { mode } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    Promise.allSettled([
      adminGetAllUsers(),
      adminGetAllBookings(),
      adminGetAllPayments(),
      adminGetPendingProviders(),
      getRecentAuditLogs(),
    ])
      .then(([u, b, p, pend, logsRes]) => {
        if (u.status === 'fulfilled' && u.value?.data) setUsers(u.value.data);
        if (b.status === 'fulfilled' && b.value?.data) setBookings(b.value.data);
        if (p.status === 'fulfilled' && p.value?.data) setPayments(p.value.data);
        if (pend.status === 'fulfilled' && pend.value?.data) setPending(pend.value.data);
        if (logsRes.status === 'fulfilled' && logsRes.value?.data) setRecentLogs(logsRes.value.data.slice(0, 6));
      })
      .catch((err) => toast.error(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  const consumers = users.filter((u) => u.role === 'CONSUMER');
  const providers = users.filter((u) => u.role === 'PROVIDER');

  const completedPayments = payments.filter((p) => p.paymentStatus === 'SUCCESS' || p.paymentStatus === 'COMPLETED');
  const totalSuccessRevenue = completedPayments.reduce((sum, p) => sum + Number(p.amount || 0), 0);

  const chartTextColor = mode === 'dark' ? '#E8E8FF' : '#1A1A2E';

  // Enhanced Doughnut Chart Options
  const chartOpts = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: chartTextColor,
          padding: 16,
          usePointStyle: true,
          pointStyle: 'circle',
          font: { size: 13, weight: 600 },
        },
      },
      tooltip: {
        backgroundColor: mode === 'dark' ? '#1E1E38' : '#FFFFFF',
        titleColor: mode === 'dark' ? '#FFFFFF' : '#1A1A2E',
        bodyColor: mode === 'dark' ? '#E2E8F0' : '#475569',
        borderColor: mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        cornerRadius: 8,
      },
    },
  };

  const rolesData = {
    labels: ['Consumers', 'Providers'],
    datasets: [
      {
        data: [consumers.length || 0, providers.length || 0],
        backgroundColor: ['#6C63FF', '#FF6584'],
        borderWidth: 0,
        hoverOffset: 6,
      },
    ],
  };

  const bookingStatusData = {
    labels: ['Payment Pending', 'Confirmed', 'Completed', 'Cancelled'],
    datasets: [
      {
        data: [
          bookings.filter((b) => b.bookingStatus === 'PENDING_PAYMENT').length,
          bookings.filter((b) => b.bookingStatus === 'CONFIRMED').length,
          bookings.filter((b) => b.bookingStatus === 'COMPLETED').length,
          bookings.filter((b) => b.bookingStatus === 'CANCELLED').length,
        ],
        backgroundColor: ['#FFA726', '#42A5F5', '#10B981', '#EF4444'],
        borderWidth: 0,
        hoverOffset: 6,
      },
    ],
  };

  const stats = [
    { icon: PeopleRoundedIcon, label: 'Total Users', value: users.length, color: '#6C63FF', delay: 0.05 },
    { icon: PersonRoundedIcon, label: 'Consumers', value: consumers.length, color: '#43E97B', delay: 0.1 },
    { icon: WorkRoundedIcon, label: 'Providers', value: providers.length, color: '#FF6584', delay: 0.15 },
    { icon: HourglassEmptyRoundedIcon, label: 'Pending Providers', value: pending.length, color: '#FFA726', delay: 0.2 },
    { icon: BookmarkRoundedIcon, label: 'Bookings', value: bookings.length, color: '#42A5F5', delay: 0.25 },
    { icon: PaymentRoundedIcon, label: 'Total Revenue', value: formatCurrency(totalSuccessRevenue), color: '#10B981', delay: 0.3 },
  ];

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>
        Admin Dashboard
      </Typography>

      {/* KPI Cards */}
      <Grid container spacing={2.5} sx={{ mb: 4 }}>
        {loading
          ? Array(6)
              .fill(0)
              .map((_, i) => (
                <Grid item xs={12} sm={6} md={4} key={i}>
                  <Skeleton variant="rounded" height={90} sx={{ borderRadius: 2 }} />
                </Grid>
              ))
          : stats.map((s) => (
              <Grid item xs={12} sm={6} md={4} key={s.label}>
                <StatCard {...s} />
              </Grid>
            ))}
      </Grid>

      {/* Analytics Charts Grid - Perfectly Equal 50/50 Distribution */}
      <Grid container spacing={3} sx={{ mb: 4 }} alignItems="stretch">
        {/* Users by Role */}
        <Grid item xs={12} md={6} size={{ xs: 12, md: 6 }} sx={{ display: 'flex' }}>
          <Card
            sx={{
              p: { xs: 2.5, sm: 3.5 },
              borderRadius: 3.5,
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: (theme) =>
                theme.palette.mode === 'dark'
                  ? '0 8px 24px rgba(0,0,0,0.4)'
                  : '0 8px 24px rgba(108,99,255,0.06)',
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <DonutLargeRoundedIcon color="primary" />
                <Typography variant="h6" fontWeight={700}>
                  User Base Distribution
                </Typography>
              </Box>
              <Chip
                label={`${users.length} Users`}
                color="primary"
                variant="outlined"
                size="small"
                sx={{ fontWeight: 700, fontSize: 12 }}
              />
            </Box>

            <Box sx={{ height: 280, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
              {!loading && <Doughnut data={rolesData} options={chartOpts} />}
            </Box>
          </Card>
        </Grid>

        {/* Booking Status Lifecycle */}
        <Grid item xs={12} md={6} size={{ xs: 12, md: 6 }} sx={{ display: 'flex' }}>
          <Card
            sx={{
              p: { xs: 2.5, sm: 3.5 },
              borderRadius: 3.5,
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: (theme) =>
                theme.palette.mode === 'dark'
                  ? '0 8px 24px rgba(0,0,0,0.4)'
                  : '0 8px 24px rgba(67,233,123,0.06)',
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <BookmarkRoundedIcon color="secondary" />
                <Typography variant="h6" fontWeight={700}>
                  Booking Status Breakdown
                </Typography>
              </Box>
              <Chip
                label={`${bookings.length} Bookings`}
                color="secondary"
                variant="outlined"
                size="small"
                sx={{ fontWeight: 700, fontSize: 12 }}
              />
            </Box>

            <Box sx={{ height: 280, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
              {!loading && <Doughnut data={bookingStatusData} options={chartOpts} />}
            </Box>
          </Card>
        </Grid>
      </Grid>

      {/* Recent System Activity Live Feed */}
      <Card sx={{ borderRadius: 3.5, border: '1px solid', borderColor: 'divider' }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <HistoryRoundedIcon color="primary" />
              <Typography variant="h6" fontWeight={700}>
                Recent User Activity
              </Typography>
            </Box>
            <Button
              size="small"
              endIcon={<ArrowForwardRoundedIcon />}
              onClick={() => navigate('/admin/logs')}
              sx={{ fontWeight: 600 }}
            >
              View Full Audit Logs
            </Button>
          </Box>

          {loading ? (
            Array(4)
              .fill(0)
              .map((_, i) => (
                <Skeleton key={i} variant="rounded" height={40} sx={{ mb: 1, borderRadius: 2 }} />
              ))
          ) : recentLogs.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No recent activities recorded yet.
            </Typography>
          ) : (
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Time</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>User</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Action</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Details</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentLogs.map((log) => (
                    <TableRow key={log.id} hover>
                      <TableCell sx={{ fontSize: 12, color: 'text.secondary', whiteSpace: 'nowrap' }}>
                        {formatDate(log.timestamp)} {formatTime(log.timestamp)}
                      </TableCell>
                      <TableCell sx={{ fontSize: 13, fontWeight: 600 }}>
                        {log.userEmail || log.performedBy || 'System'}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={log.action}
                          size="small"
                          variant="outlined"
                          sx={{ fontSize: 11, fontWeight: 600 }}
                        />
                      </TableCell>
                      <TableCell sx={{ fontSize: 13 }}>{log.details}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default AdminDashboard;
