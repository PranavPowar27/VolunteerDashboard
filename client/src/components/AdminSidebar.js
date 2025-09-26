import React from 'react';
import { Link } from 'react-router-dom';
import './AdminSidebar.css';

function AdminSidebar() {
  return (
    <div className="admin-sidebar">
      <h3>Admin Panel</h3>
      <ul>
        <li><Link to="/admin">Dashboard</Link></li>
        <li><Link to="/admin/donations">Donations</Link></li>
        <li><Link to="/admin/events">Events</Link></li>
        <li><Link to="/admin/users">Users</Link></li>
      </ul>
    </div>
  );
}

export default AdminSidebar;