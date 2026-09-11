import React, { useState } from 'react';
import {
  Box, Typography, Grid, Card, CardContent,
  Chip, Divider, Paper, Button, Dialog,
  DialogTitle, DialogContent, DialogActions,
  TextField, IconButton, Tabs, Tab
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import PersonIcon from '@mui/icons-material/Person';
import RouteIcon from '@mui/icons-material/Route';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const initialVehicles = [
  { id: 1, name: "Omni", number: "KL-00-0000", driver: "Anas", route: "Route 1", status: "Active", color: "#1565c0" },
  { id: 2, name: "Venture", number: "KL-00-0001", driver: "Driver 2", route: "Route 2", status: "Active", color: "#2e7d32" },
  { id: 3, name: "Qualis Green", number: "KL-00-0002", driver: "Rashid", route: "Route 3", status: "Active", color: "#6a1b9a" },
  { id: 4, name: "Qualis Blue", number: "KL-00-0003", driver: "Bilal", route: "Route 4", status: "Active", color: "#e65100" },
  { id: 5, name: "Mahindra", number: "KL-00-0004", driver: "Saleem", route: "Route 5", status: "Active", color: "#c62828" },
  { id: 6, name: "Auto Rickshaw", number: "KL-00-0005", driver: "Unassigned", route: "Route 6", status: "Standby", color: "#37474f" },
];

const initialRoutes = [
  { id: 1, name: "Route 1", stops: "Kuthuparamb, Kadirur, Chempad", vehicle: "Qualis Blue", students: 18 },
  { id: 2, name: "Route 2", stops: "Thalassery, Paral", vehicle: "Mahindra", students: 15 },
  { id: 3, name: "Route 3", stops: "Chendayad, Panoor, Elankode", vehicle: "Qualis Green", students: 20 },
  { id: 4, name: "Route 4", stops: "Kadavathur, Peringathur", vehicle: "Omini", students: 17 },
  { id: 5, name: "Route 5", stops: "Chokli, Kaviyoor, Koroth Road", vehicle: "Venture", students: 16 },
  { id: 6, name: "Route 6", stops: "Mahe, Chalakkara", vehicle: "Auto Rickshaw", students: 16 },
];

function Vehicles() {
  const [tab, setTab] = useState(0);
  const [vehicles, setVehicles] = useState(initialVehicles);
  const [routes, setRoutes] = useState(initialRoutes);

  const [openVehicle, setOpenVehicle] = useState(false);
  const [openRoute, setOpenRoute] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [editingRoute, setEditingRoute] = useState(null);

  const [vehicleForm, setVehicleForm] = useState({
    name: '', number: '', driver: '', route: '', status: 'Active', color: '#1565c0'
  });
  const [routeForm, setRouteForm] = useState({
    name: '', stops: '', vehicle: '', students: ''
  });

  // Vehicle handlers
  const handleEditVehicle = (v) => {
    setEditingVehicle(v);
    setVehicleForm(v);
    setOpenVehicle(true);
  };

  const handleAddVehicle = () => {
    setEditingVehicle(null);
    setVehicleForm({ name: '', number: '', driver: '', route: '', status: 'Active', color: '#1565c0' });
    setOpenVehicle(true);
  };

  const handleSaveVehicle = () => {
    if (editingVehicle) {
      setVehicles(vehicles.map(v => v.id === editingVehicle.id ? { ...vehicleForm, id: v.id } : v));
    } else {
      setVehicles([...vehicles, { ...vehicleForm, id: Date.now() }]);
    }
    setOpenVehicle(false);
  };

  const handleDeleteVehicle = (id) => {
    if (window.confirm('Delete this vehicle?')) {
      setVehicles(vehicles.filter(v => v.id !== id));
    }
  };

  // Route handlers
  const handleEditRoute = (r) => {
    setEditingRoute(r);
    setRouteForm(r);
    setOpenRoute(true);
  };

  const handleAddRoute = () => {
    setEditingRoute(null);
    setRouteForm({ name: '', stops: '', vehicle: '', students: '' });
    setOpenRoute(true);
  };

  const handleSaveRoute = () => {
    if (editingRoute) {
      setRoutes(routes.map(r => r.id === editingRoute.id ? { ...routeForm, id: r.id } : r));
    } else {
      setRoutes([...routes, { ...routeForm, id: Date.now() }]);
    }
    setOpenRoute(false);
  };

  const handleDeleteRoute = (id) => {
    if (window.confirm('Delete this route?')) {
      setRoutes(routes.filter(r => r.id !== id));
    }
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        🚌 Vehicles & Routes
      </Typography>

      {/* Stats */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Total Vehicles', value: vehicles.length, icon: '🚌', bg: '#1565c0' },
          { label: 'Active Routes', value: routes.length, icon: '🗺️', bg: '#2e7d32' },
          { label: 'Total Drivers', value: vehicles.filter(v => v.driver !== 'Unassigned').length, icon: '👨‍✈️', bg: '#6a1b9a' },
          { label: 'Students Transported', value: routes.reduce((a, r) => a + Number(r.students), 0), icon: '👨‍🎓', bg: '#c62828' },
        ].map((stat) => (
          <Grid item xs={6} md={3} key={stat.label}>
            <Card sx={{ bgcolor: stat.bg, color: 'white', borderRadius: 3 }}>
              <CardContent>
                <Typography fontSize={28}>{stat.icon}</Typography>
                <Typography variant="h4" fontWeight="bold">{stat.value}</Typography>
                <Typography variant="body2" sx={{ opacity: 0.85 }}>{stat.label}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Tabs */}
      <Tabs value={tab} onChange={(e, v) => setTab(v)} sx={{ mb: 3 }}>
        <Tab label="🚌 Vehicles" />
        <Tab label="🗺️ Routes" />
      </Tabs>

      {/* Vehicles Tab */}
      {tab === 0 && (
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6" fontWeight="bold">Fleet Management</Typography>
            <Button variant="contained" startIcon={<AddIcon />}
              onClick={handleAddVehicle}>
              Add Vehicle
            </Button>
          </Box>
          <Grid container spacing={2}>
            {vehicles.map((v) => (
              <Grid item xs={12} sm={6} md={4} key={v.id}>
                <Card sx={{
                  borderRadius: 3,
                  borderTop: `5px solid ${v.color}`,
                  boxShadow: 3,
                  '&:hover': { boxShadow: 6 },
                  transition: 'all 0.2s'
                }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="h6" fontWeight="bold">
                        🚌 {v.name}
                      </Typography>
                      <Box>
                        <IconButton size="small" color="primary"
                          onClick={() => handleEditVehicle(v)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" color="error"
                          onClick={() => handleDeleteVehicle(v.id)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>
                    <Chip label={v.status} size="small"
                      color={v.status === 'Active' ? 'success' : 'default'}
                      sx={{ mb: 1 }} />
                    <Divider sx={{ mb: 1.5 }} />
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                      <DirectionsBusIcon sx={{ color: v.color, mr: 1, fontSize: 18 }} />
                      <Typography variant="body2">{v.number}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                      <PersonIcon sx={{ color: v.color, mr: 1, fontSize: 18 }} />
                      <Typography variant="body2">{v.driver}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <RouteIcon sx={{ color: v.color, mr: 1, fontSize: 18 }} />
                      <Typography variant="body2">{v.route}</Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Routes Tab */}
      {tab === 1 && (
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6" fontWeight="bold">Route Management</Typography>
            <Button variant="contained" startIcon={<AddIcon />}
              onClick={handleAddRoute}>
              Add Route
            </Button>
          </Box>
          <Grid container spacing={2}>
            {routes.map((r) => (
              <Grid item xs={12} sm={6} md={4} key={r.id}>
                <Paper sx={{
                  p: 2, borderRadius: 3,
                  border: '1px solid #e0e0e0',
                  '&:hover': { boxShadow: 4 },
                  transition: 'all 0.2s'
                }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="h6" fontWeight="bold" color="#1a237e">
                      {r.name}
                    </Typography>
                    <Box>
                      <IconButton size="small" color="primary"
                        onClick={() => handleEditRoute(r)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" color="error"
                        onClick={() => handleDeleteRoute(r.id)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    🚌 {r.vehicle} | 👨‍🎓 {r.students} students
                  </Typography>
                  <Divider sx={{ mb: 1 }} />
                  {r.stops.split(',').map((stop, i) => (
                    <Box key={i} sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                      <LocationOnIcon sx={{ color: '#c62828', fontSize: 16, mr: 0.5 }} />
                      <Typography variant="body2">{stop.trim()}</Typography>
                    </Box>
                  ))}
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Vehicle Dialog */}
      <Dialog open={openVehicle} onClose={() => setOpenVehicle(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: '#1a237e', color: 'white' }}>
          {editingVehicle ? 'Edit Vehicle' : 'Add Vehicle'}
        </DialogTitle>
        <DialogContent>
          <TextField fullWidth label="Vehicle Name" margin="normal"
            value={vehicleForm.name}
            onChange={(e) => setVehicleForm({ ...vehicleForm, name: e.target.value })} />
          <TextField fullWidth label="Vehicle Number" margin="normal"
            value={vehicleForm.number}
            onChange={(e) => setVehicleForm({ ...vehicleForm, number: e.target.value })} />
          <TextField fullWidth label="Driver Name" margin="normal"
            value={vehicleForm.driver}
            onChange={(e) => setVehicleForm({ ...vehicleForm, driver: e.target.value })} />
          <TextField fullWidth label="Assigned Route" margin="normal"
            value={vehicleForm.route}
            onChange={(e) => setVehicleForm({ ...vehicleForm, route: e.target.value })} />
          <TextField fullWidth label="Status" margin="normal" select
            value={vehicleForm.status}
            onChange={(e) => setVehicleForm({ ...vehicleForm, status: e.target.value })}>
            {['Active', 'Standby', 'Maintenance'].map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenVehicle(false)}>Cancel</Button>
          <Button onClick={handleSaveVehicle} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>

      {/* Route Dialog */}
      <Dialog open={openRoute} onClose={() => setOpenRoute(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: '#1a237e', color: 'white' }}>
          {editingRoute ? 'Edit Route' : 'Add Route'}
        </DialogTitle>
        <DialogContent>
          <TextField fullWidth label="Route Name" margin="normal"
            value={routeForm.name}
            onChange={(e) => setRouteForm({ ...routeForm, name: e.target.value })} />
          <TextField fullWidth label="Stops (comma separated)" margin="normal"
            placeholder="e.g. Stop1, Stop2, Stop3"
            value={routeForm.stops}
            onChange={(e) => setRouteForm({ ...routeForm, stops: e.target.value })} />
          <TextField fullWidth label="Vehicle" margin="normal"
            value={routeForm.vehicle}
            onChange={(e) => setRouteForm({ ...routeForm, vehicle: e.target.value })} />
          <TextField fullWidth label="Number of Students" margin="normal" type="number"
            value={routeForm.students}
            onChange={(e) => setRouteForm({ ...routeForm, students: e.target.value })} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenRoute(false)}>Cancel</Button>
          <Button onClick={handleSaveRoute} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Vehicles;