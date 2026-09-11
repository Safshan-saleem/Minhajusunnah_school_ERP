import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Button, Table, TableBody,
  TableCell, TableHead, TableRow, Paper,
  TextField, Dialog, DialogTitle, DialogContent,
  DialogActions, TableContainer, MenuItem, Chip, Grid
} from '@mui/material';
import ReceiptIcon from '@mui/icons-material/Receipt';
import { getFees, createFee, updateFee, recordPayment, getPendingFees } from '../services/api';

function Fees() {
  const [fees, setFees] = useState([]);
  const [pending, setPending] = useState([]);
  const [openFee, setOpenFee] = useState(false);
  const [openPayment, setOpenPayment] = useState(false);
  const [feeForm, setFeeForm] = useState({
    student_id: '', fee_type: '', amount: '',
    due_date: '', academic_year: '2025-2026'
  });
   const [editingId, setEditingId] = useState(null);
  const [paymentForm, setPaymentForm] = useState({
    student_id: '', amount: '', payment_date: '',
    payment_type: '', notes: ''
  });
  const [recentPayments, setRecentPayments] = useState([]);

  useEffect(() => {
    getFees().then(res => setFees(res.data)).catch(console.log);
    getPendingFees().then(res => setPending(res.data)).catch(console.log);
  }, []);

 const handleAddFee = async () => {
  try {
    if (editingId) {
      await updateFee(editingId, feeForm);
    } else {
      await createFee(feeForm);
    }
    const res = await getFees();
    setFees(res.data);
    setOpenFee(false);
    setEditingId(null);
    setFeeForm({ student_id: '', fee_type: '', amount: '', due_date: '', academic_year: '2025-2026' });
    alert(editingId ? 'Fee updated successfully!' : 'Fee added successfully!');
  } catch (err) {
    console.log(err);
  }
};

  const openEditFee = (fee) => {
  setEditingId(fee.id);
  setFeeForm({
    student_id: fee.student_id,
    fee_type: fee.fee_type,
    amount: fee.amount,
    due_date: fee.due_date,
    academic_year: fee.academic_year
  });
  setOpenFee(true);
};

  const handlePayment = async () => {
    try {
      const res = await recordPayment(paymentForm);
      setOpenPayment(false);
      alert('Payment recorded successfully!');
      // Track the new payment so we can show a receipt button for it
      if (res && res.data && res.data.id) {
        setRecentPayments(prev => [res.data, ...prev]);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getStatusColor = (status) => {
    if (status === 'paid') return 'success';
    if (status === 'partial') return 'warning';
    return 'error';
  };

  const openReceipt = (paymentId) => {
    window.open(`http://127.0.0.1:8000/fees/payments/${paymentId}/receipt-pdf`, '_blank');
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h4">Fees Management</Typography>
        <Box>
          <Button variant="contained" sx={{ mr: 1 }}
            onClick={() => setOpenFee(true)}>
            + Add Fee
          </Button>
          <Button variant="contained" color="success"
            onClick={() => setOpenPayment(true)}>
            + Record Payment
          </Button>
        </Box>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6} md={3}>
          <Paper sx={{ p: 2, bgcolor: '#e3f2fd' }}>
            <Typography variant="h6">Total Fees</Typography>
            <Typography variant="h4">{fees.length}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} md={3}>
          <Paper sx={{ p: 2, bgcolor: '#fce4ec' }}>
            <Typography variant="h6">Pending</Typography>
            <Typography variant="h4" color="error">{pending.length}</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Recent Payments with Receipt buttons */}
      {recentPayments.length > 0 && (
        <TableContainer component={Paper} sx={{ mb: 3 }}>
          <Table>
            <TableHead sx={{ bgcolor: '#2e7d32' }}>
              <TableRow>
                <TableCell sx={{ color: 'white' }}>Student ID</TableCell>
                <TableCell sx={{ color: 'white' }}>Amount</TableCell>
                <TableCell sx={{ color: 'white' }}>Payment Date</TableCell>
                <TableCell sx={{ color: 'white' }}>Receipt</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {recentPayments.map((p) => (
                <TableRow key={p.id} hover>
                  <TableCell>{p.student_id}</TableCell>
                  <TableCell>₹{p.amount}</TableCell>
                  <TableCell>{p.payment_date}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<ReceiptIcon />}
                      onClick={() => openReceipt(p.id)}
                    >
                      Receipt
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ bgcolor: '#1a237e' }}>
            <TableRow>
              <TableCell sx={{ color: 'white' }}>Student ID</TableCell>
              <TableCell sx={{ color: 'white' }}>Fee Type</TableCell>
              <TableCell sx={{ color: 'white' }}>Amount (₹)</TableCell>
              <TableCell sx={{ color: 'white' }}>Due Date</TableCell>
              <TableCell sx={{ color: 'white' }}>Status</TableCell>
              <TableCell sx={{ color: 'white' }}>Academic Year</TableCell>
              <TableCell sx={{ color: 'white' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {fees.map((f) => (
              <TableRow key={f.id} hover>
                <TableCell>{f.student_id}</TableCell>
                <TableCell>{f.fee_type}</TableCell>
                <TableCell>₹{f.amount}</TableCell>
                <TableCell>{f.due_date}</TableCell>
                <TableCell>
                  <Chip label={f.status || 'pending'}
                    color={getStatusColor(f.status)} size="small" />
                </TableCell>
                <TableCell>{f.academic_year}</TableCell>
                <TableCell>
                  <Button size="small" variant="outlined" onClick={() => openEditFee(f)}></Button>
                </TableCell>
              </TableRow>
            ))}
            {fees.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No fees found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add Fee Dialog */}
      <Dialog open={openFee} onClose={() => setOpenFee(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingId ? 'Editing Fee' : 'Add Fee'}</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="Student ID" margin="normal" type="number"
            value={feeForm.student_id}
            onChange={(e) => setFeeForm({ ...feeForm, student_id: e.target.value })} />
          <TextField fullWidth select label="Fee Type" margin="normal"
            value={feeForm.fee_type}
            onChange={(e) => setFeeForm({ ...feeForm, fee_type: e.target.value })}>
            <MenuItem value="tuition">Tuition Fee</MenuItem>
            <MenuItem value="transportation">Transportation</MenuItem>
            <MenuItem value="food">Food</MenuItem>
            <MenuItem value="stationery">Stationery</MenuItem>
            <MenuItem value="admission">Admission Fee</MenuItem>
          </TextField>
          <TextField fullWidth label="Amount (₹)" margin="normal" type="number"
            value={feeForm.amount}
            onChange={(e) => setFeeForm({ ...feeForm, amount: e.target.value })} />
          <TextField fullWidth label="Due Date" margin="normal" type="date"
            InputLabelProps={{ shrink: true }}
            value={feeForm.due_date}
            onChange={(e) => setFeeForm({ ...feeForm, due_date: e.target.value })} />
          <TextField fullWidth label="Academic Year" margin="normal"
            value={feeForm.academic_year}
            onChange={(e) => setFeeForm({ ...feeForm, academic_year: e.target.value })} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setOpenFee(false); setEditingId(null); }}>Cancel</Button>
          <Button onClick={handleAddFee} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>

      {/* Record Payment Dialog */}
      <Dialog open={openPayment} onClose={() => setOpenPayment(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Record Payment</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="Student ID" margin="normal" type="number"
            value={paymentForm.student_id}
            onChange={(e) => setPaymentForm({ ...paymentForm, student_id: e.target.value })} />
          <TextField fullWidth label="Amount (₹)" margin="normal" type="number"
            value={paymentForm.amount}
            onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })} />
          <TextField fullWidth label="Payment Date" margin="normal" type="date"
            InputLabelProps={{ shrink: true }}
            value={paymentForm.payment_date}
            onChange={(e) => setPaymentForm({ ...paymentForm, payment_date: e.target.value })} />
          <TextField fullWidth select label="Payment Type" margin="normal"
            value={paymentForm.payment_type}
            onChange={(e) => setPaymentForm({ ...paymentForm, payment_type: e.target.value })}>
            <MenuItem value="full">Full Payment</MenuItem>
            <MenuItem value="partial">Partial Payment</MenuItem>
            <MenuItem value="installment">Installment</MenuItem>
          </TextField>
          <TextField fullWidth label="Notes" margin="normal"
            value={paymentForm.notes}
            onChange={(e) => setPaymentForm({ ...paymentForm, notes: e.target.value })} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPayment(false)}>Cancel</Button>
          <Button onClick={handlePayment} variant="contained" color="success">
            Record
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Fees;