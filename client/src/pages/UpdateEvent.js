import React, { useEffect, useState } from 'react';
import { fetchEvents, updateEvent } from '../api/eventApi';
import { useNavigate } from 'react-router-dom';

function UpdateEvent() {
  const [events, setEvents] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [form, setForm] = useState({});
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

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

  useEffect(() => {
    if (!selectedId) return;
    const selected = events.find((e) => e._id === selectedId);
    if (selected) {
      setForm({
        title: selected.title,
        description: selected.description,
        date: selected.date?.slice(0, 10),
        location: selected.location,
        goalAmount: selected.goalAmount,
      });
    }
  }, [selectedId, events]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateEvent(selectedId, form, token);
      alert('Event updated successfully!');
      navigate('/events');
    } catch (err) {
      alert(err.response?.data?.message || 'Update failed');
    }
  };

  return (
    <div>
      <h2>Update Event</h2>
      <select onChange={(e) => setSelectedId(e.target.value)} value={selectedId}>
        <option value="">Select an event</option>
        {events.map((event) => (
          <option key={event._id} value={event._id}>
            {event.title}
          </option>
        ))}
      </select>

      {selectedId && (
        <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Title"
            required
          /><br />
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
          /><br />
          <input
            name="date"
            type="date"
            value={form.date}
            onChange={handleChange}
            required
          /><br />
          <input
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="Location"
          /><br />
          <input
            name="goalAmount"
            type="number"
            value={form.goalAmount}
            onChange={handleChange}
            placeholder="Goal Amount"
            required
          /><br />
          <button type="submit">Update Event</button>
        </form>
      )}
    </div>
  );
}

export default UpdateEvent;