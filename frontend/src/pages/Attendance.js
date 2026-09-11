import React, { useState } from 'react';
import {
  Box, Typography, Button, Table, TableBody,
  TableCell, TableHead, TableRow, Paper,
  TextField, Dialog, DialogTitle, DialogContent,
  DialogActions, TableContainer, MenuItem,
  Grid, Tabs, Tab
} from '@mui/material';
import { markStudentAttendance, markTeacherAttendance } from '../services/api';

function Attendance() {
  const [tab, setTab] = useState(0);
  const [studentForm, setStudentForm] = useState({
    student_id: '', date: '', status: '', class_id: ''
  });
  const [teacherForm, setTeacherForm] = useState({
    staff_id: '', date: '', status: '',
    time_in: '', time_out: ''
  });
  const [openStudent, setOpenStudent] = useState(false);
  const [openTeacher, setOpenTeacher] = useState(false);

  const handleStudentAttendance = async () => {
    try {
      await markStudentAttendance(studentForm);
      setOpenStudent(false);
      setStudentForm({ student_id: '', date: '', status: '', class_id: '' });
      alert('Student attendance marked!');
    } catch (err) {
      console.log(err);
    }
  };

  const handleTeacherAttendance = async () => {
    try {
      await markTeacherAttendance(teacherForm);
      setOpenTeacher(false);
      setTeacherForm({ staff_id: '', date: '', status: '', time_in: '', time_out: '' });
      alert('Teacher attendance marked!');
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Attendance</Typography>

      <Tabs value={tab} onChange={(e, v) => setTab(v)} sx={{ mb: 3 }}>
        <Tab label="Student Attendance" />
        <Tab label="Teacher Attendance" />
      </Tabs>

      {/* Student Attendance Tab */}
      {tab === 0 && (
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6">Student Attendance</Typography>
            <Button variant="contained" onClick={() => setOpenStudent(true)}>
              + Mark Attendance
            </Button>
          </Box>

          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 2, bgcolor: '#e8f5e9', textAlign: 'center' }}>
                <Typography variant="h6">Present</Typography>
                <Typography variant="h3" color="success.main">0</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 2, bgcolor: '#ffebee', textAlign: 'center' }}>
                <Typography variant="h6">Absent</Typography>
                <Typography variant="h3" color="error.main">0</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 2, bgcolor: '#fff8e1', textAlign: 'center' }}>
                <Typography variant="h6">Total Students</Typography>
                <Typography variant="h3" color="warning.main">102</Typography>
              </Paper>
            </Grid>
          </Grid>

          <TableContainer component={Paper}>
            <Table>
              <TableHead sx={{ bgcolor: '#1a237e' }}>
                <TableRow>
                  <TableCell sx={{ color: 'white' }}>Student ID</TableCell>
                  <TableCell sx={{ color: 'white' }}>Class</TableCell>
                  <TableCell sx={{ color: 'white' }}>Date</TableCell>
                  <TableCell sx={{ color: 'white' }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    Mark attendance to see records
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {/* Teacher Attendance Tab */}
      {tab === 1 && (
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6">Teacher Attendance</Typography>
            <Button variant="contained" onClick={() => setOpenTeacher(true)}>
              + Mark Attendance
            </Button>
          </Box>

          <TableContainer component={Paper}>
            <Table>
              <TableHead sx={{ bgcolor: '#1a237e' }}>
                <TableRow>
                  <TableCell sx={{ color: 'white' }}>Staff ID</TableCell>
                  <TableCell sx={{ color: 'white' }}>Date</TableCell>
                  <TableCell sx={{ color: 'white' }}>Time In</TableCell>
                  <TableCell sx={{ color: 'white' }}>Time Out</TableCell>
                  <TableCell sx={{ color: 'white' }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    Mark attendance to see records
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {/* Student Attendance Dialog */}
      <Dialog open={openStudent} onClose={() => setOpenStudent(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Mark Student Attendance</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="Student ID" margin="normal" type="number"
            value={studentForm.student_id}
            onChange={(e) => setStudentForm({ ...studentForm, student_id: e.target.value })} />
          <TextField fullWidth label="Class ID" margin="normal" type="number"
            value={studentForm.class_id}
            onChange={(e) => setStudentForm({ ...studentForm, class_id: e.target.value })} />
          <TextField fullWidth label="Date (YYYY-MM-DD)" margin="normal"
            placeholder="e.g. 2026-06-27"
            value={studentForm.date}
            onChange={(e) => setStudentForm({ ...studentForm, date: e.target.value })} />
          <TextField fullWidth select label="Status" margin="normal"
            value={studentForm.status}
            onChange={(e) => setStudentForm({ ...studentForm, status: e.target.value })}>
            <MenuItem value="present">Present</MenuItem>
            <MenuItem value="absent">Absent</MenuItem>
            <MenuItem value="late">Late</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenStudent(false)}>Cancel</Button>
          <Button onClick={handleStudentAttendance} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>

      {/* Teacher Attendance Dialog */}
      <Dialog open={openTeacher} onClose={() => setOpenTeacher(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Mark Teacher Attendance</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="Staff ID" margin="normal" type="number"
            value={teacherForm.staff_id}
            onChange={(e) => setTeacherForm({ ...teacherForm, staff_id: e.target.value })} />
          <TextField fullWidth label="Date (YYYY-MM-DD)" margin="normal"
            placeholder="e.g. 2026-06-27"
            value={teacherForm.date}
            onChange={(e) => setTeacherForm({ ...teacherForm, date: e.target.value })} />
          <TextField fullWidth label="Time In (HH:MM)" margin="normal"
            placeholder="e.g. 07:25"
            value={teacherForm.time_in}
            onChange={(e) => setTeacherForm({ ...teacherForm, time_in: e.target.value })} />
          <TextField fullWidth label="Time Out (HH:MM)" margin="normal"
            placeholder="e.g. 13:30"
            value={teacherForm.time_out}
            onChange={(e) => setTeacherForm({ ...teacherForm, time_out: e.target.value })} />
          <TextField fullWidth select label="Status" margin="normal"
            value={teacherForm.status}
            onChange={(e) => setTeacherForm({ ...teacherForm, status: e.target.value })}>
            <MenuItem value="present">Present</MenuItem>
            <MenuItem value="absent">Absent</MenuItem>
            <MenuItem value="late">Late</MenuItem>
            <MenuItem value="leave">On Leave</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenTeacher(false)}>Cancel</Button>
          <Button onClick={handleTeacherAttendance} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Attendance;