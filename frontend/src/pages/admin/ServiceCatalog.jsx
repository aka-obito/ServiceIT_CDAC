import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Grid, Card, CardContent, Button, TextField,
  Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress,
  IconButton, Tooltip, Skeleton,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import MiscellaneousServicesRoundedIcon from '@mui/icons-material/MiscellaneousServicesRounded';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { serviceCatalogSchema } from '../../utils/validators';
import { adminGetAllServices, adminCreateService, adminUpdateService, adminDeleteService } from '../../services/adminService';
import { getErrorMessage } from '../../utils/formatters';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import EmptyState from '../../components/common/EmptyState';

const ServiceFormDialog = ({ open, onClose, onSave, editing }) => {
  const [saving, setSaving] = useState(false);
  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(serviceCatalogSchema),
    defaultValues: { serviceName: '', description: '' },
  });

  useEffect(() => {
    if (editing) {
      reset({
        serviceName: editing.serviceName || '',
        description: editing.description || '',
      });
    } else {
      reset({ serviceName: '', description: '' });
    }
  }, [editing, open, reset]);

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      await onSave(data, editing?.serviceId);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
      <DialogTitle fontWeight={700}>{editing ? 'Edit Service' : 'Add Service'}</DialogTitle>
      <DialogContent>
        <form id="cat-form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mt: 1 }}>
            <Controller
              name="serviceName"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Service Name"
                  placeholder="e.g. Deep Cleaning, AC Repair, Plumbing"
                  fullWidth
                  error={!!errors.serviceName}
                  helperText={errors.serviceName?.message}
                />
              )}
            />
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Description"
                  placeholder="Brief description of this service"
                  fullWidth
                  multiline
                  rows={3}
                  error={!!errors.description}
                  helperText={errors.description?.message}
                />
              )}
            />
          </Box>
        </form>
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose} variant="outlined" color="inherit" disabled={saving}>
          Cancel
        </Button>
        <Button
          type="submit"
          form="cat-form"
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

const ServiceCatalog = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    adminGetAllServices()
      .then((res) => setServices(res.data))
      .catch((err) => toast.error(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (data, id) => {
    try {
      if (id) {
        const res = await adminUpdateService(id, data);
        setServices((prev) => prev.map((s) => (s.serviceId === id ? res.data : s)));
        toast.success('Service updated!');
      } else {
        const res = await adminCreateService(data);
        setServices((prev) => [...prev, res.data]);
        toast.success('Service created!');
      }
    } catch (err) {
      toast.error(getErrorMessage(err));
      throw err;
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await adminDeleteService(deleteId);
      setServices((prev) => prev.filter((s) => s.serviceId !== deleteId));
      toast.success('Service deleted.');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h5" fontWeight={700}>Service Catalog</Typography>
        <Button
          variant="contained"
          startIcon={<AddRoundedIcon />}
          onClick={() => { setEditing(null); setDialogOpen(true); }}
        >
          Add Service
        </Button>
      </Box>
      {loading ? (
        <Grid container spacing={2}>
          {Array(6).fill(0).map((_, i) => (
            <Grid item xs={12} sm={6} md={4} key={i}>
              <Skeleton variant="rounded" height={130} sx={{ borderRadius: 2 }} />
            </Grid>
          ))}
        </Grid>
      ) : services.length === 0 ? (
        <EmptyState
          title="No services in catalog"
          description="Add services that providers can offer to consumers."
          icon={MiscellaneousServicesRoundedIcon}
          actionLabel="Add First Service"
          onAction={() => { setEditing(null); setDialogOpen(true); }}
        />
      ) : (
        <Grid container spacing={2.5}>
          {services.map((s, i) => (
            <Grid item xs={12} sm={6} md={4} key={s.serviceId}>
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ p: 3, flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                      <Box sx={{ width: 40, height: 40, borderRadius: 2, background: 'linear-gradient(135deg, #6C63FF, #FF6584)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <MiscellaneousServicesRoundedIcon sx={{ color: '#fff', fontSize: 20 }} />
                      </Box>
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <Tooltip title="Edit">
                          <IconButton size="small" onClick={() => { setEditing(s); setDialogOpen(true); }}>
                            <EditRoundedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton size="small" color="error" onClick={() => setDeleteId(s.serviceId)}>
                            <DeleteRoundedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>
                    <Typography fontWeight={700} variant="h6" gutterBottom>{s.serviceName}</Typography>
                    {s.description && (
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        {s.description}
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      )}
      <ServiceFormDialog open={dialogOpen} onClose={() => setDialogOpen(false)} onSave={handleSave} editing={editing} />
      <ConfirmDialog
        open={Boolean(deleteId)}
        title="Delete Service?"
        message="Providers using this service may be affected."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        loading={deleting}
        confirmText="Delete"
      />
    </Box>
  );
};

export default ServiceCatalog;
