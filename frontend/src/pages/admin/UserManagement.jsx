import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Card, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Button, Skeleton, TextField, InputAdornment,
  Tabs, Tab, Chip, Avatar, Tooltip, IconButton,
} from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { adminGetAllUsers, adminGetAllProviders, adminGetPendingProviders, adminApproveProvider, adminRejectProvider, adminDeleteUser } from '../../services/adminService';
import { getErrorMessage, getInitials } from '../../utils/formatters';
import { UserStatusChip } from '../../components/common/StatusChips';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import EmptyState from '../../components/common/EmptyState';
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState(0);
  const [search, setSearch] = useState('');
  const [actionLoading, setActionLoading] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [usersRes, pendingRes] = await Promise.all([
        adminGetAllUsers(),
        adminGetPendingProviders(),
      ]);
      setUsers(usersRes.data);
      setPending(pendingRes.data);
    } catch (err) { toast.error(getErrorMessage(err)); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleApprove = async (userId) => {
    setActionLoading(userId + '_approve');
    try {
      await adminApproveProvider(userId);
      toast.success('Provider approved!');
      await fetchData();
    } catch (err) { toast.error(getErrorMessage(err)); }
    finally { setActionLoading(null); }
  };

  const handleReject = async (userId) => {
    setActionLoading(userId + '_reject');
    try {
      await adminRejectProvider(userId);
      toast.success('Provider rejected.');
      await fetchData();
    } catch (err) { toast.error(getErrorMessage(err)); }
    finally { setActionLoading(null); }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await adminDeleteUser(deleteId);
      setUsers(prev => prev.filter(u => u.id !== deleteId));
      toast.success('User deleted.');
    } catch (err) { toast.error(getErrorMessage(err)); }
    finally { setDeleting(false); setDeleteId(null); }
  };

  const filterUsers = (list) => list.filter(u =>
    u.fullName?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  const tabData = [
    { label: 'All Users', data: filterUsers(users) },
    { label: 'Consumers', data: filterUsers(users.filter(u => u.role === 'CONSUMER')) },
    { label: 'Providers', data: filterUsers(users.filter(u => u.role === 'PROVIDER')) },
    { label: `Pending (${pending.length})`, data: filterUsers(pending) },
  ];

  const currentData = tabData[tab].data;
  const isPendingTab = tab === 3;

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>User Management</Typography>
      <Box sx={{ mb: 2 }}>
        <TextField fullWidth placeholder="Search by name or email..." value={search} onChange={e => setSearch(e.target.value)}
          InputProps={{ startAdornment: <InputAdornment position="start"><SearchRoundedIcon color="action" /></InputAdornment> }} sx={{ mb: 2 }} />
        <Tabs value={tab} onChange={(_, v) => setTab(v)} variant="scrollable" scrollButtons="auto">
          {tabData.map((t, i) => <Tab key={i} label={t.label} />)}
        </Tabs>
      </Box>

      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ '& th': { fontWeight: 700, bgcolor: 'action.hover' } }}>
                <TableCell>User</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <TableRow key={i}>
                    {Array(6).fill(0).map((__, j) => <TableCell key={j}><Skeleton variant="text" /></TableCell>)}
                  </TableRow>
                ))
              ) : currentData.length === 0 ? (
                <TableRow><TableCell colSpan={6}><EmptyState title="No users found" icon={PeopleRoundedIcon} /></TableCell></TableRow>
              ) : (
                currentData.map((u, i) => {
                  const targetId = u.userId || u.id || u.providerId;
                  return (
                    <motion.tr key={targetId || i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} style={{ display: 'table-row' }}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Avatar sx={{ bgcolor: u.role === 'CONSUMER' ? 'primary.main' : 'secondary.main', width: 32, height: 32, fontSize: 12 }}>
                            {getInitials(u.fullName)}
                          </Avatar>
                          <Typography variant="body2" fontWeight={600}>{u.fullName}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell><Typography variant="body2">{u.email}</Typography></TableCell>
                      <TableCell><Typography variant="body2">{u.phone}</Typography></TableCell>
                      <TableCell><Chip label={u.role || 'PROVIDER'} size="small" color={u.role === 'ADMIN' ? 'primary' : (u.role === 'PROVIDER' || isPendingTab) ? 'secondary' : 'default'} /></TableCell>
                      <TableCell><UserStatusChip status={u.status} /></TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                          {isPendingTab && (
                            <>
                              <Tooltip title="Approve"><IconButton size="small" color="success" onClick={() => handleApprove(targetId)} disabled={actionLoading === targetId + '_approve'}><CheckRoundedIcon fontSize="small" /></IconButton></Tooltip>
                              <Tooltip title="Reject"><IconButton size="small" color="error" onClick={() => handleReject(targetId)} disabled={actionLoading === targetId + '_reject'}><CloseRoundedIcon fontSize="small" /></IconButton></Tooltip>
                            </>
                          )}
                          {u.role !== 'ADMIN' && (
                            <Tooltip title="Delete User"><IconButton size="small" color="error" onClick={() => setDeleteId(targetId)}><DeleteRoundedIcon fontSize="small" /></IconButton></Tooltip>
                          )}
                        </Box>
                      </TableCell>
                    </motion.tr>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      <ConfirmDialog open={Boolean(deleteId)} title="Delete User?" message="This will permanently delete the user account. This cannot be undone." onConfirm={handleDelete} onCancel={() => setDeleteId(null)} loading={deleting} confirmText="Delete" />
    </Box>
  );
};

export default UserManagement;
