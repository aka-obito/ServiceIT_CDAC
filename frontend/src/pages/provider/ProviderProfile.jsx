import React, { useEffect, useState } from 'react';
import {
  Box, Card, CardContent, Typography, TextField, Button, Grid,
  CircularProgress, Skeleton, Avatar, Chip, Divider, Paper, InputAdornment,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import StorefrontRoundedIcon from '@mui/icons-material/StorefrontRounded';
import WorkHistoryRoundedIcon from '@mui/icons-material/WorkHistoryRounded';
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import LocationCityRoundedIcon from '@mui/icons-material/LocationCityRounded';
import MapRoundedIcon from '@mui/icons-material/MapRounded';
import PinDropRoundedIcon from '@mui/icons-material/PinDropRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import PhoneRoundedIcon from '@mui/icons-material/PhoneRounded';
import VerifiedUserRoundedIcon from '@mui/icons-material/VerifiedUserRounded';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

import { providerProfileSchema } from '../../utils/validators';
import { getMyProviderProfile, createProviderProfile, updateProviderProfile, deleteProviderProfile } from '../../services/providerService';
import { getCurrentUser } from '../../services/authService';
import { getErrorMessage, getInitials } from '../../utils/formatters';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { useAuth } from '../../context/AuthContext';

const ProviderProfile = () => {
  const [profile, setProfile] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(providerProfileSchema),
    defaultValues: { businessName: '', description: '', address: '', city: '', state: '', pincode: '', experienceYears: 0 },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch current user details (includes phone)
        const userRes = await getCurrentUser().catch(() => null);
        if (userRes) setUserInfo(userRes.data);

        // Fetch provider profile details
        const profileRes = await getMyProviderProfile().catch(() => null);
        if (profileRes) {
          setProfile(profileRes.data);
          reset(profileRes.data);
        }
      } catch (err) {
        toast.error(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [reset]);

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      let res = profile ? await updateProviderProfile(data) : await createProviderProfile(data);
      toast.success(profile ? 'Provider profile updated!' : 'Provider profile created!');
      setProfile(res.data);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteProviderProfile();
      toast.success('Provider profile deleted.');
      logoutUser();
      navigate('/login');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setDeleting(false);
      setConfirmOpen(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ maxWidth: 850, mx: 'auto', p: 2 }}>
        <Skeleton variant="rounded" height={160} sx={{ borderRadius: 4, mb: 3 }} />
        <Skeleton variant="rounded" height={380} sx={{ borderRadius: 4 }} />
      </Box>
    );
  }

  const ownerName = userInfo?.fullName || user?.fullName || 'Owner';
  const ownerEmail = userInfo?.email || user?.email || '—';
  const ownerPhone = userInfo?.phone || '—';

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Box sx={{ maxWidth: 880, mx: 'auto' }}>
        
        {/* Profile Header Hero Card */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, sm: 4 },
            mb: 4,
            borderRadius: 4,
            background: 'linear-gradient(135deg, #FF6584, #6C63FF)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            gap: 3,
            flexWrap: 'wrap',
            boxShadow: '0 8px 32px rgba(255,101,132,0.2)',
          }}
        >
          <Avatar
            sx={{
              width: 80,
              height: 80,
              bgcolor: '#fff',
              color: '#FF6584',
              fontSize: 28,
              fontWeight: 800,
              boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
            }}
          >
            {getInitials(profile?.businessName || ownerName)}
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5, flexWrap: 'wrap' }}>
              <Typography variant="h4" fontWeight={800}>
                {profile?.businessName || ownerName}
              </Typography>
              <Chip
                icon={<VerifiedUserRoundedIcon sx={{ color: '#fff !important', fontSize: 16 }} />}
                label="PROVIDER"
                size="small"
                sx={{ bgcolor: 'rgba(255,255,255,0.25)', color: '#fff', fontWeight: 700 }}
              />
              {profile?.status && (
                <Chip
                  label={profile.status}
                  color={profile.status === 'ACTIVE' ? 'success' : 'warning'}
                  size="small"
                  sx={{ fontWeight: 700 }}
                />
              )}
            </Box>
            <Typography variant="body2" sx={{ opacity: 0.9, display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
              <span>👤 Owner: {ownerName}</span>
              <span>✉️ {ownerEmail}</span>
              <span>📞 {ownerPhone}</span>
            </Typography>
          </Box>
        </Paper>

        {/* Main Details Card */}
        <Card sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
          <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
            
            {/* Read-Only Owner Info */}
            <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
              Account Owner Info
            </Typography>
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Owner Name"
                  value={ownerName}
                  disabled
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonRoundedIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Email Address"
                  value={ownerEmail}
                  disabled
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailRoundedIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Phone Number"
                  value={ownerPhone}
                  disabled
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PhoneRoundedIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>

            <Divider sx={{ mb: 3 }} />

            {/* Provider Business Profile Form */}
            <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
              Business & Location Profile
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <Grid container spacing={2.5}>
                <Grid item xs={12} sm={7}>
                  <Controller
                    name="businessName"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Business / Store Name"
                        placeholder="e.g. Jayesh Electronics & Repairs"
                        fullWidth
                        error={!!errors.businessName}
                        helperText={errors.businessName?.message}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <StorefrontRoundedIcon color="secondary" fontSize="small" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={5}>
                  <Controller
                    name="experienceYears"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Years of Experience"
                        type="number"
                        placeholder="e.g. 5"
                        fullWidth
                        error={!!errors.experienceYears}
                        helperText={errors.experienceYears?.message}
                        inputProps={{ min: 0, max: 60 }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <WorkHistoryRoundedIcon color="secondary" fontSize="small" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Controller
                    name="description"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Business Description"
                        placeholder="Describe your services, specializations, and working hours..."
                        fullWidth
                        multiline
                        rows={3}
                        error={!!errors.description}
                        helperText={errors.description?.message}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1.5 }}>
                              <DescriptionRoundedIcon color="secondary" fontSize="small" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Controller
                    name="address"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Business Address"
                        placeholder="Shop/Office No., Building Name, Street"
                        fullWidth
                        multiline
                        rows={2}
                        error={!!errors.address}
                        helperText={errors.address?.message}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1.5 }}>
                              <HomeRoundedIcon color="secondary" fontSize="small" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <Controller
                    name="city"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="City"
                        placeholder="e.g. Mumbai"
                        fullWidth
                        error={!!errors.city}
                        helperText={errors.city?.message}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <LocationCityRoundedIcon color="secondary" fontSize="small" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Controller
                    name="state"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="State"
                        placeholder="e.g. Maharashtra"
                        fullWidth
                        error={!!errors.state}
                        helperText={errors.state?.message}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <MapRoundedIcon color="secondary" fontSize="small" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Controller
                    name="pincode"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Pincode"
                        placeholder="400001"
                        fullWidth
                        error={!!errors.pincode}
                        helperText={errors.pincode?.message}
                        inputProps={{ maxLength: 6 }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <PinDropRoundedIcon color="secondary" fontSize="small" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    )}
                  />
                </Grid>
              </Grid>

              {/* Action Buttons */}
              <Box sx={{ mt: 4, display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center' }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="secondary"
                  size="large"
                  disabled={saving}
                  sx={{ px: 4, py: 1.4, borderRadius: 2.5, fontWeight: 700 }}
                  startIcon={saving ? <CircularProgress size={18} color="inherit" /> : <SaveRoundedIcon />}
                >
                  {saving ? 'Saving...' : profile ? 'Update Provider Profile' : 'Create Provider Profile'}
                </Button>

                {profile && (
                  <Button
                    variant="outlined"
                    color="error"
                    size="medium"
                    onClick={() => setConfirmOpen(true)}
                    startIcon={<DeleteRoundedIcon />}
                    sx={{ borderRadius: 2.5 }}
                  >
                    Delete Profile
                  </Button>
                )}
              </Box>
            </form>
          </CardContent>
        </Card>

        {/* Confirmation Modal */}
        <ConfirmDialog
          open={confirmOpen}
          title="Delete Provider Profile?"
          message="This will permanently delete your provider profile and log you out. Proceed?"
          onConfirm={handleDelete}
          onCancel={() => setConfirmOpen(false)}
          loading={deleting}
          confirmText="Yes, Delete Profile"
        />
      </Box>
    </motion.div>
  );
};

export default ProviderProfile;
