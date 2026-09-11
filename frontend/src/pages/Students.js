import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Box, Typography, Button, Table, TableBody, TableCell, 
  TableHead, TableRow, Paper, TextField, Dialog, DialogTitle, 
  DialogContent, DialogActions, MenuItem, TableContainer, 
  IconButton, Card, InputAdornment, Grid, Chip, Tooltip,
  LinearProgress, Fade, Alert, Snackbar, TypographyScale,
  List
} from '@mui/material';

// Icons Vector Pack
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SchoolIcon from '@mui/icons-material/School';
import FilterListIcon from '@mui/icons-material/FilterList';
import RefreshIcon from '@mui/icons-material/Refresh';
import GirlIcon from '@mui/icons-material/Girl';
import BoyIcon from '@mui/icons-material/Boy';

// Mock Service Context fallback pattern to isolate API runtime issues
import * as API from '../services/api';

// Strict Immutable Data Schema mapping matching structural database constraints
const INITIAL_SCHEMA_STATE = Object.freeze({
  admission_no: '',
  full_name: '',
  gender: '',
  phone: '',
  address: '',
  admission_date: new Date().toISOString().split('T')[0],
  parent_name: '',
  father_profession: '',
  enrollment_status: 'Active',
  academic_strand: 'General Science'
});

