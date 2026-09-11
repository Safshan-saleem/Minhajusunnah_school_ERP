import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Button, Table, TableBody,
  TableCell, TableHead, TableRow, Paper,
  TextField, Dialog, DialogTitle, DialogContent,
  DialogActions, TableContainer, MenuItem,
  Grid, Card, CardContent, Chip
} from '@mui/material';
import { getSalaries, paySalary, getSalarySummary } from '../services/api';

function Salary() {
  const [salaries, setSalaries] = useState([]);
  const [open, setOpen] = useState(false);
  const [monthFilter, setMonthFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('2026');
  const [totalPaid, setTotalPaid] = useState(0);
  const [form, setForm] = useState({
    staff_id: '', amount: '', month: '',
    year: '', payment_date: '', status: 'paid',
    payment_method: 'bank_transfer', notes: ''
  });

  useEffect(() => {
    getSalaries().then(res => setSalaries(res.data)).catch(console.log);
  }, []);

  const handlePay = async () => {
    try {
      await paySalary(form);
      const res = await getSalaries();
      setSalaries(res.data);
      setOpen(false);
      setForm({
        staff_id: '', amount: '', month: '',
        year: '', payment_date: '', status: 'paid',
        payment_method: 'bank_transfer', notes: ''
      });
      alert('Salary paid successfully!');
    } catch (err) {
      console.log(err);
    }
  };

  const handleMonthlyReport = async () => {
    try {
      const res = await getSalaries({year: yearFilter, month: monthFilter});
      setSalaries(res.data.payments || []);
      setTotalPaid(res.data.total_paid || 0);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h4">Salary Management</Typography>
        <Button variant="contained" color="success"
          onClick={() => setOpen(true)}>
          + Pay Salary
        </Button>
      </Box>

      {/* Summary Card */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: '#1565c0', color: 'white' }}>
            <CardContent>
              <Typography variant="h6">Total Records</Typography>
              <Typography variant="h3">{salaries.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: '#2e7d32', color: 'white' }}>
            <CardContent>
              <Typography variant="h6">Total Paid (Month)</Typography>
              <Typography variant="h3">₹{totalPaid}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: '#6a1b9a', color: 'white' }}>
            <CardContent>
              <Typography variant="h6">Payment Method</Typography>
              <Typography variant="h5">Bank Transfer</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Monthly Filter */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" gutterBottom>Monthly Salary Report</Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={4}>
            <TextField fullWidth select label="Month"
              value={monthFilter}
              onChange={(e) => setMonthFilter(e.target.value)}>
              {['1','2','3','4','5','6','7','8','9','10','11','12'].map(m => (
                <MenuItem key={m} value={m}>
                  {new Date(2024, m-1).toLocaleString('default', { month: 'long' })}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={4}>
            <TextField fullWidth label="Year"
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)} />
          </Grid>
          <Grid item xs={4}>
            <Button variant="contained" fullWidth
              sx={{ height: '56px' }}
              onClick={handleMonthlyReport}>
              Get Report
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Salary Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ bgcolor: '#1a237e' }}>
            <TableRow>
              <TableCell sx={{ color: 'white' }}>Staff ID</TableCell>
              <TableCell sx={{ color: 'white' }}>Amount (₹)</TableCell>
              <TableCell sx={{ color: 'white' }}>Month</TableCell>
              <TableCell sx={{ color: 'white' }}>Year</TableCell>
              <TableCell sx={{ color: 'white' }}>Payment Date</TableCell>
              <TableCell sx={{ color: 'white' }}>Method</TableCell>
              <TableCell sx={{ color: 'white' }}>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {salaries.map((s, i) => (
              <TableRow key={i} hover>
                <TableCell>{s.staff_id}</TableCell>
                <TableCell>₹{s.amount}</TableCell>
                <TableCell>{s.month}</TableCell>
                <TableCell>{s.year}</TableCell>
                <TableCell>{s.payment_date}</TableCell>
                <TableCell>{s.payment_method}</TableCell>
                <TableCell>
                  <Chip label={s.status}
                    color={s.status === 'paid' ? 'success' : 'warning'}
                    size="small" />
                </TableCell>
              </TableRow>
            ))}
            {salaries.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No salary records found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pay Salary Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: '#1a237e', color: 'white' }}>
          Pay Salary
        </DialogTitle>
        <DialogContent>
          <TextField fullWidth label="Staff ID" margin="normal" type="number"
            value={form.staff_id}
            onChange={(e) => setForm({ ...form, staff_id: e.target.value })} />
          <TextField fullWidth label="Amount (₹)" margin="normal" type="number"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })} />
          <TextField fullWidth select label="Month" margin="normal"
            value={form.month}
            onChange={(e) => setForm({ ...form, month: e.target.value })}>
            {['1','2','3','4','5','6','7','8','9','10','11','12'].map(m => (
              <MenuItem key={m} value={m}>
                {new Date(2024, m-1).toLocaleString('default', { month: 'long' })}
              </MenuItem>
            ))}
          </TextField>
          <TextField fullWidth label="Year" margin="normal"
            value={form.year}
            onChange={(e) => setForm({ ...form, year: e.target.value })} />
          <TextField fullWidth label="Payment Date (YYYY-MM-DD)" margin="normal"
            placeholder="e.g. 2026-06-27"
            value={form.payment_date}
            onChange={(e) => setForm({ ...form, payment_date: e.target.value })} />
          <TextField fullWidth select label="Payment Method" margin="normal"
            value={form.payment_method}
            onChange={(e) => setForm({ ...form, payment_method: e.target.value })}>
            <MenuItem value="bank_transfer">Bank Transfer</MenuItem>
            <MenuItem value="cash">Cash</MenuItem>
          </TextField>
          <TextField fullWidth label="Notes" margin="normal"
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handlePay} variant="contained" color="success">
            Pay
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Salary;