import React, { useEffect, useState } from 'react';
import {
  getMyVolunteerEvents,
  cancelVolunteerRequest,
  getVolunteerBadge,
} from '../api/volunteerApi';

function VolunteerDashboard() {
  const [events, setEvents] = useState([]);
  const [badge, setBadge] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getMyVolunteerEvents(token);
        const badgeData = await getVolunteerBadge(token);
        setEvents(data);
        setBadge(`${badgeData.badge} (${badgeData.count} events)`);
      } catch (err) {
        alert('Failed to load volunteer data');
      }
    };
    load();
  }, [token]);

  const handleCancel = async (eventId) => {
    try {
      await cancelVolunteerRequest(eventId, token);
      const updated = await getMyVolunteerEvents(token);
      setEvents(updated);
      const badgeData = await getVolunteerBadge(token);
      setBadge(`${badgeData.badge} (${badgeData.count} events)`);
      alert('Volunteer request cancelled');
    } catch (err) {
      alert(err.response?.data?.message || 'Cancel failed');
    }
  };

  return (
    <div>
      <h2>My Volunteer Events</h2>
      <p><strong>Badge:</strong> 🏅 {badge}</p>

      {events.length === 0 ? (
        <p>You haven’t signed up for any events yet.</p>
      ) : (
        <ul>
          {events.map((e) => (
            <li
              key={e._id}
              style={{
                marginBottom: '1.5rem',
                padding: '1rem',
                border: '1px solid #ccc',
                borderRadius: '8px',
              }}
            >
              <h3>{e.title}</h3>
              <p>
                <strong>Date:</strong>{' '}
                {new Date(e.date).toLocaleDateString()}
              </p>
              <p><strong>Location:</strong> {e.location}</p>
              <p>
                <strong>Status:</strong>{' '}
                <span
                  style={{
                    color: e.status === 'approved' ? 'green' : 'orange',
                  }}
                >
                  {e.status}
                </span>
              </p>
              <p>
                <strong>Funding:</strong> ₹{e.currentAmount} / ₹{e.goalAmount}
              </p>
              <div
                style={{
                  background: '#eee',
                  height: '10px',
                  width: '100%',
                  borderRadius: '5px',
                }}
              >
                <div
                  style={{
                    width: `${Math.min(
                      (e.currentAmount / e.goalAmount) * 100,
                      100
                    )}%`,
                    background: '#4caf50',
                    height: '100%',
                    borderRadius: '5px',
                  }}
                />
              </div>

              {e.status === 'pending' && (
                <button
                  onClick={() => handleCancel(e._id)}
                  style={{
                    marginTop: '0.75rem',
                    background: '#f44336',
                    color: '#fff',
                    border: 'none',
                    padding: '0.5rem 1rem',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  Cancel Request
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default VolunteerDashboard;