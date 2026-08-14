import React, { useState, useEffect, useCallback } from 'react';
import {
  Box, Grid, Card, CardContent, Typography, TextField, Button,
  InputAdornment, Select, MenuItem, FormControl, InputLabel,
  Chip, Skeleton, Divider, Avatar, Paper, Tooltip,
} from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import VerifiedRoundedIcon from '@mui/icons-material/VerifiedRounded';
import SortRoundedIcon from '@mui/icons-material/SortRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { searchProviderServices } from '../../services/providerServiceService';
import { formatCurrency, formatDuration, getErrorMessage } from '../../utils/formatters';
import EmptyState from '../../components/common/EmptyState';
import { SORT_OPTIONS } from '../../utils/constants';

const CATEGORIES = [
  { label: 'All Services', icon: '✨', query: '' },
  { label: 'Plumbing', icon: '🔧', query: 'Plumb' },
  { label: 'Electrician', icon: '⚡', query: 'Electr' },
  { label: 'Cleaning', icon: '🧹', query: 'Clean' },
  { label: 'Carpentry', icon: '🪚', query: 'Carpen' },
  { label: 'Painting', icon: '🎨', query: 'Paint' },
  { label: 'AC Repair', icon: '❄️', query: 'AC' },
];

const getCategoryIcon = (serviceName) => {
  const lower = serviceName?.toLowerCase() || '';
  if (lower.includes('plumb')) return '🔧';
  if (lower.includes('electr')) return '⚡';
  if (lower.includes('clean')) return '🧹';
  if (lower.includes('carpen')) return '🪚';
  if (lower.includes('paint')) return '🎨';
  if (lower.includes('ac') || lower.includes('cool')) return '❄️';
  return '🛠️';
};

