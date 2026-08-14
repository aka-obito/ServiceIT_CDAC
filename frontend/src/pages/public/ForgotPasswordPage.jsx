import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box, Paper, Typography, TextField, Button, Link as MuiLink,
  CircularProgress, Alert,
} from '@mui/material';
import LockResetRoundedIcon from '@mui/icons-material/LockResetRounded';
import MarkEmailReadRoundedIcon from '@mui/icons-material/MarkEmailReadRounded';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { forgotPasswordSchema } from '../../utils/validators';
import { forgotPassword } from '../../services/authService';
import { getErrorMessage } from '../../utils/formatters';

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setErrorMsg('');
    try {
      await forgotPassword(data);
      setSubmittedEmail(data.email);
      toast.success('Password reset link sent to your email!');
    } catch (err) {
      setErrorMsg(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #6C63FF15, #FF658415)', p: 2 }}>
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ width: '100%', maxWidth: 440 }}>
        <Paper elevation={0} sx={{ p: { xs: 3, sm: 5 }, borderRadius: 4, border: '1px solid', borderColor: 'divider' }}>
          
          {/* Back Button */}
          <Box sx={{ mb: 2 }}>
            <Button
              startIcon={<ArrowBackRoundedIcon />}
              onClick={() => navigate('/login')}
              size="small"
              sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'none', px: 1 }}
            >
              Back to Login
            </Button>
          </Box>

          {!submittedEmail ? (
            <>
              {/* Header */}
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <Box
                  sx={{
                    width: 54, height: 54, borderRadius: 3,
                    background: 'linear-gradient(135deg, #6C63FF, #FF6584)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    mx: 'auto', mb: 2, color: '#fff',
                  }}
                >
                  <LockResetRoundedIcon sx={{ fontSize: 30 }} />
                </Box>
                <Typography variant="h5" fontWeight={800}>
                  Forgot Password?
                </Typography>
                <Typography color="text.secondary" variant="body2" sx={{ mt: 0.5 }}>
                  Enter your registered email address and we'll send you a link to reset your password.
                </Typography>
              </Box>

              {errorMsg && (
                <Alert severity="error" sx={{ mb: 2.5, borderRadius: 2 }}>{errorMsg}</Alert>
              )}

              <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                  <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Registered Email Address"
                        type="email"
                        error={!!errors.email}
                        helperText={errors.email?.message}
                        fullWidth
                        autoComplete="email"
                      />
                    )}
                  />

                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    fullWidth
                    disabled={loading}
                    sx={{
                      py: 1.5,
                      fontWeight: 700,
                      background: 'linear-gradient(135deg, #6C63FF, #FF6584)',
                    }}
                    startIcon={loading ? <CircularProgress size={18} color="inherit" /> : null}
                  >
                    {loading ? 'Sending Link...' : 'Send Reset Link'}
                  </Button>

                  <Typography variant="body2" textAlign="center">
                    Remember your password?{' '}
                    <MuiLink component={Link} to="/login" fontWeight={600}>Sign In</MuiLink>
                  </Typography>
                </Box>
              </form>
            </>
          ) : (
            /* Success confirmation screen */
            <Box sx={{ textAlign: 'center' }}>
              <Box
                sx={{
                  width: 64, height: 64, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #6C63FF, #FF6584)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  mx: 'auto', mb: 2.5, color: '#fff',
                }}
              >
                <MarkEmailReadRoundedIcon sx={{ fontSize: 36 }} />
              </Box>
              <Typography variant="h5" fontWeight={800} gutterBottom>
                Check Your Email
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3, lineHeight: 1.6 }}>
                We've sent a password reset link to <strong>{submittedEmail}</strong>.
                Please check your inbox (and spam folder) and click the link to reset your password.
              </Typography>

              <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 3 }}>
                ⏰ Link will expire in 1 hour.
              </Typography>

              <Button
                variant="contained"
                fullWidth
                onClick={() => navigate('/login')}
                sx={{ py: 1.3, fontWeight: 700 }}
              >
                Back to Login
              </Button>
            </Box>
          )}
        </Paper>
      </motion.div>
    </Box>
  );
};

export default ForgotPasswordPage;
