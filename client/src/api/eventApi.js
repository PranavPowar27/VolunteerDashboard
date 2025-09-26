import axios from 'axios';

export const createEvent = async (data, token) => {
  const res = await axios.post('/api/events', data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const fetchEvents = async () => {
  const res = await axios.get('/api/events');
  return res.data;
};

export const updateEvent = async (id, data, token) => {
  const res = await axios.put(`/api/events/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};