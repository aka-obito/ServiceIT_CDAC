import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box, Paper, Typography, TextField, Button, Link as MuiLink,
  ToggleButtonGroup, ToggleButton, InputAdornment, IconButton,
  CircularProgress,
} from '@mui/material';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import WorkRoundedIcon from '@mui/icons-material/WorkRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { registerSchema } from '../../utils/validators';
import { register as registerUser } from '../../services/authService';
import { getErrorMessage } from '../../utils/formatters';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(registerSchema),
    defaultValues: { fullName: '', email: '', phone: '', password: '', confirmPassword: '', role: 'CONSUMER' },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // Exclude confirmPassword from backend payload
      const { confirmPassword, ...payload } = data;
      await registerUser(payload);
      toast.success('Registration successful! Please check your email to verify your account before logging in.');
      navigate('/verify-pending');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #6C63FF15, #FF658415)', p: 2 }}>
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ width: '100%', maxWidth: 480 }}>
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

          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box sx={{ width: 48, height: 48, borderRadius: 2, background: 'linear-gradient(135deg, #6C63FF, #FF6584)', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2 }}>
              <Typography sx={{ color: '#fff', fontWeight: 800, fontSize: 20 }}>S</Typography>
            </Box>
            <Typography variant="h4" fontWeight={800}>Create Account</Typography>
            <Typography color="text.secondary" variant="body2" sx={{ mt: 0.5 }}>Join SERVICEiT today</Typography>
          </Box>

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              {/* Role Selection */}
              <Box>
                <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>I am a</Typography>
                <Controller
                  name="role"
                  control={control}
                  render={({ field }) => (
                    <ToggleButtonGroup
                      value={field.value}
                      exclusive
                      onChange={(_, v) => v && field.onChange(v)}
                      fullWidth
                    >
                      <ToggleButton value="CONSUMER" sx={{ gap: 1, py: 1.5, borderRadius: '10px !important' }}>
                        <PersonRoundedIcon fontSize="small" /> Consumer
                      </ToggleButton>
                      <ToggleButton value="PROVIDER" sx={{ gap: 1, py: 1.5, borderRadius: '10px !important' }}>
                        <WorkRoundedIcon fontSize="small" /> Service Provider
                      </ToggleButton>
                    </ToggleButtonGroup>
                  )}
                />
                {errors.role && <Typography variant="caption" color="error">{errors.role.message}</Typography>}
              </Box>

              <Controller
                name="fullName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Full Name"
                    error={!!errors.fullName}
                    helperText={errors.fullName?.message}
                    fullWidth
                    autoComplete="name"
                  />
                )}
              />

              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Email Address"
                    type="email"
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    fullWidth
                    autoComplete="email"
                  />
                )}
              />

              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Phone Number"
                    error={!!errors.phone}
                    helperText={errors.phone?.message}
                    fullWidth
                    inputProps={{ maxLength: 10 }}
                    autoComplete="tel"
                  />
                )}
              />

              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    error={!!errors.password}
                    helperText={errors.password?.message}
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

              <Controller
                name="confirmPassword"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Confirm Password"
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
                sx={{ py: 1.5 }}
                startIcon={loading ? <CircularProgress size={18} color="inherit" /> : null}
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </Button>

              <Typography variant="body2" textAlign="center">
                Already have an account?{' '}
                <MuiLink component={Link} to="/login" fontWeight={600}>Sign In</MuiLink>
              </Typography>
            </Box>
          </form>
        </Paper>
      </motion.div>
    </Box>
  );
};

export default RegisterPage;
