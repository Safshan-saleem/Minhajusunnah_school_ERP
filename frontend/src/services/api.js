import axios from 'axios';

const API = axios.create({
  baseURL: 'http://127.0.0.1:8000',
  headers: {
    'Content-Type': 'application/json',
  }
});

// Students
export const getStudents = () => API.get('/students/');
export const getStudent = (id) => API.get(`/students/${id}`);
export const createStudent = (data) => API.post('/students/', data);
export const updateStudent = (id, data) => API.put(`/students/${id}`, data);
export const deleteStudent = (id) => API.delete(`/students/${id}`);

// Staff
export const getStaff = () => API.get('/staff/');
export const getStaffMember = (id) => API.get(`/staff/${id}`);
export const createStaff = (data) => API.post('/staff/', data);
export const updateStaff = (id, data) => API.put(`/staff/${id}`, data);
export const deleteStaff = (id) => API.delete(`/staff/${id}`);

// Vehicles
export const getVehicles = () => API.get('/vehicles/');
export const createVehicle = (data) => API.post('/vehicles/', data);
export const updateVehicle = (id, data) => API.put(`/vehicles/${id}`, data);
export const deleteVehicle = (id) => API.delete(`/vehicles/${id}`);

// Routes
export const getRoutes = () => API.get('/routes/');
export const createRoute = (data) => API.post('/routes/', data);
export const updateRoute = (id, data) => API.put(`/routes/${id}`, data);
export const deleteRoute = (id) => API.delete(`/routes/${id}`);

// Fees
export const getFees = () => API.get('/fees/');
export const createFee = (data) => API.post('/fees/', data);
export const updateFee = (id, data) => API.put(`/fees/${id}`, data);
export const getPendingFees = () => API.get('/fees/', { params: { status: 'pending' } });

// Payments (under fees)
export const getPayments = () => API.get('/fees/payments/');
export const recordPayment = (data) => API.post('/fees/payments/', data);
export const getReceiptPdfUrl = (paymentId) =>
  `http://127.0.0.1:8000/fees/payments/${paymentId}/receipt-pdf`;

// Attendance
export const markStudentAttendance = (data) => API.post('/attendance/students/', data);
export const getStudentAttendance = (params) => API.get('/attendance/students/', { params });
export const markTeacherAttendance = (data) => API.post('/attendance/staff/', data);
export const getTeacherAttendance = (params) => API.get('/attendance/staff/', { params });

// Exams
export const getExams = () => API.get('/exams/');
export const createExam = (data) => API.post('/exams/', data);
export const updateExam = (id, data) => API.put(`/exams/${id}`, data);
export const deleteExam = (id) => API.delete(`/exams/${id}`);
export const getMarks = (params) => API.get('/exams/marks/', { params });
export const addMarks = (data) => API.post('/exams/marks/', data);

// Accounts
export const getAllEntries = (params) => API.get('/accounts/', { params });
export const createEntry = (data) => API.post('/accounts/', data);
export const updateEntry = (id, data) => API.put(`/accounts/${id}`, data);
export const deleteEntry = (id) => API.delete(`/accounts/${id}`);
export const getVouchers = () => API.get('/accounts/vouchers/');
export const createVoucher = (data) => API.post('/accounts/vouchers/', data);
export const getAccountsSummary = (year) => API.get('/accounts/summary/', { params: { year } });

// Salary
export const getSalaries = (params) => API.get('/salary/', { params });
export const paySalary = (data) => API.post('/salary/', data);
export const updateSalary = (id, data) => API.put(`/salary/${id}`, data);
export const deleteSalary = (id) => API.delete(`/salary/${id}`);
export const getSalarySummary = (params) => API.get('/salary/summary/', { params });

// Donations
export const getDonations = (params) => API.get('/donations/', { params });
export const createDonation = (data) => API.post('/donations/', data);
export const updateDonation = (id, data) => API.put(`/donations/${id}`, data);
export const deleteDonation = (id) => API.delete(`/donations/${id}`);
export const getDonationsSummary = () => API.get('/donations/summary/');

export default API;