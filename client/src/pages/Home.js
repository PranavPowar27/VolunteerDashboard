import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

function Home() {
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!user) {
      toast.warning('Please log in to access the home page');
    }
  }, [user]);

  if (!user) return (
    <div className="container mt-5">
      <div className="alert alert-warning">Please log in to access the home page.</div>
    </div>
  );

  return (
    <div className="container mt-5">
      <div className="card p-4 shadow-sm">
        <h2 className="mb-3">Welcome, {user.name} 👋</h2>
        <p>Your role: <strong>{user.role}</strong></p>

        <div className="mt-4">
          {user.role === 'admin' && (
            <div className="mb-3">
              <Link to="/admin-dashboard" className="btn btn-outline-primary mb-2 w-100">📊 Admin Dashboard</Link>
              <Link to="/create-event" className="btn btn-outline-success mb-2 w-100">✍️ Create Event</Link>
              <Link to="/update-event" className="btn btn-outline-warning mb-2 w-100">🛠️ Update Event</Link>
              <Link to="/admin/donations" className="btn btn-outline-info mb-2 w-100">💰 Manage Donations</Link>
            </div>
          )}

          {user.role === 'volunteer' && (
            <div className="mb-3">
              <Link to="/event-calendar" className="btn btn-outline-success mb-2 w-100">📆 Event Calendar</Link>
              <Link to="/rsvp" className="btn btn-outline-info mb-2 w-100">📥 RSVP</Link>
              <Link to="/badges" className="btn btn-outline-warning mb-2 w-100">🏅 Badges</Link>
              <Link to="/feedback" className="btn btn-outline-secondary mb-2 w-100">📝 Feedback</Link>
            </div>
          )}

          <Link to="/events" className="btn btn-dark mb-2 w-100">📅 View All Events</Link>
          <Link to="/dashboard" className="btn btn-dark w-100">🧭 General Dashboard</Link>
        </div>
      </div>
    </div>
  );
}

export default Home;