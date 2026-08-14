import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import {
  Box, Drawer, AppBar, Toolbar, Typography, IconButton, List, ListItem,
  ListItemButton, ListItemIcon, ListItemText, Avatar, Divider, Tooltip,
  useMediaQuery, useTheme as useMuiTheme, Chip,
} from '@mui/material';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded';
import MiscellaneousServicesRoundedIcon from '@mui/icons-material/MiscellaneousServicesRounded';
import BookmarkRoundedIcon from '@mui/icons-material/BookmarkRounded';
import PaymentRoundedIcon from '@mui/icons-material/PaymentRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import HistoryRoundedIcon from '@mui/icons-material/HistoryRounded';
import AdminPanelSettingsRoundedIcon from '@mui/icons-material/AdminPanelSettingsRounded';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const DRAWER_WIDTH = 260;

const navItems = [
  { label: 'Dashboard', path: '/admin/dashboard', icon: <DashboardRoundedIcon /> },
  { label: 'Users', path: '/admin/users', icon: <PeopleRoundedIcon /> },
  { label: 'Service Catalog', path: '/admin/services', icon: <MiscellaneousServicesRoundedIcon /> },
  { label: 'Bookings', path: '/admin/bookings', icon: <BookmarkRoundedIcon /> },
  { label: 'Payments', path: '/admin/payments', icon: <PaymentRoundedIcon /> },
  { label: 'Activity Logs', path: '/admin/logs', icon: <HistoryRoundedIcon /> },
];

const AdminLayout = () => {
  const { logoutUser } = useAuth();
  const { mode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => { logoutUser(); navigate('/login'); };

  const drawer = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box sx={{ width: 36, height: 36, borderRadius: 2, background: 'linear-gradient(135deg, #6C63FF, #FF6584)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography sx={{ color: '#fff', fontWeight: 800, fontSize: 14 }}>S</Typography>
        </Box>
        <Typography variant="h6" fontWeight={800} sx={{ background: 'linear-gradient(135deg, #6C63FF, #FF6584)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          SERVICEiT
        </Typography>
      </Box>
      <Divider />
      <Box sx={{ px: 2, py: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 1.5, borderRadius: 2, bgcolor: 'action.hover' }}>
          <Avatar sx={{ background: 'linear-gradient(135deg, #6C63FF, #FF6584)', width: 38, height: 38 }}>
            <AdminPanelSettingsRoundedIcon fontSize="small" />
          </Avatar>
          <Box>
            <Typography variant="body2" fontWeight={600}>Administrator</Typography>
            <Chip label="ADMIN" size="small" color="primary" sx={{ height: 18, fontSize: 10 }} />
          </Box>
        </Box>
      </Box>
      <List sx={{ px: 1.5, flexGrow: 1 }}>
        {navItems.map((item) => {
          const active = location.pathname === item.path;
          return (
            <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                component={Link} to={item.path}
                onClick={() => isMobile && setMobileOpen(false)}
                sx={{ borderRadius: 2, bgcolor: active ? 'primary.main' : 'transparent', color: active ? '#fff' : 'text.primary', '&:hover': { bgcolor: active ? 'primary.dark' : 'action.hover' } }}
              >
                <ListItemIcon sx={{ color: 'inherit', minWidth: 38 }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} primaryTypographyProps={{ fontSize: 14, fontWeight: active ? 600 : 400 }} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
      <Divider />
      <List sx={{ px: 1.5, pb: 2 }}>
        <ListItem disablePadding>
          <ListItemButton onClick={handleLogout} sx={{ borderRadius: 2, color: 'error.main' }}>
            <ListItemIcon sx={{ color: 'inherit', minWidth: 38 }}><LogoutRoundedIcon /></ListItemIcon>
            <ListItemText primary="Logout" primaryTypographyProps={{ fontSize: 14 }} />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {!isMobile && (
        <Drawer variant="permanent" sx={{ width: DRAWER_WIDTH, flexShrink: 0, '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box', borderRight: '1px solid', borderColor: 'divider' } }}>
          {drawer}
        </Drawer>
      )}
      {isMobile && (
        <Drawer variant="temporary" open={mobileOpen} onClose={() => setMobileOpen(false)} ModalProps={{ keepMounted: true }} sx={{ '& .MuiDrawer-paper': { width: DRAWER_WIDTH } }}>
          {drawer}
        </Drawer>
      )}
      <Box component="main" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <AppBar position="static" color="transparent" elevation={0} sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
          <Toolbar>
            {isMobile && (<IconButton onClick={() => setMobileOpen(true)} sx={{ mr: 1 }}><MenuRoundedIcon /></IconButton>)}
            <Typography variant="h6" fontWeight={600} sx={{ flexGrow: 1 }}>
              {navItems.find((n) => n.path === location.pathname)?.label || 'Admin Panel'}
            </Typography>
            <Tooltip title={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}>
              <IconButton onClick={toggleTheme}>{mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}</IconButton>
            </Tooltip>
          </Toolbar>
        </AppBar>
        <Box sx={{ flexGrow: 1, p: { xs: 2, md: 3 } }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default AdminLayout;
