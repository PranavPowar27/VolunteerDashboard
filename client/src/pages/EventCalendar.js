import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { fetchEvents } from '../api/eventApi';
import { requestVolunteer } from '../api/volunteerApi';
import { toast } from 'react-toastify';

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
        toast.error('Failed to load events');
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
      toast.success('🎉 RSVP submitted! You’ve volunteered for this event.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'RSVP failed');
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
    <div className="container py-4">
      <h4 className="mb-4">📅 Event Calendar</h4>
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <Calendar
            onChange={handleDateChange}
            value={selectedDate}
            tileContent={tileContent}
          />
        </div>
      </div>

      {selectedDate && (
        <div>
          <h5 className="mb-3">Events on {selectedDate.toDateString()}</h5>
          {filteredEvents.length === 0 ? (
            <div className="alert alert-warning">No events on this date.</div>
          ) : (
            <div className="row g-3">
              {filteredEvents.map((e) => (
                <div className="col-md-6" key={e._id}>
                  <div className="card shadow-sm h-100">
                    <div className="card-body">
                      <h6 className="card-title">{e.title}</h6>
                      <p className="text-muted">{e.description}</p>
                      <ul className="list-unstyled small mb-2">
                        <li><strong>Location:</strong> {e.location}</li>
                        <li><strong>Goal:</strong> ₹{e.goalAmount}</li>
                        <li><strong>Raised:</strong> ₹{e.currentAmount}</li>
                      </ul>
                      <button
                        onClick={() => handleRSVP(e._id)}
                        className="btn btn-primary btn-sm"
                      >
                        RSVP / Volunteer
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default EventCalendar;