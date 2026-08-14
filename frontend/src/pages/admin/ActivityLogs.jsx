import React, { useEffect, useState, useMemo } from 'react';
import {
  Box, Card, CardContent, Typography, TextField, Button, Grid,
  Chip, Skeleton, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, TablePagination, Paper, InputAdornment,
  IconButton, Tooltip, FormControl, InputLabel, Select, MenuItem,
} from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import HistoryRoundedIcon from '@mui/icons-material/HistoryRounded';
import LoginRoundedIcon from '@mui/icons-material/LoginRounded';
import PersonAddRoundedIcon from '@mui/icons-material/PersonAddRounded';
import BookmarkAddedRoundedIcon from '@mui/icons-material/BookmarkAddedRounded';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import TaskAltRoundedIcon from '@mui/icons-material/TaskAltRounded';
import PaymentRoundedIcon from '@mui/icons-material/PaymentRounded';
import EditNoteRoundedIcon from '@mui/icons-material/EditNoteRounded';
import HowToRegRoundedIcon from '@mui/icons-material/HowToRegRounded';
import BlockRoundedIcon from '@mui/icons-material/BlockRounded';
import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded';
import MarkEmailReadRoundedIcon from '@mui/icons-material/MarkEmailReadRounded';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

import { getAllAuditLogs } from '../../services/auditLogService';
import { formatDate, formatTime, getErrorMessage } from '../../utils/formatters';
import EmptyState from '../../components/common/EmptyState';

const getActionConfig = (action) => {
  switch (action) {
    case 'USER_LOGIN':
      return { label: 'Login', color: 'success', icon: <LoginRoundedIcon fontSize="small" /> };
    case 'USER_REGISTER':
      return { label: 'Register', color: 'info', icon: <PersonAddRoundedIcon fontSize="small" /> };
    case 'EMAIL_VERIFIED':
      return { label: 'Email Verified', color: 'success', icon: <MarkEmailReadRoundedIcon fontSize="small" /> };
    case 'BOOKING_CREATED':
      return { label: 'Booking Created', color: 'primary', icon: <BookmarkAddedRoundedIcon fontSize="small" /> };
    case 'BOOKING_CANCELLED':
      return { label: 'Booking Cancelled', color: 'error', icon: <CancelRoundedIcon fontSize="small" /> };
    case 'BOOKING_COMPLETED':
      return { label: 'Booking Completed', color: 'success', icon: <TaskAltRoundedIcon fontSize="small" /> };
    case 'PAYMENT_SUCCESS':
      return { label: 'Payment Success', color: 'success', icon: <PaymentRoundedIcon fontSize="small" /> };
    case 'PROFILE_CREATED':
    case 'PROFILE_UPDATED':
      return { label: 'Profile Update', color: 'warning', icon: <EditNoteRoundedIcon fontSize="small" /> };
    case 'PROVIDER_APPROVED':
      return { label: 'Provider Approved', color: 'success', icon: <HowToRegRoundedIcon fontSize="small" /> };
    case 'PROVIDER_REJECTED':
      return { label: 'Provider Rejected', color: 'error', icon: <BlockRoundedIcon fontSize="small" /> };
    case 'USER_DELETED':
      return { label: 'User Deleted', color: 'error', icon: <DeleteForeverRoundedIcon fontSize="small" /> };
    default:
      return { label: action, color: 'default', icon: <HistoryRoundedIcon fontSize="small" /> };
  }
};

const getRoleColor = (role) => {
  switch (role) {
    case 'ADMIN': return 'error';
    case 'PROVIDER': return 'secondary';
    case 'CONSUMER': return 'primary';
    default: return 'default';
  }
};

const ActivityLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [actionCategory, setActionCategory] = useState('ALL');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(15);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await getAllAuditLogs();
      setLogs(res.data);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const email = log.userEmail || log.performedBy || '';
      const role = log.userRole || log.role || '';

      // Search email or details or action
      const matchesSearch =
        !search.trim() ||
        email.toLowerCase().includes(search.toLowerCase()) ||
        (log.details && log.details.toLowerCase().includes(search.toLowerCase())) ||
        (log.action && log.action.toLowerCase().includes(search.toLowerCase()));

      // Role filter
      const matchesRole = roleFilter === 'ALL' || role === roleFilter;

      // Action category filter
      let matchesCategory = true;
      if (actionCategory === 'AUTH') {
        matchesCategory = ['USER_LOGIN', 'USER_REGISTER', 'EMAIL_VERIFIED'].includes(log.action);
      } else if (actionCategory === 'BOOKINGS') {
        matchesCategory = ['BOOKING_CREATED', 'BOOKING_CANCELLED', 'BOOKING_COMPLETED', 'BOOKING_STATUS_UPDATED', 'BOOKING_CONFIRMED'].includes(log.action);
      } else if (actionCategory === 'PAYMENTS') {
        matchesCategory = ['PAYMENT_SUCCESS'].includes(log.action);
      } else if (actionCategory === 'PROFILES') {
        matchesCategory = ['PROFILE_CREATED', 'PROFILE_UPDATED', 'PROVIDER_SERVICE_ADDED', 'PROVIDER_SERVICE_UPDATED', 'PROVIDER_SERVICE_TOGGLED', 'PROVIDER_SERVICE_REMOVED'].includes(log.action);
      } else if (actionCategory === 'ADMIN') {
        matchesCategory = ['PROVIDER_APPROVED', 'PROVIDER_REJECTED', 'USER_DELETED', 'SERVICE_CREATED', 'SERVICE_UPDATED', 'SERVICE_STATUS_TOGGLED'].includes(log.action);
      }

      return matchesSearch && matchesRole && matchesCategory;
    });
  }, [logs, search, roleFilter, actionCategory]);

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h5" fontWeight={800} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <HistoryRoundedIcon color="primary" /> System Activity & Audit Logs
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Permanent, secure tracking of all user actions, logins, bookings, and updates
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<RefreshRoundedIcon />}
          onClick={fetchLogs}
          disabled={loading}
          sx={{ borderRadius: 2.5 }}
        >
          Refresh Logs
        </Button>
      </Box>

      {/* Filter Toolbar */}
      <Card sx={{ mb: 3, borderRadius: 3.5, border: '1px solid', borderColor: 'divider' }}>
        <CardContent sx={{ p: 2.5 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={5} md={6}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search by user email, action, or description..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchRoundedIcon fontSize="small" color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={6} sm={3} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Category</InputLabel>
                <Select
                  value={actionCategory}
                  label="Category"
                  onChange={(e) => setActionCategory(e.target.value)}
                >
                  <MenuItem value="ALL">All Categories</MenuItem>
                  <MenuItem value="AUTH">🔐 Logins & Signups</MenuItem>
                  <MenuItem value="BOOKINGS">📅 Bookings</MenuItem>
                  <MenuItem value="PAYMENTS">💳 Payments</MenuItem>
                  <MenuItem value="PROFILES">👤 Profile Updates</MenuItem>
                  <MenuItem value="ADMIN">🛡️ Admin Actions</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={6} sm={4} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>User Role</InputLabel>
                <Select
                  value={roleFilter}
                  label="User Role"
                  onChange={(e) => setRoleFilter(e.target.value)}
                >
                  <MenuItem value="ALL">All Roles</MenuItem>
                  <MenuItem value="CONSUMER">Consumers</MenuItem>
                  <MenuItem value="PROVIDER">Service Providers</MenuItem>
                  <MenuItem value="ADMIN">Administrators</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Logs Table */}
      <Card sx={{ borderRadius: 3.5, border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}>
        {loading ? (
          <Box sx={{ p: 3 }}>
            {Array(8).fill(0).map((_, i) => (
              <Skeleton key={i} variant="rounded" height={44} sx={{ mb: 1.5, borderRadius: 2 }} />
            ))}
          </Box>
        ) : filteredLogs.length === 0 ? (
          <EmptyState
            title="No activity logs found"
            description="No log records matched your search or filter criteria."
            icon={HistoryRoundedIcon}
          />
        ) : (
          <>
            <TableContainer>
              <Table size="medium">
                <TableHead sx={{ bgcolor: 'action.hover' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700, width: 80 }}>Log ID</TableCell>
                    <TableCell sx={{ fontWeight: 700, width: 170 }}>Timestamp</TableCell>
                    <TableCell sx={{ fontWeight: 700, width: 220 }}>User / Email</TableCell>
                    <TableCell sx={{ fontWeight: 700, width: 120 }}>Role</TableCell>
                    <TableCell sx={{ fontWeight: 700, width: 170 }}>Action</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Details</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredLogs
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((log) => {
                      const config = getActionConfig(log.action);

                      return (
                        <TableRow key={log.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                          <TableCell sx={{ color: 'text.secondary', fontWeight: 600, fontSize: 13 }}>
                            #{log.id}
                          </TableCell>
                          <TableCell sx={{ fontSize: 13 }}>
                            <Typography variant="body2" fontWeight={600} fontSize={13}>
                              {formatDate(log.timestamp)}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {formatTime(log.timestamp)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" fontWeight={600} noWrap sx={{ maxWidth: 200 }}>
                              {log.userEmail || log.performedBy || 'System / Anonymous'}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            {(log.userRole || log.role) ? (
                              <Chip
                                label={log.userRole || log.role}
                                color={getRoleColor(log.userRole || log.role)}
                                size="small"
                                sx={{ height: 22, fontSize: 11, fontWeight: 700 }}
                              />
                            ) : (
                              <Typography variant="caption" color="text.secondary">—</Typography>
                            )}
                          </TableCell>
                          <TableCell>
                            <Chip
                              icon={config.icon}
                              label={config.label}
                              color={config.color}
                              variant="outlined"
                              size="small"
                              sx={{ fontWeight: 600, fontSize: 12 }}
                            />
                          </TableCell>
                          <TableCell sx={{ fontSize: 13.5, color: 'text.primary' }}>
                            {log.details}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              component="div"
              count={filteredLogs.length}
              page={page}
              onPageChange={(_, newPage) => setPage(newPage)}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={(e) => {
                setRowsPerPage(parseInt(e.target.value, 10));
                setPage(0);
              }}
              rowsPerPageOptions={[10, 15, 25, 50]}
            />
          </>
        )}
      </Card>
    </motion.div>
  );
};

export default ActivityLogs;
