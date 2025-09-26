import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function Navbar() {
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light px-3">
      <div className="container-fluid">
        <Link className="navbar-brand text-primary fw-bold" to="/">
          Donation Manager
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          {user && (
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link" to="/dashboard">Dashboard</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/events">Events</Link>
              </li>

              {user.role === 'volunteer' && (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/volunteer-dashboard">Volunteer Dashboard</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/badges">Badges</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/calendar">Calendar</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/rsvp">RSVP</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/feedback">Feedback</Link>
                  </li>
                </>
              )}

              {user.role === 'admin' && (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/create-event">Create Event</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/update-event">Update Event</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/admin">Admin Dashboard</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/admin/users">Users</Link>
                  </li>
                </>
              )}
            </ul>
          )}

          <div className="d-flex">
            {!user ? (
              <Link className="btn btn-outline-primary" to="/login">Login</Link>
            ) : (
              <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;