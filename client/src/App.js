import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import EventList from './pages/EventList';
import Navbar from './components/Navbar';
import CreateEvent from './pages/CreateEvent';
import UpdateEvent from './pages/UpdateEvent';
import AdminDashboard from './pages/Admin/AdminDashboard';
import ManageVolunteers from './pages/ManageVolunteers';
import VolunteerDashboard from './pages/VolunteerDashboard';
import EventCalendar from './pages/EventCalendar';
import ThankYou from './pages/ThankYou';
import AdminDonations from './pages/Admin/AdminDonations';
import Home from './pages/Home';
import AnalyticsPage from './pages/AnalyticsPage';
import AdminUsers from './pages/Admin/AdminUsers';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes */}
        <Route path="/events" element={<ProtectedRoute><EventList /></ProtectedRoute>} />
        <Route path="/create-event" element={<ProtectedRoute><CreateEvent /></ProtectedRoute>} />
        <Route path="/update-event" element={<ProtectedRoute><UpdateEvent /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/volunteer-dashboard" element={<ProtectedRoute><VolunteerDashboard /></ProtectedRoute>} />
        <Route path="/event-calendar" element={<ProtectedRoute><EventCalendar /></ProtectedRoute>} />
        <Route path="/manage-volunteers" element={<ProtectedRoute><ManageVolunteers /></ProtectedRoute>} />
        <Route path="/analytics" element={<ProtectedRoute><AnalyticsPage /></ProtectedRoute>} />

        {/* Admin Routes */}
        <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} /> {/* ✅ Added */}
        <Route path="/admin-dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/donations" element={<ProtectedRoute><AdminDonations /></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute><AdminUsers /></ProtectedRoute>} />

        {/* Public Routes */}
        <Route path="/thank-you" element={<ThankYou />} />
        <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;