import React from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogContentText,
  DialogActions, Button, CircularProgress,
} from '@mui/material';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';

/**
 * Reusable confirmation dialog.
 * Props: open, title, message, onConfirm, onCancel, loading, confirmText, confirmColor
 */
const ConfirmDialog = ({
  open,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  onConfirm,
  onCancel,
  loading = false,
  confirmText = 'Confirm',
  confirmColor = 'error',
}) => (
  <Dialog
    open={open}
    onClose={onCancel}
    maxWidth="xs"
    fullWidth
    PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
  >
    <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, pb: 0 }}>
      <WarningAmberRoundedIcon color={confirmColor} />
      {title}
    </DialogTitle>
    <DialogContent>
      <DialogContentText sx={{ mt: 1 }}>{message}</DialogContentText>
    </DialogContent>
    <DialogActions sx={{ pb: 2, pr: 3 }}>
      <Button onClick={onCancel} disabled={loading} variant="outlined" color="inherit">
        Cancel
      </Button>
      <Button
        onClick={onConfirm}
        disabled={loading}
        variant="contained"
        color={confirmColor}
        startIcon={loading ? <CircularProgress size={16} color="inherit" /> : null}
      >
        {loading ? 'Please wait...' : confirmText}
      </Button>
    </DialogActions>
  </Dialog>
);

export default ConfirmDialog;
