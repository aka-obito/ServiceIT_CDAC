import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box, Typography, Button, Container, Grid, Card, CardContent,
  Chip, IconButton, Tooltip, AppBar, Toolbar, Stack, Paper,
} from '@mui/material';
import { motion } from 'framer-motion';
import VerifiedRoundedIcon from '@mui/icons-material/VerifiedRounded';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import SecurityRoundedIcon from '@mui/icons-material/SecurityRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import HandymanRoundedIcon from '@mui/icons-material/HandymanRounded';
import FlashOnRoundedIcon from '@mui/icons-material/FlashOnRounded';
import { useTheme } from '../../context/ThemeContext';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, delay },
});

const services = [
  { name: 'Plumbing', icon: '🔧', desc: 'Pipe repair, taps & leakages' },
  { name: 'Electrician', icon: '⚡', desc: 'Wiring, switches & fixtures' },
  { name: 'Cleaning', icon: '🧹', desc: 'Deep home & office cleaning' },
  { name: 'Carpentry', icon: '🪚', desc: 'Furniture repair & woodwork' },
  { name: 'Painting', icon: '🎨', desc: 'Interior & exterior painting' },
  { name: 'AC Repair', icon: '❄️', desc: 'Servicing, gas refill & fixes' },
];

const features = [
  {
    icon: <VerifiedRoundedIcon sx={{ fontSize: 30, color: '#6C63FF' }} />,
    title: 'Verified Professionals',
    desc: 'Every service provider is verified and admin-approved before accepting customer bookings.',
  },
  {
    icon: <SecurityRoundedIcon sx={{ fontSize: 30, color: '#FF6584' }} />,
    title: 'Secure Razorpay Payments',
    desc: 'Industry-standard 256-bit encrypted transactions with instant booking confirmation.',
  },
  {
    icon: <AccessTimeRoundedIcon sx={{ fontSize: 30, color: '#43E97B' }} />,
    title: 'Instant Scheduling',
    desc: 'Book convenient time slots with guaranteed duration and provider buffer windows.',
  },
];

