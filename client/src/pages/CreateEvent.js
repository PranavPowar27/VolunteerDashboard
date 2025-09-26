import React, { useState } from 'react';
import { createEvent } from '../api/eventApi';
import { useNavigate } from 'react-router-dom';

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
      alert('Event created successfully!');
      navigate('/events');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create event');
    }
  };

  return (
    <div>
      <h2>Create New Event</h2>
      <form onSubmit={handleSubmit}>
        <input name="title" placeholder="Title" onChange={handleChange} required /><br />
        <textarea name="description" placeholder="Description" onChange={handleChange} /><br />
        <input name="date" type="date" onChange={handleChange} required /><br />
        <input name="location" placeholder="Location" onChange={handleChange} /><br />
        <input name="goalAmount" type="number" placeholder="Goal Amount" onChange={handleChange} required /><br />
        <button type="submit">Create Event</button>
      </form>
    </div>
  );
}

export default CreateEvent;