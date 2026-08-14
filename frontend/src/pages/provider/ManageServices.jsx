import React, { useEffect, useState } from 'react';
import {
  Box, Card, CardContent, Typography, Button, Grid, TextField,
  FormControl, InputLabel, Select, MenuItem, Switch, FormControlLabel,
  Skeleton, Dialog, DialogTitle, DialogContent, DialogActions,
  CircularProgress, Divider, Chip, IconButton, Tooltip, Stack,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import MiscellaneousServicesRoundedIcon from '@mui/icons-material/MiscellaneousServicesRounded';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { providerServiceSchema } from '../../utils/validators';
import { getMyProviderProfile } from '../../services/providerService';
import {
  getMyProviderServices,
  createProviderService,
  updateProviderService,
  deleteProviderService,
  toggleProviderServiceAvailability,
} from '../../services/providerServiceService';
import { getAllServices } from '../../services/serviceCatalogService';
import { formatCurrency, formatDuration, getErrorMessage } from '../../utils/formatters';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import EmptyState from '../../components/common/EmptyState';

const ServiceFormDialog = ({ open, onClose, onSave, editing, catalog }) => {
  const [saving, setSaving] = useState(false);
  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(providerServiceSchema),
    defaultValues: { serviceId: '', price: '', estimatedDuration: '', description: '', available: true },
  });

  useEffect(() => {
    if (editing) {
      reset({
        serviceId: editing.serviceId,
        price: editing.price,
        estimatedDuration: editing.estimatedDuration,
        description: editing.description || '',
        available: editing.available !== undefined ? editing.available : true,
      });
    } else {
      reset({ serviceId: '', price: '', estimatedDuration: '', description: '', available: true });
    }
  }, [editing, open, reset]);

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      await onSave(data, editing?.providerServiceId);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
      <DialogTitle fontWeight={700}>{editing ? 'Edit Service' : 'Add New Service'}</DialogTitle>
      <DialogContent>
        <form id="service-form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mt: 1 }}>
            <Controller
              name="serviceId"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.serviceId}>
                  <InputLabel>Service</InputLabel>
                  <Select {...field} label="Service" disabled={!!editing}>
                    {catalog.map(s => (
                      <MenuItem key={s.serviceId} value={s.serviceId}>
                        {s.serviceName}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.serviceId && (
                    <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                      {errors.serviceId.message}
                    </Typography>
                  )}
                </FormControl>
              )}
            />
            <Controller
              name="price"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Price (₹)"
                  type="number"
                  fullWidth
                  error={!!errors.price}
                  helperText={errors.price?.message}
                  inputProps={{ min: 0.01, step: 0.01 }}
                />
              )}
            />
            <Controller
              name="estimatedDuration"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Estimated Duration (minutes)"
                  type="number"
                  fullWidth
                  error={!!errors.estimatedDuration}
                  helperText={errors.estimatedDuration?.message}
                  inputProps={{ min: 1 }}
                />
              )}
            />
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Description (optional)"
                  fullWidth
                  multiline
                  rows={3}
                  error={!!errors.description}
                  helperText={errors.description?.message}
                />
              )}
            />
            <Controller
              name="available"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={
                    <Switch
                      checked={Boolean(field.value)}
                      onChange={(e) => field.onChange(e.target.checked)}
                      color="success"
                    />
                  }
                  label={field.value ? "Available for booking (Active)" : "Unavailable (Inactive / Hidden from consumers)"}
                />
              )}
            />
          </Box>
        </form>
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose} disabled={saving} variant="outlined" color="inherit">
          Cancel
        </Button>
        <Button
          type="submit"
          form="service-form"
          variant="contained"
          disabled={saving}
          startIcon={saving ? <CircularProgress size={16} color="inherit" /> : null}
        >
          {saving ? 'Saving...' : editing ? 'Update' : 'Add Service'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const ManageServices = () => {
  const [services, setServices] = useState([]);
  const [catalog, setCatalog] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [togglingId, setTogglingId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, svcRes, catRes] = await Promise.all([
          getMyProviderProfile().catch(() => null),
          getMyProviderServices(),
          getAllServices(),
        ]);
        if (profileRes) setProfile(profileRes.data);
        setServices(svcRes.data || []);
        setCatalog(catRes.data || []);
      } catch (err) {
        toast.error(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSave = async (data, id) => {
    try {
      if (id) {
        const res = await updateProviderService(id, data);
        setServices((prev) => prev.map((s) => (s.providerServiceId === id ? res.data : s)));
        toast.success('Service updated!');
      } else {
        const res = await createProviderService(data);
        setServices((prev) => [...prev, res.data]);
        toast.success('Service added!');
      }
    } catch (err) {
      toast.error(getErrorMessage(err));
      throw err;
    }
  };

  const handleToggle = async (service) => {
    setTogglingId(service.providerServiceId);
    try {
      await toggleProviderServiceAvailability(service.providerServiceId);
      setServices((prev) =>
        prev.map((s) =>
          s.providerServiceId === service.providerServiceId ? { ...s, available: !s.available } : s
        )
      );
      toast.success(
        `Service is now ${!service.available ? 'Active (visible to consumers)' : 'Inactive (hidden from consumers)'}`
      );
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteProviderService(deleteId);
      setServices((prev) => prev.filter((s) => s.providerServiceId !== deleteId));
      toast.success('Service deleted.');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  if (loading) {
    return (
      <Grid container spacing={2}>
        {Array(4).fill(0).map((_, i) => (
          <Grid item xs={12} sm={6} key={i}>
            <Skeleton variant="rounded" height={160} sx={{ borderRadius: 2 }} />
          </Grid>
        ))}
      </Grid>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h5" fontWeight={700}>My Services</Typography>
          <Typography variant="body2" color="text.secondary">
            Manage your service offerings and booking availability
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddRoundedIcon />}
          onClick={() => { setEditing(null); setDialogOpen(true); }}
        >
          Add Service
        </Button>
      </Box>

      {services.length === 0 ? (
        <EmptyState
          title="No services yet"
          description="Add your first service to start receiving bookings."
          icon={MiscellaneousServicesRoundedIcon}
          actionLabel="Add Service"
          onAction={() => { setEditing(null); setDialogOpen(true); }}
        />
      ) : (
        <Grid container spacing={2.5}>
          {services.map((s, i) => (
            <Grid item xs={12} sm={6} md={4} key={s.providerServiceId}>
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                <Card
                  sx={{
                    height: '100%',
                    opacity: s.available ? 1 : 0.75,
                    border: '1px solid',
                    borderColor: s.available ? 'divider' : 'warning.light',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                      <Typography fontWeight={700} variant="h6">{s.serviceName}</Typography>
                      <Chip
                        label={s.available ? 'Active' : 'Inactive'}
                        color={s.available ? 'success' : 'default'}
                        size="small"
                        sx={{ fontWeight: 700 }}
                      />
                    </Box>

                    {s.description && (
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                        {s.description}
                      </Typography>
                    )}

                    <Typography variant="h6" fontWeight={800} color="primary.main" sx={{ mb: 0.5 }}>
                      {formatCurrency(s.price)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block">
                      Duration: {formatDuration(s.estimatedDuration)}
                    </Typography>

                    <Divider sx={{ my: 2 }} />

                    {/* Quick availability toggle and Action buttons */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <Switch
                          size="small"
                          checked={Boolean(s.available)}
                          disabled={togglingId === s.providerServiceId}
                          onChange={() => handleToggle(s)}
                          color="success"
                        />
                        <Typography variant="caption" fontWeight={600} color={s.available ? 'success.main' : 'text.secondary'}>
                          {s.available ? 'Available' : 'Paused'}
                        </Typography>
                      </Stack>

                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="Edit Service">
                          <IconButton
                            size="small"
                            onClick={() => { setEditing(s); setDialogOpen(true); }}
                            sx={{ bgcolor: 'action.hover', '&:hover': { bgcolor: 'primary.main', color: '#fff' } }}
                          >
                            <EditRoundedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Service">
                          <IconButton
                            size="small"
                            onClick={() => setDeleteId(s.providerServiceId)}
                            sx={{ bgcolor: 'action.hover', color: 'error.main', '&:hover': { bgcolor: 'error.main', color: '#fff' } }}
                          >
                            <DeleteRoundedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      )}

      <ServiceFormDialog open={dialogOpen} onClose={() => setDialogOpen(false)} onSave={handleSave} editing={editing} catalog={catalog} />
      <ConfirmDialog
        open={Boolean(deleteId)}
        title="Delete Service?"
        message="This will remove the service and may affect existing bookings."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        loading={deleting}
        confirmText="Delete"
      />
    </Box>
  );
};

export default ManageServices;