const LandingPage = () => {
  const navigate = useNavigate();
  const { mode, toggleTheme } = useTheme();

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Navbar */}
      <AppBar
        position="sticky"
        color="transparent"
        elevation={0}
        sx={{
          backdropFilter: 'blur(16px)',
          bgcolor: mode === 'dark' ? 'rgba(18, 18, 18, 0.85)' : 'rgba(255, 255, 255, 0.9)',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ py: 1.2 }}>
            <Box
              sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexGrow: 1, cursor: 'pointer' }}
              onClick={() => navigate('/')}
            >
              <Box
                sx={{
                  width: 38,
                  height: 38,
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, #6C63FF, #FF6584)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(108, 99, 255, 0.3)',
                }}
              >
                <Typography sx={{ color: '#fff', fontWeight: 900, fontSize: 16 }}>S</Typography>
              </Box>
              <Typography
                variant="h6"
                fontWeight={800}
                sx={{
                  background: 'linear-gradient(135deg, #6C63FF, #FF6584)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  letterSpacing: -0.5,
                }}
              >
                SERVICEiT
              </Typography>
            </Box>

            <Stack direction="row" spacing={1.5} alignItems="center">
              <Tooltip title={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}>
                <IconButton onClick={toggleTheme} size="small" sx={{ p: 1 }}>
                  {mode === 'dark' ? <Brightness7Icon fontSize="small" /> : <Brightness4Icon fontSize="small" />}
                </IconButton>
              </Tooltip>
              <Button
                variant="outlined"
                component={Link}
                to="/login"
                sx={{ borderRadius: 2.5, px: 2.5, textTransform: 'none', fontWeight: 600 }}
              >
                Sign In
              </Button>
              <Button
                variant="contained"
                component={Link}
                to="/register"
                sx={{
                  borderRadius: 2.5,
                  px: 2.5,
                  textTransform: 'none',
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #6C63FF, #FF6584)',
                  boxShadow: '0 4px 14px rgba(108, 99, 255, 0.3)',
                }}
              >
                Get Started
              </Button>
            </Stack>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Hero Section */}
      <Box
        sx={{
          py: { xs: 8, md: 11 },
          background: 'linear-gradient(135deg, rgba(108, 99, 255, 0.07), rgba(255, 101, 132, 0.07))',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={5} alignItems="center">
            
            {/* Left Hero Content */}
            <Grid item xs={12} md={6.5}>
              <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
                <Chip
                  icon={<HandymanRoundedIcon sx={{ fontSize: 16, color: 'primary.main' }} />}
                  label="On-Demand Home & Local Services"
                  sx={{
                    mb: 2.5,
                    bgcolor: 'rgba(108, 99, 255, 0.1)',
                    color: 'primary.main',
                    fontWeight: 700,
                    borderRadius: 2,
                    px: 0.5,
                  }}
                />
                
                <Typography variant="h2" fontWeight={900} sx={{ lineHeight: 1.15, mb: 2.5, letterSpacing: -1 }}>
                  Expert Home Services,{' '}
                  <Box
                    component="span"
                    sx={{
                      background: 'linear-gradient(135deg, #6C63FF, #FF6584)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    On Demand
                  </Box>
                </Typography>

                <Typography variant="body1" color="text.secondary" sx={{ mb: 4, fontSize: 17, lineHeight: 1.6, maxWidth: 520 }}>
                  Book certified plumbers, electricians, cleaners, and technicians in seconds. Transparent pricing, reliable professionals, and hassle-free payments.
                </Typography>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => navigate('/register')}
                    endIcon={<ArrowForwardRoundedIcon />}
                    sx={{
                      px: 3.5,
                      py: 1.6,
                      fontSize: 16,
                      fontWeight: 700,
                      borderRadius: 3,
                      background: 'linear-gradient(135deg, #6C63FF, #FF6584)',
                      boxShadow: '0 8px 25px rgba(108, 99, 255, 0.35)',
                    }}
                  >
                    Book a Service
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={() => navigate('/register?role=PROVIDER')}
                    sx={{
                      px: 3.5,
                      py: 1.6,
                      fontSize: 16,
                      fontWeight: 700,
                      borderRadius: 3,
                      borderColor: 'divider',
                      bgcolor: 'background.paper',
                      '&:hover': { bgcolor: 'action.hover' },
                    }}
                  >
                    Become a Provider
                  </Button>
                </Stack>
              </motion.div>
            </Grid>

            {/* Right Hero Cards Preview */}
            <Grid item xs={12} md={5.5}>
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.15 }}>
                <Grid container spacing={2}>
                  {services.slice(0, 4).map((s) => (
                    <Grid item xs={6} key={s.name}>
                      <Card
                        sx={{
                          p: 1,
                          borderRadius: 3.5,
                          border: '1px solid',
                          borderColor: 'divider',
                          boxShadow: '0 6px 20px rgba(0,0,0,0.03)',
                          transition: 'transform 0.2s',
                          '&:hover': { transform: 'translateY(-4px)' },
                        }}
                      >
                        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                          <Typography fontSize={32} sx={{ mb: 1 }}>{s.icon}</Typography>
                          <Typography fontWeight={700} variant="subtitle2">{s.name}</Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                            {s.desc}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </motion.div>
            </Grid>

          </Grid>
        </Container>
      </Box>

      {/* Popular Services Section */}
      <Box sx={{ py: { xs: 7, md: 9 } }}>
        <Container maxWidth="lg">
          <motion.div {...fadeUp()}>
            <Typography variant="h4" fontWeight={800} textAlign="center" sx={{ mb: 1, letterSpacing: -0.5 }}>
              Popular Services
            </Typography>
            <Typography color="text.secondary" textAlign="center" sx={{ mb: 5, fontSize: 15 }}>
              Reliable, on-demand doorstep solutions for all your home needs
            </Typography>
          </motion.div>

          <Grid container spacing={2.5}>
            {services.map((s, i) => (
              <Grid item xs={6} sm={4} md={2} key={s.name}>
                <motion.div {...fadeUp(i * 0.06)} whileHover={{ y: -6 }}>
                  <Card
                    onClick={() => navigate('/login')}
                    sx={{
                      textAlign: 'center',
                      p: 1.5,
                      borderRadius: 3,
                      border: '1px solid',
                      borderColor: 'divider',
                      cursor: 'pointer',
                      boxShadow: '0 4px 15px rgba(0,0,0,0.02)',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        borderColor: 'primary.main',
                        boxShadow: '0 8px 25px rgba(108, 99, 255, 0.15)',
                      },
                    }}
                  >
                    <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                      <Typography fontSize={38} sx={{ mb: 1 }}>{s.icon}</Typography>
                      <Typography fontWeight={700} variant="body2">{s.name}</Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Why SERVICEiT Section (3 Clean Feature Columns) */}
      <Box sx={{ bgcolor: 'action.hover', py: { xs: 7, md: 9 }, borderTop: '1px solid', borderBottom: '1px solid', borderColor: 'divider' }}>
        <Container maxWidth="lg">
          <motion.div {...fadeUp()}>
            <Typography variant="h4" fontWeight={800} textAlign="center" sx={{ mb: 1, letterSpacing: -0.5 }}>
              Why Choose SERVICEiT?
            </Typography>
            <Typography color="text.secondary" textAlign="center" sx={{ mb: 5, fontSize: 15 }}>
              Built for trust, convenience, and complete peace of mind
            </Typography>
          </motion.div>

          <Grid container spacing={3}>
            {features.map((f, i) => (
              <Grid item xs={12} md={4} key={f.title}>
                <motion.div {...fadeUp(i * 0.1)} style={{ height: '100%' }}>
                  <Card
                    sx={{
                      height: '100%',
                      p: 1.5,
                      borderRadius: 3.5,
                      border: '1px solid',
                      borderColor: 'divider',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                    }}
                  >
                    <CardContent sx={{ p: 2.5 }}>
                      <Box
                        sx={{
                          width: 50,
                          height: 50,
                          borderRadius: 2.5,
                          bgcolor: 'background.paper',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mb: 2,
                          border: '1px solid',
                          borderColor: 'divider',
                        }}
                      >
                        {f.icon}
                      </Box>
                      <Typography variant="h6" fontWeight={700} sx={{ mb: 1, fontSize: 17 }}>
                        {f.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                        {f.desc}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Floating Modern CTA Section */}
      <Box sx={{ py: { xs: 7, md: 9 } }}>
        <Container maxWidth="lg">
          <motion.div {...fadeUp(0.1)}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 4, sm: 6, md: 7 },
                borderRadius: 5,
                background: 'linear-gradient(135deg, #6C63FF, #FF6584)',
                color: '#fff',
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 15px 40px rgba(108, 99, 255, 0.25)',
              }}
            >
              {/* Subtle background ambient light */}
              <Box
                sx={{
                  position: 'absolute',
                  top: -80,
                  right: -80,
                  width: 300,
                  height: 300,
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.15)',
                  pointerEvents: 'none',
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  bottom: -80,
                  left: -80,
                  width: 300,
                  height: 300,
                  borderRadius: '50%',
                  background: 'rgba(0, 0, 0, 0.1)',
                  pointerEvents: 'none',
                }}
              />

              <Box sx={{ position: 'relative', zIndex: 1, maxWidth: 680, mx: 'auto' }}>
                <Chip
                  icon={<FlashOnRoundedIcon sx={{ fontSize: 16, color: '#fff !important' }} />}
                  label="Fast, Reliable & Secure"
                  size="small"
                  sx={{
                    mb: 2.5,
                    bgcolor: 'rgba(255, 255, 255, 0.2)',
                    color: '#fff',
                    fontWeight: 700,
                    borderRadius: 2,
                    backdropFilter: 'blur(8px)',
                  }}
                />
                
                <Typography
                  variant="h3"
                  fontWeight={900}
                  sx={{
                    mb: 2,
                    fontSize: { xs: '1.75rem', sm: '2.4rem', md: '2.8rem' },
                    letterSpacing: -0.5,
                    lineHeight: 1.2,
                  }}
                >
                  Ready to Book Your Service?
                </Typography>

                <Typography
                  variant="body1"
                  sx={{
                    mb: 4,
                    fontSize: { xs: 15, sm: 17 },
                    opacity: 0.92,
                    lineHeight: 1.6,
                    textAlign: 'center',
                  }}
                >
                  Join thousands of happy consumers and top service providers on SERVICEiT. Get started in less than a minute.
                </Typography>

                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: 2.5,
                    width: '100%',
                  }}
                >
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => navigate('/register')}
                    endIcon={<ArrowForwardRoundedIcon />}
                    sx={{
                      width: { xs: '100%', sm: 'auto' },
                      minWidth: 200,
                      bgcolor: '#fff',
                      color: '#6C63FF',
                      fontWeight: 800,
                      px: 4,
                      py: 1.6,
                      borderRadius: 3,
                      fontSize: 16,
                      boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
                      '&:hover': {
                        bgcolor: '#f5f5ff',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
                      },
                      transition: 'all 0.2s ease',
                    }}
                  >
                    Get Started Free
                  </Button>

                  <Button
                    variant="outlined"
                    size="large"
                    onClick={() => navigate('/login')}
                    sx={{
                      width: { xs: '100%', sm: 'auto' },
                      minWidth: 160,
                      color: '#fff',
                      borderColor: 'rgba(255, 255, 255, 0.7)',
                      fontWeight: 700,
                      px: 4,
                      py: 1.6,
                      borderRadius: 3,
                      fontSize: 16,
                      backdropFilter: 'blur(8px)',
                      '&:hover': {
                        bgcolor: 'rgba(255, 255, 255, 0.15)',
                        borderColor: '#fff',
                        transform: 'translateY(-2px)',
                      },
                      transition: 'all 0.2s ease',
                    }}
                  >
                    Sign In
                  </Button>
                </Box>
              </Box>
            </Paper>
          </motion.div>
        </Container>
      </Box>

      {/* Footer */}
      <Box
        sx={{
          bgcolor: 'background.paper',
          py: 3.5,
          textAlign: 'center',
          borderTop: '1px solid',
          borderColor: 'divider',
          mt: 'auto',
        }}
      >
        <Typography variant="body2" color="text.secondary">
          © 2026 SERVICEiT. All rights reserved.
        </Typography>
      </Box>

    </Box>
  );
};

export default LandingPage;