const ServiceCard = ({ service, onBook }) => {
  const icon = getCategoryIcon(service.serviceName);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25 }}
    >
      <Card
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 3.5,
          border: '1px solid',
          borderColor: 'divider',
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
          overflow: 'hidden',
          transition: 'box-shadow 0.3s ease',
          '&:hover': {
            boxShadow: '0 12px 28px rgba(108,99,255,0.15)',
          },
        }}
      >
        <CardContent sx={{ flexGrow: 1, p: 3, display: 'flex', flexDirection: 'column' }}>
          
          {/* Card Top: Icon & Status */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 2.5,
                background: 'linear-gradient(135deg, #6C63FF, #FF6584)',
                display: 'flex',
                alignItems: 'center',
                justify: 'center',
                fontSize: 24,
                boxShadow: '0 4px 12px rgba(108,99,255,0.25)',
              }}
            >
              {icon}
            </Box>
            <Chip
              label={service.available ? 'Available' : 'Unavailable'}
              color={service.available ? 'success' : 'default'}
              size="small"
              sx={{ fontWeight: 600, fontSize: 11 }}
            />
          </Box>

          {/* Title & Provider */}
          <Typography variant="h6" fontWeight={800} sx={{ mb: 0.5, lineHeight: 1.2 }}>
            {service.serviceName}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1.5 }}>
            <VerifiedRoundedIcon sx={{ fontSize: 16, color: 'primary.main' }} />
            {service.providerName}
          </Typography>

          {/* Description */}
          {service.description && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mb: 2,
                fontSize: 13,
                lineHeight: 1.5,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {service.description}
            </Typography>
          )}

          <Box sx={{ flexGrow: 1 }} />

          {/* Details Row: Duration & Verified Status */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, py: 1, px: 1.5, bgcolor: 'action.hover', borderRadius: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
              <AccessTimeRoundedIcon fontSize="small" sx={{ color: 'text.secondary', fontSize: 16 }} />
              <Typography variant="caption" fontWeight={600} color="text.secondary">
                {formatDuration(service.estimatedDuration)}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <VerifiedRoundedIcon sx={{ fontSize: 15, color: 'primary.main' }} />
              <Typography variant="caption" fontWeight={600} color="text.secondary">
                Verified Pro
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ mb: 2 }} />

          {/* Bottom Row: Price & Book Button */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box>
              <Typography variant="caption" color="text.secondary" display="block">
                Starting from
              </Typography>
              <Typography variant="h6" fontWeight={800} color="primary.main">
                {formatCurrency(service.price)}
              </Typography>
            </Box>
            <Button
              variant="contained"
              size="medium"
              onClick={() => onBook(service)}
              disabled={!service.available}
              endIcon={<ArrowForwardRoundedIcon />}
              sx={{ borderRadius: 2.5, px: 2.5, fontWeight: 700 }}
            >
              Book Now
            </Button>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const SearchServices = () => {
  const navigate = useNavigate();
  const [serviceName, setServiceName] = useState('');
  const [city, setCity] = useState('');
  const [sort, setSort] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const fetchServices = useCallback(async (searchQuery = serviceName, searchCity = city, searchSort = sort) => {
    setLoading(true);
    setSearched(true);
    try {
      const params = {};
      if (searchQuery.trim()) params.service = searchQuery.trim();
      if (searchCity.trim()) params.city = searchCity.trim();
      if (searchSort) params.sort = searchSort;
      const res = await searchProviderServices(params);
      setResults(res.data);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [serviceName, city, sort]);

  // Load all available services on initial page load
  useEffect(() => {
    fetchServices('', '', '');
  }, []);

  const handleCategoryClick = (catQuery) => {
    setSelectedCategory(catQuery);
    setServiceName(catQuery);
    fetchServices(catQuery, city, sort);
  };

  const handleBook = (service) => navigate(`/consumer/book/${service.providerServiceId}`);

  return (
    <Box sx={{ maxWidth: 1100, mx: 'auto' }}>
      
      {/* Search Hero Banner */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, sm: 4 },
          mb: 4,
          borderRadius: 4,
          background: 'linear-gradient(135deg, #6C63FF, #FF6584)',
          color: '#fff',
          boxShadow: '0 8px 32px rgba(108,99,255,0.2)',
        }}
      >
        <Typography variant="h4" fontWeight={800} sx={{ mb: 1 }}>
          Find Verified Local Services
        </Typography>
        <Typography variant="body1" sx={{ opacity: 0.9, mb: 3 }}>
          Book trusted professionals for plumbing, electrical, cleaning, repair, and more.
        </Typography>

        {/* Search Controls Card */}
        <Paper
          elevation={0}
          sx={{
            p: 2,
            borderRadius: 3,
            bgcolor: 'background.paper',
            color: 'text.primary',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          }}
        >
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                placeholder="Service (e.g., Plumbing, AC)"
                value={serviceName}
                onChange={(e) => setServiceName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchServices(serviceName, city, sort)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchRoundedIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                placeholder="City (e.g. Mumbai)"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchServices(serviceName, city, sort)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationOnRoundedIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth>
                <InputLabel>Sort Price</InputLabel>
                <Select
                  value={sort}
                  label="Sort Price"
                  onChange={(e) => {
                    setSort(e.target.value);
                    fetchServices(serviceName, city, e.target.value);
                  }}
                  startAdornment={
                    <InputAdornment position="start" sx={{ ml: 1 }}>
                      <SortRoundedIcon color="primary" fontSize="small" />
                    </InputAdornment>
                  }
                >
                  {SORT_OPTIONS.map((o) => (
                    <MenuItem key={o.value} value={o.value}>
                      {o.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={2}>
              <Button
                variant="contained"
                fullWidth
                size="large"
                onClick={() => fetchServices(serviceName, city, sort)}
                disabled={loading}
                sx={{ py: 1.6, fontWeight: 700, borderRadius: 2.5 }}
              >
                Search
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Paper>

      {/* Category Pills */}
      <Box sx={{ mb: 4, display: 'flex', gap: 1.5, overflowX: 'auto', pb: 1, scrollbarWidth: 'none' }}>
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat.query;
          return (
            <Chip
              key={cat.label}
              label={`${cat.icon} ${cat.label}`}
              clickable
              onClick={() => handleCategoryClick(cat.query)}
              sx={{
                px: 1.5,
                py: 2.5,
                borderRadius: 2.5,
                fontSize: 14,
                fontWeight: isActive ? 700 : 500,
                bgcolor: isActive ? 'primary.main' : 'background.paper',
                color: isActive ? '#fff' : 'text.primary',
                border: '1px solid',
                borderColor: isActive ? 'primary.main' : 'divider',
                '&:hover': {
                  bgcolor: isActive ? 'primary.dark' : 'action.hover',
                },
              }}
            />
          );
        })}
      </Box>

      {/* Results Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" fontWeight={800}>
          Available Services {!loading && `(${results.length})`}
        </Typography>
        {(serviceName || city || sort) && (
          <Button
            size="small"
            color="inherit"
            onClick={() => {
              setServiceName('');
              setCity('');
              setSort('');
              setSelectedCategory('');
              fetchServices('', '', '');
            }}
          >
            Clear Filters
          </Button>
        )}
      </Box>

      {/* Service Cards Grid */}
      {loading ? (
        <Grid container spacing={3}>
          {Array(6).fill(0).map((_, i) => (
            <Grid item xs={12} sm={6} md={4} key={i}>
              <Skeleton variant="rounded" height={280} sx={{ borderRadius: 3.5 }} />
            </Grid>
          ))}
        </Grid>
      ) : results.length === 0 ? (
        <EmptyState
          title="No matching services found"
          description="Try selecting a different category or clearing your search filters."
          icon={SearchRoundedIcon}
          actionLabel="View All Services"
          onAction={() => {
            setServiceName('');
            setCity('');
            setSort('');
            setSelectedCategory('');
            fetchServices('', '', '');
          }}
        />
      ) : (
        <AnimatePresence>
          <Grid container spacing={3}>
            {results.map((s) => (
              <Grid item xs={12} sm={6} md={4} key={s.providerServiceId}>
                <ServiceCard service={s} onBook={handleBook} />
              </Grid>
            ))}
          </Grid>
        </AnimatePresence>
      )}
    </Box>
  );
};

export default SearchServices;
