import React, { useState } from 'react';
import { 
  Box, Card, CardContent, Typography, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Paper, Button, Grid, Divider, Chip
} from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';

export default function Exams() {
  // Hardcoded to display the client report structural card metrics for verification
  const [reportCard, setReportCard] = useState({
    studentName: "Aydin Zubair",
    rollNo: "1102",
    academicYear: "2024-2025",
    gradeClass: "U.K.G",
    subjects: [
      { name: "Qur'an", midterm: 50, annual: 45 },
      { name: "Maths", midterm: 43, annual: 49 },
      { name: "Islamic", midterm: 50, annual: 38 },
      { name: "G.K", midterm: 48, annual: 45 },
      { name: "Iqra + Kalimath", midterm: 50, annual: 43 }, // Combined evaluation matrix rule
      { name: "Malayalam", midterm: 41, annual: 34 },
      { name: "Seerah", midterm: 49, annual: 50 },
      { name: "English", midterm: 37, annual: 39 }
    ],
    attendance: {
      midterm: { schoolDays: 90, attended: 81, absent: 9 },
      annual: { schoolDays: 96, attended: 83, absent: 13 }
    }
  });

  const calculateSum = (key) => reportCard.subjects.reduce((acc, curr) => acc + curr[key], 0);

  const midtermTotal = calculateSum('midterm');
  const annualTotal = calculateSum('annual');

  return (
    <Box sx={{ p: 4, backgroundColor: '#f1f5f9', minHeight: '100vh', display: 'flex', flexDirection: 'column', gap: 3 }}>
      
      {/* Header Panel */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', '@media print': { display: 'none' } }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a' }}>Academic Progress Registry</Typography>
          <Typography variant="body2" color="textSecondary">Manage client transcript evaluations and printable mark registers</Typography>
        </Box>
        <Button 
          variant="contained" 
          startIcon={<PrintIcon />} 
          sx={{ background: '#0f172a', borderRadius: '8px', px: 3 }}
          onClick={() => window.print()}
        >
          Print Client Report Card
        </Button>
      </Box>

      {/* Modern High-Fidelity Printable Transcripts Sheet */}
      <Card sx={{ borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', backgroundColor: '#fff', p: 2 }}>
        <CardContent>
          {/* Institutional Brand Bar Component */}
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 900, color: '#0f172a', letterSpacing: '1px' }}>MINHAJUSSUNNAH</Typography>
            <Typography variant="caption" sx={{ color: '#0284c7', fontWeight: 700, letterSpacing: '2px' }}>ISLAMIC EDUCATION</Typography>
            <Typography variant="h6" sx={{ fontWeight: 700, mt: 1, letterSpacing: '0.5px' }}>REPORT CARD</Typography>
          </Box>

          {/* Student Profile Metadata Grid Matrix */}
          <Grid container spacing={2} sx={{ mb: 3, p: 2, backgroundColor: '#f8fafc', borderRadius: '12px' }}>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2"><strong>Name of Student:</strong> {reportCard.studentName}</Typography>
              <Typography variant="body2" sx={{ mt: 1 }}><strong>Academic Year:</strong> {reportCard.academicYear}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2"><strong>Roll No:</strong> {reportCard.rollNo}</Typography>
              <Typography variant="body2" sx={{ mt: 1 }}><strong>Grade / Class:</strong> {reportCard.gradeClass}</Typography>
            </Grid>
          </Grid>

          {/* Core Performance Table Sheet */}
          <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: '12px', overflow: 'hidden', mb: 3 }}>
            <Table size="small">
              <TableHead sx={{ backgroundColor: '#0f172a' }}>
                <TableRow>
                  <TableCell sx={{ color: '#fff', fontWeight: 700 }}>Subject Category</TableCell>
                  <TableCell sx={{ color: '#fff', fontWeight: 700, textAlign: 'center' }}>Mark (Midterm)</TableCell>
                  <TableCell sx={{ color: '#fff', fontWeight: 700, textAlign: 'center' }}>Status</TableCell>
                  <TableCell sx={{ color: '#fff', fontWeight: 700, textAlign: 'center' }}>Mark (Annual)</TableCell>
                  <TableCell sx={{ color: '#fff', fontWeight: 700, textAlign: 'center' }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reportCard.subjects.map((sub, idx) => (
                  <TableRow key={idx} hover>
                    <TableCell sx={{ fontWeight: 600, color: '#334155' }}>{sub.name}</TableCell>
                    <TableCell sx={{ textAlign: 'center', fontWeight: 700 }}>{sub.midterm}</TableCell>
                    <TableCell sx={{ textAlign: 'center' }}><Chip label="P" size="small" sx={{ bgcolor: '#e0f2fe', color: '#0369a1', fontWeight: 900, borderRadius: '4px' }}/></TableCell>
                    <TableCell sx={{ textAlign: 'center', fontWeight: 700 }}>{sub.annual}</TableCell>
                    <TableCell sx={{ textAlign: 'center' }}><Chip label="P" size="small" sx={{ bgcolor: '#e0f2fe', color: '#0369a1', fontWeight: 900, borderRadius: '4px' }}/></TableCell>
                  </TableRow>
                ))}
                {/* Aggregation Row Metrics Summary */}
                <TableRow sx={{ backgroundColor: '#f8fafc', '& td': { fontWeight: 800 } }}>
                  <TableCell>Total Marks Matrix</TableCell>
                  <TableCell sx={{ textAlign: 'center', color: '#0284c7' }}>{midtermTotal} / 400</TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>Rank: 5th</TableCell>
                  <TableCell sx={{ textAlign: 'center', color: '#0284c7' }}>{annualTotal} / 400</TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>Rank: 6th</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          {/* Attendance and Validation Panel Footers Grid */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#475569', mb: 1 }}>Attendance Logs</Typography>
              <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: '8px' }}>
                <Table size="small">
                  <TableHead sx={{ bgcolor: '#f1f5f9' }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700 }}>Metric</TableCell>
                      <TableCell sx={{ fontWeight: 700, textAlign: 'center' }}>Mid Term</TableCell>
                      <TableCell sx={{ fontWeight: 700, textAlign: 'center' }}>Annual</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow><TableCell>Working Operational Days</TableCell><TableCell sx={{ textAlign: 'center' }}>{reportCard.attendance.midterm.schoolDays}</TableCell><TableCell sx={{ textAlign: 'center' }}>{reportCard.attendance.annual.schoolDays}</TableCell></TableRow>
                    <TableRow><TableCell>Days of Presence</TableCell><TableCell sx={{ textAlign: 'center', color: '#16a34a', fontWeight: 700 }}>{reportCard.attendance.midterm.attended}</TableCell><TableCell sx={{ textAlign: 'center', color: '#16a34a', fontWeight: 700 }}>{reportCard.attendance.annual.attended}</TableCell></TableRow>
                    <TableRow><TableCell>Days of Absence Logs</TableCell><TableCell sx={{ textAlign: 'center', color: '#dc2626' }}>{reportCard.attendance.midterm.absent}</TableCell><TableCell sx={{ textAlign: 'center', color: '#dc2626' }}>{reportCard.attendance.annual.absent}</TableCell></TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>

            {/* Signature Verification Placeholders Section */}
            <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', gap: 2 }}>
              <Divider sx={{ borderStyle: 'dashed', my: 1 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', px: 2, pt: 2 }}>
                <Box sx={{ textAlign: 'center' }}><Box sx={{ height: '30px' }}/><Typography variant="caption" sx={{ borderTop: '1px solid #cbd5e1', pt: 0.5, px: 2, fontWeight: 600 }}>Class Teacher</Typography></Box>
                <Box sx={{ textAlign: 'center' }}><Box sx={{ height: '30px' }}/><Typography variant="caption" sx={{ borderTop: '1px solid #cbd5e1', pt: 0.5, px: 2, fontWeight: 600 }}>Parent Signature</Typography></Box>
                <Box sx={{ textAlign: 'center' }}><Box sx={{ height: '30px' }}/><Typography variant="caption" sx={{ borderTop: '1px solid #cbd5e1', pt: 0.5, px: 2, fontWeight: 600 }}>Principal Header</Typography></Box>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
}