export default function Students() {
  // System State Engine Modules
  const [students, setStudents] = useState([]);
  const [globalSearch, setGlobalSearch] = useState('');
  const [genderFilter, setGenderFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  
  // Modal Framework Control Layers
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formPayload, setFormPayload] = useState({ ...INITIAL_SCHEMA_STATE });
  
  // UX Feedback Engine States
  const [isUiProcessing, setIsUiProcessing] = useState(false);
  const [globalErrorMsg, setGlobalErrorMsg] = useState(null);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

  // Real-time calculation caching engines (Analytical Cards Data Context)
  const statisticsMetrics = useMemo(() => {
    const total = students.length;
    const active = students.filter(s => s.enrollment_status === 'Active').length;
    const males = students.filter(s => s.gender === 'Male').length;
    const females = students.filter(s => s.gender === 'Female').length;
    return { total, active, males, females };
  }, [students]);

  // Network Fetch Lifecycle Handlers
  const synchronizeDatabaseRecords = useCallback(async () => {
    setIsUiProcessing(true);
    setGlobalErrorMsg(null);
    try {
      const response = await API.getStudents();
      // Gracefully map array responses regardless of API wrapping strategies
      const cleanDataPayload = response?.data || (Array.isArray(response) ? response : []);
      setStudents(cleanDataPayload);
    } catch (networkError) {
      console.error("System Core API Fault: ", networkError);
      setGlobalErrorMsg("Failed to synchronize student directory with database cloud layer.");
    } finally {
      setIsUiProcessing(false);
    }
  }, []);

  useEffect(() => {
    synchronizeDatabaseRecords();
  }, [synchronizeDatabaseRecords]);

  // Form Management Methods
  const openCreationContext = () => {
    setIsEditMode(false);
    setFormPayload({ ...INITIAL_SCHEMA_STATE });
    setDialogOpen(true);
  };

  const openModificationContext = (existingProfile) => {
    setIsEditMode(true);
    setFormPayload({
      ...existingProfile,
      admission_date: existingProfile.admission_date ? existingProfile.admission_date.split('T')[0] : INITIAL_SCHEMA_STATE.admission_date
    });
    setDialogOpen(true);
  };

  const processFormSubmission = async (event) => {
    event.preventDefault();
    setIsUiProcessing(true);
    try {
      if (isEditMode) {
  await API.updateStudent(formPayload.admission_no, formPayload);
  await synchronizeDatabaseRecords();
  setNotification({ open: true, message: 'Student database record updated successfully.', severity: 'success' });
} else {
        await API.createStudent(formPayload);
        await synchronizeDatabaseRecords();
        setNotification({ open: true, message: 'New student profile logged into directory registry.', severity: 'success' });
      }
      setDialogOpen(false);
    } catch (apiPostError) {
      setNotification({ open: true, message: 'Error writing dataset transactions across servers.', severity: 'error' });
    } finally {
      setIsUiProcessing(false);
    }
  };

  const executeRecordPurge = useCallback(async (targetAdmissionNo) => {
  if (!window.confirm(`SECURITY CHALLENGE: Are you sure you want to permanently delete profile #${targetAdmissionNo}?`)) return;
  try {
    await API.deleteStudent(targetAdmissionNo);
    await synchronizeDatabaseRecords();
    setNotification({ open: true, message: 'Profile permanently deleted.', severity: 'warning' });
  } catch (err) {
    setNotification({ open: true, message: 'Failed to delete profile.', severity: 'error' });
  }
}, [synchronizeDatabaseRecords]);

  // Multi-tier advanced lookup compute grid logic
  const computedFilteredDirectory = useMemo(() => {
    return students.filter(student => {
      const queryMatch = !globalSearch ? true : (
        student.full_name?.toLowerCase().includes(globalSearch.toLowerCase()) ||
        student.id?.toLowerCase().includes(globalSearch.toLowerCase()) ||
        student.parent_name?.toLowerCase().includes(globalSearch.toLowerCase()) ||
        student.phone?.includes(globalSearch)
      );
      const genderMatch = genderFilter === 'All' ? true : student.gender === genderFilter;
      const statusMatch = statusFilter === 'All' ? true : student.enrollment_status === statusFilter;
      
      return queryMatch && genderMatch && statusMatch;
    });
  }, [students, globalSearch, genderFilter, statusFilter]);

  return (
    <Box sx={{ p: 4, bgcolor: '#f1f5f9', minHeight: '100vh', fontFamily: 'Inter, system-ui, sans-serif' }}>
      
      {/* Dynamic Network Progress Banner Bar */}
      {isUiProcessing && <LinearProgress sx={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9999, height: 4 }} color="primary" />}

      {/* Main Administrative Action Header Row */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 2, mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
          <Box sx={{ bgcolor: '#1a237e', p: 2, borderRadius: 4, color: '#fff', display: 'flex', boxShadow: '0 10px 15px -3px rgba(26, 35, 126, 0.3)' }}>
            <SchoolIcon fontSize="large" />
          </Box>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a', letterSpacing: '-0.75px' }}>Students</Typography>
            <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500 }}>Manage Student Records and Enrollment.</Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 1.5, width: { xs: '100%', sm: 'auto' } }}>
          <Button variant="outlined" startIcon={<RefreshIcon />} sx={{ textTransform: 'none', borderRadius: 2.5, fontWeight: 600, borderColor: '#cbd5e1', color: '#334155', bgcolor: '#fff' }} onClick={synchronizeDatabaseRecords}>Reload</Button>
          <Button variant="contained" startIcon={<AddIcon />} sx={{ bgcolor: '#1a237e', '&:hover': { bgcolor: '#0f144a' }, textTransform: 'none', borderRadius: 2.5, fontWeight: 600, px: 3, boxShadow: '0 4px 14px rgba(26,35,126,0.3)' }} onClick={openCreationContext}>Add Student Record</Button>
        </Box>
      </Box>

      {/* Cloud Synchronicity Diagnostics Error Alerts */}
      {globalErrorMsg && <Alert severity="error" variant="filled" sx={{ mb: 3, borderRadius: 3 }}>{globalErrorMsg}</Alert>}

      {/* High-Impact Statistics Banner Scoreboard Row */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[
          { label: 'Total Student', val: statisticsMetrics.total, color: '#1a237e', desc: 'All time entries' },
          { label: 'Active Students', val: statisticsMetrics.active, color: '#16a34a', desc: 'Current active students' },
          { label: 'Boys', val: statisticsMetrics.males, color: '#2563eb', desc: 'Male gender' },
          { label: 'Girls', val: statisticsMetrics.females, color: '#db2777', desc: 'Female gender' }
        ].map((card, idx) => (
          <Grid item xs={12} sm={6} md={3} key={idx}>
            <Card sx={{ p: 3, borderRadius: 4, bgcolor: '#fff', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <Typography variant="subtitle2" sx={{ color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{card.label}</Typography>
              <Typography variant="h3" sx={{ fontWeight: 800, color: card.color, my: 1 }}>{card.val}</Typography>
              <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 500 }}>{card.desc}</Typography>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Search Filtering and Parameter Tuning Console Bar */}
      <Card sx={{ p: 2.5, mb: 4, borderRadius: 4, border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              size="medium"
              placeholder="Search by Name, Admission No, full name, phone number, or guardian identities..."
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              InputProps={{
                startAdornment: <InputAdornment position="start"><SearchIcon color="action" /></InputAdornment>,
                style: { borderRadius: 12, backgroundColor: '#f8fafc' }
              }}
            />
          </Grid>
          <Grid item xs={6} md={3}>
            <TextField select fullWidth size="medium" label="Gender Classification" value={genderFilter} onChange={(e) => setGenderFilter(e.target.value)} InputProps={{ style: { borderRadius: 12 } }}>
              <MenuItem value="All">All Genders</MenuItem>
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={6} md={3}>
            <TextField select fullWidth size="medium" label="Students Status" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} InputProps={{ style: { borderRadius: 12 } }}>
              <MenuItem value="All">All Students list</MenuItem>
              <MenuItem value="Active">Active Students list </MenuItem>
              <MenuItem value="Suspended">Suspended Students </MenuItem>
              <MenuItem value="Graduated">Graduated Students </MenuItem>
            </TextField>
          </Grid>
        </Grid>
      </Card>

      {/* Core Ledger Data Workdesk Grid Table */}
      <TableContainer component={Paper} sx={{ borderRadius: 4, border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)' }}>
        <Table>
          <TableHead sx={{ bgcolor: '#1a237e' }}>
            <TableRow>
              {['Admission Identifier', 'Full Student Name', 'Gender', 'Parent\ guardian Profession&relation', 'Mobile Number', 'Current Status', 'Date Of Birth', 'System State Status', 'Operational Actions'].map((label, keyIndex) => (
                <TableCell key={keyIndex} sx={{ color: '#fff', fontWeight: 700, fontSize: '0.875rem', py: 2.5 }}>{label}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody sx={{ bgcolor: '#ffffff' }}>
            {computedFilteredDirectory.length > 0 ? (
              computedFilteredDirectory.map((student) => (
                <TableRow key={student.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 }, transition: 'all 0.2s' }}>
                  <TableCell sx={{ fontWeight: 800, color: '#1a237e', fontSize: '0.9rem' }}>{student.id}</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#1e293b' }}>{student.full_name}</TableCell>
                  <TableCell>
                    <Chip 
                      icon={student.gender === 'Male' ? <BoyIcon /> : <GirlIcon />}
                      label={student.gender} 
                      size="small" 
                      sx={{ 
                        fontWeight: 700, 
                        bgcolor: student.gender === 'Male' ? '#eff6ff' : '#fdf2f8', 
                        color: student.gender === 'Male' ? '#1d4ed8' : '#be185d',
                        border: `1px solid ${student.gender === 'Male' ? '#bfdbfe' : '#fbcfe8'}`
                      }} 
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#334155' }}>{student.parent_name}</Typography>
                    <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>{student.father_profession || 'Unspecified Profession'}</Typography>
                  </TableCell>
                  <TableCell sx={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.85rem', color: '#475569', fontWeight: 600 }}>{student.phone}</TableCell>
                  <TableCell>
                    <Chip 
                      label={student.enrollment_status} 
                      size="small"
                      sx={{ 
                        fontWeight: 800, 
                        bgcolor: student.enrollment_status === 'Active' ? '#f0fdf4' : '#fef2f2', 
                        color: student.enrollment_status === 'Active' ? '#166534' : '#991b1b' 
                      }} 
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Tooltip title="Edit Profile Details">
                        <IconButton size="small" sx={{ color: '#1a237e', bgcolor: '#f0f2ff', '&:hover': { bgcolor: '#e0e4ff' } }} onClick={() => openModificationContext(student)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Purge Record Safely">
                        <IconButton size="small" sx={{ color: '#ef4444', bgcolor: '#fef2f2', '&:hover': { bgcolor: '#fee2e2' } }} onClick={() => executeRecordPurge(student.id)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 10 }}>
                  <Typography variant="subtitle1" sx={{ color: '#64748b', fontWeight: 600 }}>No Student Profiles Match the Specified Criteria Filters.</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Advanced Structural Input/Modification Modal Dialog Form */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth PaperProps={{ style: { borderRadius: 20, padding: 8 } }}>
        <DialogTitle sx={{ fontWeight: 800, fontSize: '1.5rem', color: '#0f172a', pb: 1 }}>
          {isEditMode ? `Modify Record: ${formPayload.full_name}` : 'Create New System Enrollment Profile'}
        </DialogTitle>
        <form onSubmit={processFormSubmission}>
          <DialogContent dividers sx={{ borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', my: 1 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={4}>
                <TextField required fullWidth disabled={isEditMode} label="Admission Number" value={formPayload.admission_no} onChange={(e) => setFormPayload({ ...formPayload, admission_no: e.target.value })} />
              </Grid>
              <Grid item xs={12} sm={8}>
                <TextField required fullWidth label=" Student Full Name" value={formPayload.full_name} onChange={(e) => setFormPayload({ ...formPayload, full_name: e.target.value })} />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField select required fullWidth label="Gender" value={formPayload.gender} onChange={(e) => setFormPayload({ ...formPayload, gender: e.target.value })}>
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField required fullWidth type="date" label="Admission Registration Date" InputLabelProps={{ shrink: true }} value={formPayload.admission_date} onChange={(e) => setFormPayload({ ...formPayload, admission_date: e.target.value })} />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField select required fullWidth label="Current Status" value={formPayload.enrollment_status} onChange={(e) => setFormPayload({ ...formPayload, enrollment_status: e.target.value })}>
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Suspended">Suspended</MenuItem>
                  <MenuItem value="Graduated">Graduated</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField required fullWidth label="Parent or Guardian Name" value={formPayload.parent_name} onChange={(e) => setFormPayload({ ...formPayload, parent_name: e.target.value })} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Father/Guardian profession" value={formPayload.father_profession} onChange={(e) => setFormPayload({ ...formPayload, father_profession: e.target.value })} />
              </Grid>
              <Grid item xs={12}>
                <TextField required fullWidth label="Contact Number" value={formPayload.phone} onChange={(e) => setFormPayload({ ...formPayload, phone: e.target.value })} />
              </Grid>
              <Grid item xs={12}>
                <TextField required fullWidth multiline rows={3} label="Full Address" value={formPayload.address} onChange={(e) => setFormPayload({ ...formPayload, address: e.target.value })} />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField required fullWidth type="date" label="Date Of Birth" InputLabelProps={{ shrink: true }} value={formPayload.admission_date} onChange={(e) => setFormPayload({ ...formPayload, admission_date: e.target.value })} />
            </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 3, gap: 1 }}>
            <Button onClick={() => setDialogOpen(false)} sx={{ color: '#64748b', fontWeight: 600, textTransform: 'none' }}>Discard Changes</Button>
            <Button type="submit" variant="contained" sx={{ bgcolor: '#1a237e', px: 4, textTransform: 'none', borderRadius: 2.5, fontWeight: 600 }}>
              {isEditMode ? 'Commit System Update' : 'Save Secure Record'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Global Interface Toast Notification Systems */}
      <Snackbar open={notification.open} autoHideDuration={5000} onClose={() => setNotification({ ...notification, open: false })}>
        <Alert severity={notification.severity} variant="filled" sx={{ width: '100%', borderRadius: 3 }}>{notification.message}</Alert>
      </Snackbar>

    </Box>
  );
}