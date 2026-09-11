import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Button, Table, TableBody,
  TableCell, TableHead, TableRow, Paper,
  TextField, Dialog, DialogTitle, DialogContent,
  DialogActions, TableContainer
} from '@mui/material';
import { createEntry, getAllEntries } from '../services/api';

function Donations() {
  const [donations, setDonations] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    donor_name: '', amount: '', date: '', notes: ''
  });

  const handleAdd = async () => {
    try {
      await createEntry({
        category: 'Donation',
        description: `Donation from ${form.donor_name}`,
        amount: parseFloat(form.amount),
        date: form.date,
        notes: form.notes,
        type: 'income'
      });
      setOpen(false);
      setForm({ donor_name: '', amount: '', date: '', notes: '' });
      alert('Donation recorded successfully!');
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h4">Donations</Typography>
        <Button variant="contained" color="success"
          onClick={() => setOpen(true)}>
          + Add Donation
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ bgcolor: '#1a237e' }}>
            <TableRow>
              <TableCell sx={{ color: 'white' }}>Donor Name</TableCell>
              <TableCell sx={{ color: 'white' }}>Amount (₹)</TableCell>
              <TableCell sx={{ color: 'white' }}>Date</TableCell>
              <TableCell sx={{ color: 'white' }}>Notes</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {donations.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No donations recorded yet
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Record Donation</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="Donor Name" margin="normal"
            value={form.donor_name}
            onChange={(e) => setForm({ ...form, donor_name: e.target.value })} />
          <TextField fullWidth label="Amount (₹)" margin="normal" type="number"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })} />
          <TextField fullWidth label="Donation Date (YYYY-MM-DD)" margin="normal"
            placeholder="e.g. 2025-06-01"
            value={form.donation_date}
            onChange={(e) => setForm({ ...form, donation_date: e.target.value })} />
          <TextField fullWidth label="Notes" margin="normal"
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleAdd} variant="contained" color="success">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Donations;