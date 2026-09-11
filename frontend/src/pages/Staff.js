import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Button, Table, TableBody,
  TableCell, TableHead, TableRow, Paper,
  TextField, Dialog, DialogTitle, DialogContent,
  DialogActions, TableContainer, MenuItem, Chip
} from '@mui/material';
import { getStaff, createStaff } from '../services/api';

function Staff() {
  const [staff, setStaff] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    full_name: '', role: '', phone: '',
    email: '', address: '', join_date: '',
    salary_amount: ''
  });

  useEffect(() => {
    getStaff().then(res => setStaff(res.data)).catch(console.log);
  }, []);

  const handleAdd = async () => {
    try {
      await createStaff(form);
      const res = await getStaff();
      setStaff(res.data);
      setOpen(false);
      setForm({
        full_name: '', role: '', phone: '',
        email: '', address: '', join_date: '',
        salary_amount: ''
      });
    } catch (err) {
      console.log(err);
    }
  };

  const getRoleColor = (role) => {
    if (role === 'teacher') return 'primary';
    if (role === 'driver') return 'warning';
    return 'success';
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h4">Staff ({staff.length})</Typography>
        <Button variant="contained" onClick={() => setOpen(true)}>
          + Add Staff
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ bgcolor: '#1a237e' }}>
            <TableRow>
              <TableCell sx={{ color: 'white' }}>Name</TableCell>
              <TableCell sx={{ color: 'white' }}>Role</TableCell>
              <TableCell sx={{ color: 'white' }}>Phone</TableCell>
              <TableCell sx={{ color: 'white' }}>Email</TableCell>
              <TableCell sx={{ color: 'white' }}>Salary (₹)</TableCell>
              <TableCell sx={{ color: 'white' }}>Join Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {staff.map((s) => (
              <TableRow key={s.id} hover>
                <TableCell>{s.full_name}</TableCell>
                <TableCell>
                  <Chip label={s.role} color={getRoleColor(s.role)} size="small" />
                </TableCell>
                <TableCell>{s.phone}</TableCell>
                <TableCell>{s.email}</TableCell>
                <TableCell>₹{s.salary_amount}</TableCell>
                <TableCell>{s.join_date}</TableCell>
              </TableRow>
            ))}
            {staff.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No staff found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Staff Member</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="Full Name" margin="normal"
            value={form.full_name}
            onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
          <TextField fullWidth select label="Role" margin="normal"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}>
            <MenuItem value="teacher">Teacher</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
            <MenuItem value="driver">Driver</MenuItem>
          </TextField>
          <TextField fullWidth label="Phone" margin="normal"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <TextField fullWidth label="Email" margin="normal"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <TextField fullWidth label="Address" margin="normal"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })} />
          <TextField fullWidth label="Monthly Salary (₹)" margin="normal" type="number"
            value={form.salary_amount}
            onChange={(e) => setForm({ ...form, salary_amount: e.target.value })} />
          <TextField fullWidth label="Join Date (YYYY-MM-DD)" margin="normal"
            placeholder="e.g. 2025-06-01"
            value={form.join_date}
            onChange={(e) => setForm({ ...form, join_date: e.target.value })} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleAdd} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Staff;