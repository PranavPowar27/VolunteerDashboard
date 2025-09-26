import React, { useEffect, useState } from 'react';
import { fetchEvents } from '../api/eventApi';
import { requestVolunteer } from '../api/volunteerApi';
import { useNavigate } from 'react-router-dom';

function EventList() {
  const [events, setEvents] = useState([]);
  const [donationInputs, setDonationInputs] = useState({});
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const data = await fetchEvents();
        setEvents(data);
      } catch (err) {
        alert('Error loading events');
      }
    };
    loadEvents();
  }, []);

  const handleInputChange = (e, eventId) => {
    setDonationInputs({
      ...donationInputs,
      [eventId]: {
        ...donationInputs[eventId],
        [e.target.name]: e.target.value,
      },
    });
  };

  const handleDonate = async (eventId) => {
    const input = donationInputs[eventId];
    if (!input || !input.amount || !input.method) {
      alert('Please fill in all donation fields');
      return;
    }

    try {
      const res = await fetch('/api/donations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: Number(input.amount),
          method: input.method,
          message: input.message || '',
          event: eventId,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Donation failed');
      }

      alert('Donation successful!');
      navigate('/thank-you');
    } catch (err) {
      alert(err.message);
    }
  };

  const handleVolunteer = async (eventId) => {
  try {
    await requestVolunteer(eventId, token);
    alert('Volunteer request submitted!');
    // Optionally refresh events or update local state
  } catch (err) {
    alert(err.response?.data?.message || 'Volunteer request failed');
  }
};

  return (
    <div>
      <h2>All Events</h2>
      {events.length === 0 ? (
        <p>No events found.</p>
      ) : (
        <ul>
          {events.map((event) => {
            const progress = Math.min(
              (event.currentAmount / event.goalAmount) * 100,
              100
            );

            return (
              <li key={event._id} style={{ marginBottom: '2rem' }}>
                <h3>{event.title}</h3>
                <p>{event.description}</p>
                <p>Date: {new Date(event.date).toLocaleDateString()}</p>
                <p>Goal: ₹{event.goalAmount}</p>
                <p>Raised: ₹{event.currentAmount}</p>

                <div style={{ background: '#eee', height: '10px', width: '100%', borderRadius: '5px' }}>
                  <div
                    style={{
                      width: `${progress}%`,
                      background: '#4caf50',
                      height: '100%',
                      borderRadius: '5px',
                    }}
                  />
                </div>
                <p>{Math.floor(progress)}% funded</p>

                {progress >= 100 ? (
                  <p style={{ color: 'green', fontWeight: 'bold' }}>🎉 Fully Funded!</p>
                ) : (
                  <div style={{ marginTop: '1rem' }}>
                    <input
                      type="number"
                      name="amount"
                      placeholder="Amount"
                      onChange={(e) => handleInputChange(e, event._id)}
                    />
                    <select
                      name="method"
                      onChange={(e) => handleInputChange(e, event._id)}
                    >
                      <option value="">Select Method</option>
                      <option value="UPI">UPI</option>
                      <option value="Card">Card</option>
                      <option value="Cash">Cash</option>
                    </select>
                    <input
                      type="text"
                      name="message"
                      placeholder="Message (optional)"
                      onChange={(e) => handleInputChange(e, event._id)}
                    />
                    <button onClick={() => handleDonate(event._id)}>Donate</button>
                  </div>
                )}

                <button onClick={() => handleVolunteer(event._id)} style={{ marginTop: '0.5rem' }}>
                  Volunteer
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default EventList;