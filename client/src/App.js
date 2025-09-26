import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import EventList from './pages/EventList';
import Navbar from './components/Navbar';
import CreateEvent from './pages/CreateEvent';
import UpdateEvent from './pages/UpdateEvent';
import AdminDashboard from './pages/Admin/AdminDashboard';
import EventCalendar from './pages/EventCalendar';
import ThankYou from './pages/ThankYou';
import AdminDonations from './pages/Admin/AdminDonations';
import Home from './pages/Home';
import AnalyticsPage from './pages/AnalyticsPage';
import AdminUsers from './pages/Admin/AdminUsers';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function App() {
  const token = localStorage.getItem('token');

  return (<>
    <Router>
      <Navbar />
      <div className="container-fluid py-4">
        <Routes>
          {/* Default route: redirect based on login status */}
          <Route path="/" element={token ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />

          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/thank-you" element={<ThankYou />} />

          {/* Protected Routes */}
          <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/events" element={<ProtectedRoute><EventList /></ProtectedRoute>} />
          <Route path="/create-event" element={<ProtectedRoute><CreateEvent /></ProtectedRoute>} />
          <Route path="/update-event" element={<ProtectedRoute><UpdateEvent /></ProtectedRoute>} />
          <Route path="/event-calendar" element={<ProtectedRoute><EventCalendar /></ProtectedRoute>} />
          <Route path="/analytics" element={<ProtectedRoute><AnalyticsPage /></ProtectedRoute>} />

          {/* Admin Routes */}
          <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin-dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/donations" element={<ProtectedRoute><AdminDonations /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute><AdminUsers /></ProtectedRoute>} />

          {/* Optional: Fallback for unmatched routes */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
    <ToastContainer position="top-right" autoClose={1500} />

  </>
  );
}

export default App;