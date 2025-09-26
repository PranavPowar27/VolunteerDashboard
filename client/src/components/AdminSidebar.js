import React from 'react';
import { Link } from 'react-router-dom';
import './AdminSidebar.css'; // You can still use this for custom tweaks

function AdminSidebar() {
  return (
    <div className="bg-light border-end vh-100 position-fixed" style={{ width: '220px' }}>
      <div className="p-3">
        <h4 className="text-primary mb-4">Admin Panel</h4>
        <ul className="nav flex-column">
          <li className="nav-item mb-2">
            <Link to="/admin" className="nav-link text-dark">
              🧭 Dashboard
            </Link>
          </li>
          <li className="nav-item mb-2">
            <Link to="/admin/donations" className="nav-link text-dark">
              💰 Donations
            </Link>
          </li>
          <li className="nav-item mb-2">
            <Link to="/admin/events" className="nav-link text-dark">
              📅 Events
            </Link>
          </li>
          <li className="nav-item mb-2">
            <Link to="/admin/users" className="nav-link text-dark">
              👥 Users
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default AdminSidebar;