import React from 'react';
import { Box, Paper, Typography, Button } from '@mui/material';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import ErrorRoundedIcon from '@mui/icons-material/ErrorRounded';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const PaymentStatus = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const success = state?.success ?? false;

  return (
    <Box sx={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <motion.div initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}>
        <Paper elevation={0} sx={{ p: 5, borderRadius: 4, textAlign: 'center', maxWidth: 420, border: '1px solid', borderColor: 'divider' }}>
          {success ? (
            <>
              <CheckCircleRoundedIcon sx={{ fontSize: 72, color: 'success.main', mb: 2 }} />
              <Typography variant="h5" fontWeight={800} gutterBottom>Payment Successful!</Typography>
              <Typography color="text.secondary" sx={{ mb: 3 }}>Your booking has been confirmed. Check your bookings for details.</Typography>
            </>
          ) : (
            <>
              <ErrorRoundedIcon sx={{ fontSize: 72, color: 'error.main', mb: 2 }} />
              <Typography variant="h5" fontWeight={800} gutterBottom>Payment Failed</Typography>
              <Typography color="text.secondary" sx={{ mb: 3 }}>Your payment could not be verified. Your booking is saved — you can retry payment from My Bookings.</Typography>
            </>
          )}
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
            <Button variant="contained" onClick={() => navigate('/consumer/bookings')}>View My Bookings</Button>
            <Button variant="outlined" onClick={() => navigate('/consumer/search')}>Search Services</Button>
          </Box>
        </Paper>
      </motion.div>
    </Box>
  );
};

export default PaymentStatus;
