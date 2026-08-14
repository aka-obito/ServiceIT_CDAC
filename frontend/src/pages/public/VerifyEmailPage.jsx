import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Paper, CircularProgress } from '@mui/material';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import ErrorRoundedIcon from '@mui/icons-material/ErrorRounded';
import MarkEmailReadRoundedIcon from '@mui/icons-material/MarkEmailReadRounded';
import { motion } from 'framer-motion';
import { verifyEmail } from '../../services/authService';
import { getErrorMessage } from '../../utils/formatters';

const VerifyEmailPage = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading'); // loading | success | already_verified | error
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = params.get('token');
    if (!token) {
      setStatus('error');
      setMessage('Verification token is missing from the link.');
      return;
    }

    verifyEmail(token)
      .then((res) => {
        setStatus('success');
        setMessage(res.data || 'Email verified successfully! You can now log in.');
      })
      .catch((err) => {
        const errMsg = getErrorMessage(err);
        // If already verified or expired link, handle gracefully
        if (errMsg.toLowerCase().includes('already verified') || errMsg.toLowerCase().includes('invalid or expired')) {
          setStatus('already_verified');
          setMessage('Your email verification link has been processed. If you already verified your email, you can log in directly.');
        } else {
          setStatus('error');
          setMessage(errMsg);
        }
      });
  }, []);

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #6C63FF22, #FF658422)', p: 2 }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} style={{ width: '100%', maxWidth: 440 }}>
        <Paper elevation={0} sx={{ p: 5, borderRadius: 4, textAlign: 'center', border: '1px solid', borderColor: 'divider' }}>
          
          {status === 'loading' && (
            <Box sx={{ py: 3 }}>
              <CircularProgress sx={{ color: 'primary.main', mb: 2 }} />
              <Typography fontWeight={600}>Verifying your email token...</Typography>
            </Box>
          )}

          {status === 'success' && (
            <>
              <CheckCircleRoundedIcon sx={{ fontSize: 72, color: 'success.main', mb: 2 }} />
              <Typography variant="h5" fontWeight={800} gutterBottom>Email Verified!</Typography>
              <Typography color="text.secondary" sx={{ mb: 3 }}>{message}</Typography>
              <Button variant="contained" size="large" fullWidth onClick={() => navigate('/login')}>
                Proceed to Login
              </Button>
            </>
          )}

          {status === 'already_verified' && (
            <>
              <MarkEmailReadRoundedIcon sx={{ fontSize: 72, color: 'primary.main', mb: 2 }} />
              <Typography variant="h5" fontWeight={800} gutterBottom>Verification Complete</Typography>
              <Typography color="text.secondary" sx={{ mb: 3 }}>{message}</Typography>
              <Button variant="contained" size="large" fullWidth onClick={() => navigate('/login')}>
                Proceed to Login
              </Button>
            </>
          )}

          {status === 'error' && (
            <>
              <ErrorRoundedIcon sx={{ fontSize: 72, color: 'error.main', mb: 2 }} />
              <Typography variant="h5" fontWeight={800} gutterBottom>Verification Error</Typography>
              <Typography color="text.secondary" sx={{ mb: 3 }}>{message}</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Button variant="contained" fullWidth onClick={() => navigate('/login')}>
                  Try Logging In
                </Button>
                <Button variant="outlined" fullWidth onClick={() => navigate('/')}>
                  Go to Home
                </Button>
              </Box>
            </>
          )}
        </Paper>
      </motion.div>
    </Box>
  );
};

export default VerifyEmailPage;
