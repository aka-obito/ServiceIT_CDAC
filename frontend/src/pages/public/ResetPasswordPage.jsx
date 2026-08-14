import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box, Paper, Typography, TextField, Button, Link as MuiLink,
  InputAdornment, IconButton, CircularProgress, Alert,
} from '@mui/material';
import KeyRoundedIcon from '@mui/icons-material/KeyRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { resetPasswordSchema } from '../../utils/validators';
import { resetPassword } from '../../services/authService';
import { getErrorMessage } from '../../utils/formatters';

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(resetPasswordSchema),
    defaultValues: { newPassword: '', confirmPassword: '' },
  });

  const onSubmit = async (data) => {
    if (!token) {
      setErrorMsg('Password reset token is missing from the link.');
      return;
    }
    setLoading(true);
    setErrorMsg('');
    try {
      await resetPassword({
        token,
        newPassword: data.newPassword,
      });
      setIsSuccess(true);
      toast.success('Password reset successfully! You can now log in.');
    } catch (err) {
      setErrorMsg(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #6C63FF15, #FF658415)', p: 2 }}>
        <Paper elevation={0} sx={{ p: 4, borderRadius: 4, textAlign: 'center', maxWidth: 440, border: '1px solid', borderColor: 'divider' }}>
          <Alert severity="error" sx={{ mb: 3 }}>
            Invalid or missing password reset token. Please request a new password reset link.
          </Alert>
          <Button variant="contained" onClick={() => navigate('/forgot-password')}>
            Request New Link
          </Button>
        </Paper>
      </Box>
    );
  }

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

          {!isSuccess ? (
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
                  <KeyRoundedIcon sx={{ fontSize: 30 }} />
                </Box>
                <Typography variant="h5" fontWeight={800}>
                  Create New Password
                </Typography>
                <Typography color="text.secondary" variant="body2" sx={{ mt: 0.5 }}>
                  Please enter and confirm your new password below.
                </Typography>
              </Box>

              {errorMsg && (
                <Alert severity="error" sx={{ mb: 2.5, borderRadius: 2 }}>{errorMsg}</Alert>
              )}

              <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                  
                  {/* New Password */}
                  <Controller
                    name="newPassword"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="New Password"
                        type={showPassword ? 'text' : 'password'}
                        error={!!errors.newPassword}
                        helperText={errors.newPassword?.message || 'Must contain 8+ characters with uppercase, lowercase, number & special char'}
                        fullWidth
                        autoComplete="new-password"
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                {showPassword ? <VisibilityOffRoundedIcon /> : <VisibilityRoundedIcon />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                    )}
                  />

                  {/* Confirm Password */}
                  <Controller
                    name="confirmPassword"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Confirm New Password"
                        type={showConfirmPassword ? 'text' : 'password'}
                        error={!!errors.confirmPassword}
                        helperText={errors.confirmPassword?.message}
                        fullWidth
                        autoComplete="new-password"
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                                {showConfirmPassword ? <VisibilityOffRoundedIcon /> : <VisibilityRoundedIcon />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
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
                    {loading ? 'Updating Password...' : 'Reset Password'}
                  </Button>
                </Box>
              </form>
            </>
          ) : (
            /* Success View */
            <Box sx={{ textAlign: 'center' }}>
              <Box
                sx={{
                  width: 64, height: 64, borderRadius: '50%',
                  bgcolor: 'success.light',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  mx: 'auto', mb: 2.5, color: 'success.dark',
                }}
              >
                <CheckCircleRoundedIcon sx={{ fontSize: 40, color: 'success.main' }} />
              </Box>
              <Typography variant="h5" fontWeight={800} gutterBottom>
                Password Reset Successfully!
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Your account password has been updated. You can now log in using your new credentials.
              </Typography>

              <Button
                variant="contained"
                fullWidth
                onClick={() => navigate('/login?reset=true')}
                sx={{ py: 1.3, fontWeight: 700 }}
              >
                Sign In Now
              </Button>
            </Box>
          )}

        </Paper>
      </motion.div>
    </Box>
  );
};

export default ResetPasswordPage;
