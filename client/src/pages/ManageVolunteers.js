import React, { useEffect, useState } from 'react';
import { fetchEvents } from '../api/eventApi';
import { getVolunteersForEvent, approveVolunteer } from '../api/volunteerApi';

function ManageVolunteers() {
  const [events, setEvents] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const data = await fetchEvents();
        setEvents(data || []);
      } catch (err) {
        console.error('Failed to fetch events:', err.message);
      }
    };
    loadEvents();
  }, []);

  useEffect(() => {
    const loadVolunteers = async () => {
      if (!selectedId) return;
      setLoading(true);
      try {
        const data = await getVolunteersForEvent(selectedId, token);
        setVolunteers(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to fetch volunteers:', err.message);
      } finally {
        setLoading(false);
      }
    };
    loadVolunteers();
  }, [selectedId, token]);

  const handleApprove = async (userId) => {
    try {
      await approveVolunteer(selectedId, userId, token);
      const updated = await getVolunteersForEvent(selectedId, token);
      setVolunteers(Array.isArray(updated) ? updated : []);
    } catch (err) {
      alert('Approval failed');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>👥 Manage Volunteers</h2>

      <select onChange={(e) => setSelectedId(e.target.value)} value={selectedId}>
        <option value="">Select an event</option>
        {events.map((event) => (
          <option key={event._id} value={event._id}>
            {event.title}
          </option>
        ))}
      </select>

      {selectedId && (
        <div style={{ marginTop: '1rem' }}>
          {loading ? (
            <p>Loading volunteers...</p>
          ) : volunteers.length === 0 ? (
            <p>No volunteer requests yet.</p>
          ) : (
            <ul>
              {volunteers.map((v, i) => {
                const user = v?.user;
                return (
                  <li key={v._id || i}>
                    {user?.name || 'Unknown'} ({user?.email || 'No email'}) —{' '}
                    <strong>{v.status}</strong>
                    {v.status === 'pending' && user?._id && (
                      <button
                        onClick={() => handleApprove(user._id)}
                        style={{ marginLeft: '1rem' }}
                      >
                        Approve
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export default ManageVolunteers;