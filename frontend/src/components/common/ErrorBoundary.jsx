import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("SERVICEiT ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: '#0F0F1A',
            color: '#E8E8FF',
            p: 3,
          }}
        >
          <Paper
            elevation={0}
            sx={{
              p: 5,
              borderRadius: 4,
              textAlign: 'center',
              maxWidth: 500,
              bgcolor: '#1A1A2E',
              color: '#E8E8FF',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            <ErrorOutlineRoundedIcon sx={{ fontSize: 64, color: '#FF6584', mb: 2 }} />
            <Typography variant="h5" fontWeight={800} gutterBottom>
              Something went wrong
            </Typography>
            <Typography variant="body2" sx={{ color: '#9999CC', mb: 3 }}>
              {this.state.error?.message || 'An unexpected application error occurred.'}
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button
                variant="contained"
                onClick={() => {
                  localStorage.clear();
                  window.location.href = '/';
                }}
                sx={{ bgcolor: '#6C63FF', '&:hover': { bgcolor: '#4B44CC' } }}
              >
                Clear Cache & Restart
              </Button>
              <Button
                variant="outlined"
                onClick={() => window.location.reload()}
                sx={{ color: '#E8E8FF', borderColor: 'rgba(255,255,255,0.2)' }}
              >
                Reload Page
              </Button>
            </Box>
          </Paper>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
