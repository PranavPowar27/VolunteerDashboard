import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { fetchEvents } from '../api/eventApi';
import { requestVolunteer } from '../api/volunteerApi';

function EventCalendar() {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const data = await fetchEvents();
        setEvents(data);
      } catch (err) {
        alert('Failed to load events');
      }
    };
    loadEvents();
  }, []);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    const filtered = events.filter((e) => {
      const eventDate = new Date(e.date).toDateString();
      return eventDate === date.toDateString();
    });
    setFilteredEvents(filtered);
  };

  const handleRSVP = async (eventId) => {
    try {
      await requestVolunteer(eventId, token);
      alert('RSVP submitted! You’ve volunteered for this event.');
    } catch (err) {
      alert(err.response?.data?.message || 'RSVP failed');
    }
  };

  const tileContent = ({ date, view }) => {
    if (view !== 'month') return null;

    const dayEvents = events.filter(
      (e) => new Date(e.date).toDateString() === date.toDateString()
    );

    if (dayEvents.length === 0) return null;

    return (
      <div style={{ marginTop: '4px' }}>
        {dayEvents.map((e) => {
          const progress = (e.currentAmount / e.goalAmount) * 100;
          const color =
            progress >= 100 ? '🔴' : e.volunteers?.length ? '🔵' : '🟢';
          return <span key={e._id}>{color}</span>;
        })}
      </div>
    );
  };

  return (
    <div>
      <h2>Event Calendar</h2>
      <Calendar
        onChange={handleDateChange}
        value={selectedDate}
        tileContent={tileContent}
      />

      {selectedDate && (
        <div style={{ marginTop: '2rem' }}>
          <h3>Events on {selectedDate.toDateString()}</h3>
          {filteredEvents.length === 0 ? (
            <p>No events on this date.</p>
          ) : (
            <ul>
              {filteredEvents.map((e) => (
                <li
                  key={e._id}
                  style={{
                    marginBottom: '1rem',
                    padding: '1rem',
                    border: '1px solid #ccc',
                    borderRadius: '8px',
                  }}
                >
                  <h4>{e.title}</h4>
                  <p>{e.description}</p>
                  <p><strong>Location:</strong> {e.location}</p>
                  <p><strong>Goal:</strong> ₹{e.goalAmount}</p>
                  <p><strong>Raised:</strong> ₹{e.currentAmount}</p>
                  <button
                    onClick={() => handleRSVP(e._id)}
                    style={{
                      marginTop: '0.5rem',
                      background: '#2196f3',
                      color: '#fff',
                      border: 'none',
                      padding: '0.5rem 1rem',
                      borderRadius: '4px',
                      cursor: 'pointer',
                    }}
                  >
                    RSVP / Volunteer
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export default EventCalendar;