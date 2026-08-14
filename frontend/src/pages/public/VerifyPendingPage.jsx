import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import MarkEmailReadRoundedIcon from '@mui/icons-material/MarkEmailReadRounded';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const VerifyPendingPage = () => {
  const navigate = useNavigate();
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #6C63FF22, #FF658422)', p: 2 }}>
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}>
        <Paper elevation={0} sx={{ p: 5, borderRadius: 4, textAlign: 'center', maxWidth: 460, border: '1px solid', borderColor: 'divider' }}>
          <Box sx={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg, #6C63FF, #FF6584)', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 3 }}>
            <MarkEmailReadRoundedIcon sx={{ color: '#fff', fontSize: 40 }} />
          </Box>
          <Typography variant="h5" fontWeight={700} gutterBottom>Check Your Email</Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            We've sent a verification link to your email address. Please click the link to activate your account before logging in.
          </Typography>
          <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 3 }}>
            Didn't receive it? Check your spam folder.
          </Typography>
          <Button variant="contained" onClick={() => navigate('/login')} fullWidth>
            Back to Login
          </Button>
        </Paper>
      </motion.div>
    </Box>
  );
};

export default VerifyPendingPage;
