import React, { useState } from 'react';
import { createEvent } from '../api/eventApi';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function CreateEvent() {
  const [form, setForm] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    goalAmount: '',
  });

  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createEvent(form, token);
      toast.success('🎉 Event created successfully!');
      navigate('/events');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create event');
    }
  };

  return (
    <div className="container py-4">
      <div className="card shadow-sm mx-auto" style={{ maxWidth: '600px' }}>
        <div className="card-body">
          <h4 className="card-title mb-4 text-primary">🎉 Create New Event</h4>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Title</label>
              <input
                name="title"
                type="text"
                className="form-control"
                placeholder="Event title"
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Description</label>
              <textarea
                name="description"
                className="form-control"
                placeholder="Event description"
                rows="3"
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Date</label>
              <input
                name="date"
                type="date"
                className="form-control"
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Location</label>
              <input
                name="location"
                type="text"
                className="form-control"
                placeholder="Event location"
                onChange={handleChange}
              />
            </div>

            <div className="mb-4">
              <label className="form-label">Goal Amount (₹)</label>
              <input
                name="goalAmount"
                type="number"
                className="form-control"
                placeholder="Target donation amount"
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="btn btn-success w-100">
              ✅ Create Event
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateEvent;