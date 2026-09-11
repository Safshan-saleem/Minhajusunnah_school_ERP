import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Button, Table, TableBody,
  TableCell, TableHead, TableRow, Paper,
  TextField, Dialog, DialogTitle, DialogContent,
  DialogActions, TableContainer, MenuItem,
  Grid, Card, CardContent, Chip
} from '@mui/material';
import { getAccountSummary, getAllEntries, createEntry, getAccountsSummary, addIncome, getMonthlySalary} from '../services/api';

function Accounts() {
  const [balance, setBalance] = useState({ total_income: 0, total_expense: 0, balance: 0 });
  const [entries, setEntries] = useState([]);
  const [openIncome, setOpenIncome] = useState(false);
  const [openExpense, setOpenExpense] = useState(false);
  const [monthFilter, setMonthFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('2026');
  const [incomeForm, setIncomeForm] = useState({
    category: '', description: '', amount: '', date: '', notes: ''
  });
  const [expenseForm, setExpenseForm] = useState({
    category: '', description: '', amount: '', date: '', notes: ''
  });

  useEffect(() => {
    loadBalance();
  }, []);

  const loadBalance = async () => {
    try {
      const res = await getAccountsSummary();
      setBalance(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleMonthlyReport = async () => {
  try {
    const res = await getAllEntries({ year: yearFilter, month: monthFilter });
    const filteredEntries = res.data || [];
    setEntries(filteredEntries);

    const total_income = filteredEntries
      .filter(e => e.type === 'income')
      .reduce((sum, e) => sum + e.amount, 0);
    const total_expense = filteredEntries
      .filter(e => e.type === 'expense')
      .reduce((sum, e) => sum + e.amount, 0);

    setBalance({
      total_income,
      total_expense,
      balance: total_income - total_expense
    });
  } catch (err) {
    console.log(err);
  }
};

  const handleAddIncome = async () => {
  try {
    await createEntry({ ...incomeForm, type: 'income' });
    setOpenIncome(false);
    setIncomeForm({ category: '', description: '', amount: '', date: '', notes: '' });
    loadBalance();
    alert('Income recorded!');
  } catch (err) {
    console.log(err);
  }
};

const handleAddExpense = async () => {
  try {
    await createEntry({ ...expenseForm, type: 'expense' });
    setOpenExpense(false);
    setExpenseForm({ category: '', description: '', amount: '', date: '', notes: '' });
    loadBalance();
    alert('Expense recorded!');
  } catch (err) {
    console.log(err);
  }
};

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Accounts</Typography>

      {/* Balance Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: '#2e7d32', color: 'white' }}>
            <CardContent>
              <Typography variant="h6">Total Income</Typography>
              <Typography variant="h4">₹{balance.total_income}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: '#c62828', color: 'white' }}>
            <CardContent>
              <Typography variant="h6">Total Expense</Typography>
              <Typography variant="h4">₹{balance.total_expense}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: '#1565c0', color: 'white' }}>
            <CardContent>
              <Typography variant="h6">Balance</Typography>
              <Typography variant="h4">₹{balance.balance}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Monthly Filter */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" gutterBottom>Monthly Report</Typography>
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
              onClick={handleMonthlyReport}>
              Get Report
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Action Buttons */}
      <Box sx={{ mb: 2 }}>
        <Button variant="contained" color="success" sx={{ mr: 1 }}
          onClick={() => setOpenIncome(true)}>
          + Add Income
        </Button>
        <Button variant="contained" color="error"
          onClick={() => setOpenExpense(true)}>
          + Add Expense
        </Button>
      </Box>

      {/* Entries Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ bgcolor: '#1a237e' }}>
            <TableRow>
              <TableCell sx={{ color: 'white' }}>Type</TableCell>
              <TableCell sx={{ color: 'white' }}>Category</TableCell>
              <TableCell sx={{ color: 'white' }}>Description</TableCell>
              <TableCell sx={{ color: 'white' }}>Amount (₹)</TableCell>
              <TableCell sx={{ color: 'white' }}>Date</TableCell>
              <TableCell sx={{ color: 'white' }}>Notes</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {entries.map((e, i) => (
              <TableRow key={i} hover>
                <TableCell>
                  <Chip
                    label={e.type}
                    color={e.type === 'income' ? 'success' : 'error'}
                    size="small" />
                </TableCell>
                <TableCell>{e.category}</TableCell>
                <TableCell>{e.description}</TableCell>
                <TableCell>₹{e.amount}</TableCell>
                <TableCell>{e.date}</TableCell>
                <TableCell>{e.notes}</TableCell>
              </TableRow>
            ))}
            {entries.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  Select month and year to view report
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add Income Dialog */}
      <Dialog open={openIncome} onClose={() => setOpenIncome(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: '#2e7d32', color: 'white' }}>
          Add Income
        </DialogTitle>
        <DialogContent>
          <TextField fullWidth select label="Category" margin="normal"
            value={incomeForm.category}
            onChange={(e) => setIncomeForm({ ...incomeForm, category: e.target.value })}>
            <MenuItem value="Tuition Fee">Tuition Fee</MenuItem>
            <MenuItem value="Transport Fee">Transport Fee</MenuItem>
            <MenuItem value="Food Fee">Food Fee</MenuItem>
            <MenuItem value="Donation">Donation</MenuItem>
            <MenuItem value="Admission Fee">Admission Fee</MenuItem>
            <MenuItem value="Other Income">Other Income</MenuItem>
          </TextField>
          <TextField fullWidth label="Description" margin="normal"
            value={incomeForm.description}
            onChange={(e) => setIncomeForm({ ...incomeForm, description: e.target.value })} />
          <TextField fullWidth label="Amount (₹)" margin="normal" type="number"
            value={incomeForm.amount}
            onChange={(e) => setIncomeForm({ ...incomeForm, amount: e.target.value })} />
          <TextField fullWidth label="Date (YYYY-MM-DD)" margin="normal"
            placeholder="e.g. 2026-06-01"
            value={incomeForm.date}
            onChange={(e) => setIncomeForm({ ...incomeForm, date: e.target.value })} />
          <TextField fullWidth label="Notes" margin="normal"
            value={incomeForm.notes}
            onChange={(e) => setIncomeForm({ ...incomeForm, notes: e.target.value })} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenIncome(false)}>Cancel</Button>
          <Button onClick={handleAddIncome} variant="contained" color="success">Save</Button>
        </DialogActions>
      </Dialog>

      {/* Add Expense Dialog */}
      <Dialog open={openExpense} onClose={() => setOpenExpense(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: '#c62828', color: 'white' }}>
          Add Expense
        </DialogTitle>
        <DialogContent>
          <TextField fullWidth select label="Category" margin="normal"
            value={expenseForm.category}
            onChange={(e) => setExpenseForm({ ...expenseForm, category: e.target.value })}>
            <MenuItem value="Salary Expense">Salary Expense</MenuItem>
            <MenuItem value="Fuel Expense">Fuel Expense</MenuItem>
            <MenuItem value="Maintenance">Maintenance</MenuItem>
            <MenuItem value="Stationery">Stationery</MenuItem>
            <MenuItem value="Utility Bills">Utility Bills</MenuItem>
            <MenuItem value="Food Expense">Food Expense</MenuItem>
            <MenuItem value="Other Expense">Other Expense</MenuItem>
          </TextField>
          <TextField fullWidth label="Description" margin="normal"
            value={expenseForm.description}
            onChange={(e) => setExpenseForm({ ...expenseForm, description: e.target.value })} />
          <TextField fullWidth label="Amount (₹)" margin="normal" type="number"
            value={expenseForm.amount}
            onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })} />
          <TextField fullWidth label="Date (YYYY-MM-DD)" margin="normal"
            placeholder="e.g. 2026-06-01"
            value={expenseForm.date}
            onChange={(e) => setExpenseForm({ ...expenseForm, date: e.target.value })} />
          <TextField fullWidth label="Notes" margin="normal"
            value={expenseForm.notes}
            onChange={(e) => setExpenseForm({ ...expenseForm, notes: e.target.value })} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenExpense(false)}>Cancel</Button>
          <Button onClick={handleAddExpense} variant="contained" color="error">Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Accounts;