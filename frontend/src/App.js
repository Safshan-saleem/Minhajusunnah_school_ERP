import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Drawer, List, ListItem, ListItemIcon, ListItemText, Box, CssBaseline } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import SchoolIcon from '@mui/icons-material/School';
import PaymentIcon from '@mui/icons-material/Payment';
import EventNoteIcon from '@mui/icons-material/EventNote';
import AssessmentIcon from '@mui/icons-material/Assessment';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import DashboardIcon from '@mui/icons-material/Dashboard';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import MoneyIcon from '@mui/icons-material/Money';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';

import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Staff from './pages/Staff';
import Fees from './pages/Fees';
import Attendance from './pages/Attendance';
import Exams from './pages/Exams';
import Accounts from './pages/Accounts';
import Donations from './pages/Donations';
import Salary from './pages/Salary';
import Vehicles from './pages/Vehicles';

const drawerWidth = 240;

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
  { text: 'Students', icon: <PeopleIcon />, path: '/students' },
  { text: 'Staff', icon: <SchoolIcon />, path: '/staff' },
  { text: 'Fees', icon: <PaymentIcon />, path: '/fees' },
  { text: 'Attendance', icon: <EventNoteIcon />, path: '/attendance' },
  { text: 'Exams', icon: <AssessmentIcon />, path: '/exams' },
  { text: 'Accounts', icon: <AccountBalanceIcon />, path: '/accounts' },
  { text: 'Donations', icon: <VolunteerActivismIcon />, path: '/donations' },
  { text: 'Salary', icon: <MoneyIcon />, path: '/salary' },
  { text: 'Vehicles', icon: <DirectionsBusIcon />, path: '/vehicles' }
];

function App() {
  return (
    <Router>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar position="fixed" sx={{ zIndex: 1201, backgroundColor: '#1a237e' }}>
          <Toolbar>
            <Typography variant="h6" noWrap>
              🕌 Minhajusunnah School ERP
            </Typography>
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" sx={{
          width: drawerWidth,
          '& .MuiDrawer-paper': { width: drawerWidth, marginTop: '64px' }
        }}>
          <List>
            {menuItems.map((item) => (
              <ListItem button component={Link} to={item.path} key={item.text}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
          </List>
        </Drawer>
        <Box component="main" sx={{ flexGrow: 1, p: 3, marginTop: '64px', marginLeft: `${drawerWidth}px` }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/students" element={<Students />} />
            <Route path="/staff" element={<Staff />} />
            <Route path="/fees" element={<Fees />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/exams" element={<Exams />} />
            <Route path="/accounts" element={<Accounts />} />
            <Route path="/donations" element={<Donations />} />
            <Route path="/salary" element={<Salary />} />
            <Route path="/vehicles" element={<Vehicles />} />
          </Routes>
        </Box>
      </Box>
    </Router>
  );
}

export default App;