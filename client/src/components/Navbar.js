import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <nav style={styles.nav}>
      {!user ? (
        <span style={styles.brand}>Volunteer Donation Manager</span>
      ) : (
        <>
          <Link to="/" style={styles.link}>Home</Link>
          <Link to="/dashboard" style={styles.link}>Dashboard</Link>
          <Link to="/events" style={styles.link}>Events</Link>

          {user.role === 'volunteer' && (
            <>
              <Link to="/volunteer-dashboard" style={styles.link}>Volunteer Dashboard</Link>
              <Link to="/badges" style={styles.link}>Badges</Link>
              <Link to="/calendar" style={styles.link}>Calendar</Link>
              <Link to="/rsvp" style={styles.link}>RSVP</Link>
              <Link to="/feedback" style={styles.link}>Feedback</Link>
            </>
          )}

          {user.role === 'admin' && (
            <>
              <Link to="/create-event" style={styles.link}>Create Event</Link>
              <Link to="/update-event" style={styles.link}>Update Event</Link>
              <Link to="/admin" style={styles.link}>Admin Dashboard</Link>
              <Link to="/admin/users" style={styles.link}>Manage Users</Link>
            </>
          )}
        </>
      )}

      {!user ? (
        <Link to="/login" style={{ ...styles.link, marginLeft: 'auto' }}>Login</Link>
      ) : (
        <button onClick={handleLogout} style={styles.button}>Logout</button>
      )}
    </nav>
  );
}

const styles = {
  nav: {
    display: 'flex',
    gap: '1rem',
    padding: '1rem',
    background: '#f0f0f0',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  link: {
    textDecoration: 'none',
    color: '#333',
    fontWeight: 'bold',
  },
  brand: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    color: '#1976d2',
  },
  button: {
    marginLeft: 'auto',
    padding: '0.5rem 1rem',
    background: '#d9534f',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
  },
};

export default Navbar;