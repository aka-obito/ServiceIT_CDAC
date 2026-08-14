import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Card, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, TextField, InputAdornment, Skeleton,
} from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import PaymentRoundedIcon from '@mui/icons-material/PaymentRounded';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { adminGetAllPayments } from '../../services/adminService';
import { formatDateTime, formatCurrency, getErrorMessage } from '../../utils/formatters';
import { PaymentStatusChip } from '../../components/common/StatusChips';
import EmptyState from '../../components/common/EmptyState';

const PaymentManagement = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    adminGetAllPayments().then(res => setPayments(res.data)).catch(err => toast.error(getErrorMessage(err))).finally(() => setLoading(false));
  }, []);

  const filtered = payments.filter(p =>
    p.transactionId?.toLowerCase().includes(search.toLowerCase()) ||
    String(p.bookingId).includes(search)
  );

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>Payment Management</Typography>
      <TextField fullWidth placeholder="Search by transaction ID or booking ID..." value={search} onChange={e => setSearch(e.target.value)}
        InputProps={{ startAdornment: <InputAdornment position="start"><SearchRoundedIcon color="action" /></InputAdornment> }} sx={{ mb: 2 }} />
      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ '& th': { fontWeight: 700, bgcolor: 'action.hover' } }}>
                <TableCell>#</TableCell>
                <TableCell>Booking ID</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Method</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Transaction ID</TableCell>
                <TableCell>Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                Array(5).fill(0).map((_, i) => <TableRow key={i}>{Array(7).fill(0).map((__, j) => <TableCell key={j}><Skeleton /></TableCell>)}</TableRow>)
              ) : filtered.length === 0 ? (
                <TableRow><TableCell colSpan={7}><EmptyState title="No payments found" icon={PaymentRoundedIcon} /></TableCell></TableRow>
              ) : (
                filtered.map((p, i) => (
                  <motion.tr key={p.paymentId} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }} style={{ display: 'table-row' }}>
                    <TableCell>{p.paymentId}</TableCell>
                    <TableCell>{p.bookingId}</TableCell>
                    <TableCell>{formatCurrency(p.amount)}</TableCell>
                    <TableCell>{p.paymentMethod}</TableCell>
                    <TableCell><PaymentStatusChip status={p.paymentStatus} /></TableCell>
                    <TableCell sx={{ fontSize: 12, fontFamily: 'monospace' }}>{p.transactionId || '—'}</TableCell>
                    <TableCell>{formatDateTime(p.paymentDate)}</TableCell>
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

export default PaymentManagement;
