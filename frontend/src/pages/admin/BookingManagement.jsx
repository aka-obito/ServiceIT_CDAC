import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Card, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, TextField, InputAdornment, Skeleton,
} from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import BookmarkRoundedIcon from '@mui/icons-material/BookmarkRounded';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { adminGetAllBookings } from '../../services/adminService';
import { formatDate, formatTime, formatCurrency, getErrorMessage } from '../../utils/formatters';
import { BookingStatusChip } from '../../components/common/StatusChips';
import EmptyState from '../../components/common/EmptyState';

const BookingManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    adminGetAllBookings().then(res => setBookings(res.data)).catch(err => toast.error(getErrorMessage(err))).finally(() => setLoading(false));
  }, []);

  const filtered = bookings.filter(b =>
    b.serviceName?.toLowerCase().includes(search.toLowerCase()) ||
    b.consumerName?.toLowerCase().includes(search.toLowerCase()) ||
    b.providerName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>Booking Management</Typography>
      <TextField fullWidth placeholder="Search by service, consumer, or provider..." value={search} onChange={e => setSearch(e.target.value)}
        InputProps={{ startAdornment: <InputAdornment position="start"><SearchRoundedIcon color="action" /></InputAdornment> }} sx={{ mb: 2 }} />
      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ '& th': { fontWeight: 700, bgcolor: 'action.hover' } }}>
                <TableCell>#</TableCell>
                <TableCell>Service</TableCell>
                <TableCell>Consumer</TableCell>
                <TableCell>Provider</TableCell>
                <TableCell>Date & Time</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                Array(6).fill(0).map((_, i) => <TableRow key={i}>{Array(7).fill(0).map((__, j) => <TableCell key={j}><Skeleton /></TableCell>)}</TableRow>)
              ) : filtered.length === 0 ? (
                <TableRow><TableCell colSpan={7}><EmptyState title="No bookings found" icon={BookmarkRoundedIcon} /></TableCell></TableRow>
              ) : (
                filtered.map((b, i) => (
                  <motion.tr key={b.bookingId} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }} style={{ display: 'table-row' }}>
                    <TableCell>{b.bookingId}</TableCell>
                    <TableCell>{b.serviceName}</TableCell>
                    <TableCell>{b.consumerName}</TableCell>
                    <TableCell>{b.providerName}</TableCell>
                    <TableCell>{formatDate(b.serviceDate)}<br /><small>{formatTime(b.serviceTime)}</small></TableCell>
                    <TableCell>{formatCurrency(b.totalAmount)}</TableCell>
                    <TableCell><BookingStatusChip status={b.bookingStatus} /></TableCell>
                  </motion.tr>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
};

export default BookingManagement;
