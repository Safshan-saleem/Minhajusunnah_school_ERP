import React, { useState, useEffect } from 'react';
import { Grid, Card, CardContent, Typography, Box } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import PaymentIcon from '@mui/icons-material/Payment';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import SchoolIcon from '@mui/icons-material/School';
import { getStudents, getStaff, getAccountsSummary, getPendingFees } from '../services/api';

const StatCard = ({ title, value, icon, color }) => (
  <Card sx={{ bgcolor: color, color: 'white' }}>
    <CardContent>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="h6">{title}</Typography>
          <Typography variant="h3">{value}</Typography>
        </Box>
        <Box sx={{ fontSize: 60, opacity: 0.8 }}>{icon}</Box>
      </Box>
    </CardContent>
  </Card>
);

function Dashboard() {
  const [stats, setStats] = useState({
    students: 0, staff: 0, balance: 0, pending: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [students, staff, accountsSummary, pending] = await Promise.all([
          getStudents(), getStaff(), getAccountsSummary(), getPendingFees()
        ]);
        setStats({
          students: students.data.length,
          staff: staff.data.length,
          balance: accountsSummary.data.balance || 0,
          pending: pending.data.length
        });
      } catch (err) {
        console.log('Loading...');
      }
    };
    fetchStats();
  }, []);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard — Minhajusunnah Islamic Education
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Total Students" value={stats.students}
            icon={<PeopleIcon fontSize="inherit" />} color="#1565c0" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Total Staff" value={stats.staff}
            icon={<SchoolIcon fontSize="inherit" />} color="#2e7d32" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Balance (₹)" value={stats.balance}
            icon={<AccountBalanceIcon fontSize="inherit" />} color="#6a1b9a" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Pending Fees" value={stats.pending}
            icon={<PaymentIcon fontSize="inherit" />} color="#c62828" />
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard;