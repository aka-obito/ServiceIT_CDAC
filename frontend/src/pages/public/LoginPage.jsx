import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box, Paper, Typography, TextField, Button, Link as MuiLink,
  InputAdornment, IconButton, CircularProgress, Alert,
} from '@mui/material';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { loginSchema } from '../../utils/validators';
import { login } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';
import { getErrorMessage } from '../../utils/formatters';

const LoginPage = () => {
  const { loginUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await login(data);
      loginUser(res.data);
      toast.success(`Welcome back, ${res.data.fullName}!`);
      
      const from = location.state?.from?.pathname;
      const dashboardMap = {
        ADMIN: '/admin/dashboard',
        CONSUMER: '/consumer/dashboard',
        PROVIDER: '/provider/dashboard',
      };
      navigate(from || dashboardMap[res.data.role] || '/', { replace: true });
    } catch (err) {
      const msg = getErrorMessage(err);
      setErrorMsg(msg);
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
              onClick={() => navigate('/')}
              size="small"
              sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'none', px: 1 }}
            >
              Back to Home
            </Button>
          </Box>

          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Box sx={{ width: 48, height: 48, borderRadius: 2, background: 'linear-gradient(135deg, #6C63FF, #FF6584)', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2 }}>
              <Typography sx={{ color: '#fff', fontWeight: 800, fontSize: 20 }}>S</Typography>
            </Box>
            <Typography variant="h4" fontWeight={800}>
              Welcome Back
            </Typography>
            <Typography color="text.secondary" variant="body2" sx={{ mt: 0.5 }}>
              Sign in to your SERVICEiT account
            </Typography>
          </Box>

          {searchParams.get('verified') === 'true' && (
            <Alert severity="success" sx={{ mb: 2.5, borderRadius: 2 }}>
              🎉 Email verified successfully! You can now log in to your account.
            </Alert>
          )}

          {searchParams.get('reset') === 'true' && (
            <Alert severity="success" sx={{ mb: 2.5, borderRadius: 2 }}>
              🔒 Password reset successfully! Please sign in with your new password.
            </Alert>
          )}

          {errorMsg && (
            <Alert severity="error" sx={{ mb: 2.5, borderRadius: 2 }}>{errorMsg}</Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <Controller name="email" control={control} render={({ field }) => (
                <TextField
                  {...field}
                  label="Email Address"
                  type="email"
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  fullWidth
                  autoComplete="email"
                />
              )} />

              <Box>
                <Controller name="password" control={control} render={({ field }) => (
                  <TextField
                    {...field}
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    fullWidth
                    autoComplete="current-password"
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
                )} />
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                  <MuiLink
                    component={Link}
                    to="/forgot-password"
                    variant="body2"
                    fontWeight={600}
                    underline="hover"
                    color="primary.main"
                  >
                    Forgot Password?
                  </MuiLink>
                </Box>
              </Box>

              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={loading}
                sx={{ py: 1.5 }}
                startIcon={loading ? <CircularProgress size={18} color="inherit" /> : null}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>

              <Typography variant="body2" textAlign="center">
                Don't have an account?{' '}
                <MuiLink component={Link} to="/register" fontWeight={600}>Create one</MuiLink>
              </Typography>
            </Box>
          </form>
        </Paper>
      </motion.div>
    </Box>
  );
};

export default LoginPage;
