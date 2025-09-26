import React, { useEffect, useState } from 'react';
import { fetchEvents, updateEvent } from '../api/eventApi';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

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
        toast.error('Failed to load events');
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
      toast.success('✅ Event updated successfully!');
      navigate('/events');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    }
  };

  return (
    <div className="container py-4">
      <h4 className="mb-4">🛠️ Update Event</h4>
      <div className="mb-3">
        <select
          className="form-select"
          onChange={(e) => setSelectedId(e.target.value)}
          value={selectedId}
        >
          <option value="">Select an event</option>
          {events.map((event) => (
            <option key={event._id} value={event._id}>
              {event.title}
            </option>
          ))}
        </select>
      </div>

      {selectedId && (
        <form onSubmit={handleSubmit} className="card p-4 shadow-sm">
          <div className="mb-3">
            <label className="form-label">Title</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              className="form-control"
              placeholder="Title"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="form-control"
              placeholder="Description"
              rows="3"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Date</label>
            <input
              name="date"
              type="date"
              value={form.date}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Location</label>
            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              className="form-control"
              placeholder="Location"
            />
          </div>

          <div className="mb-4">
            <label className="form-label">Goal Amount (₹)</label>
            <input
              name="goalAmount"
              type="number"
              value={form.goalAmount}
              onChange={handleChange}
              className="form-control"
              placeholder="Goal Amount"
              required
            />
          </div>

          <button type="submit" className="btn btn-warning w-100">
            Update Event
          </button>
        </form>
      )}
    </div>
  );
}

export default UpdateEvent;