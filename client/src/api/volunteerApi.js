import axios from 'axios';

export const requestVolunteer = async (eventId, token) => {
  const res = await axios.post(`/api/events/${eventId}/volunteer`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const approveVolunteer = async (eventId, userId, token) => {
  const res = await axios.put(`/api/events/${eventId}/approve/${userId}`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const getVolunteersForEvent = async (eventId, token) => {
  const res = await axios.get(`/api/events/${eventId}/volunteers`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
export const getMyVolunteerEvents = async (token) => {
  const res = await axios.get('/api/events/my-volunteer-events', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
export const cancelVolunteerRequest = async (eventId, token) => {
  const res = await axios.delete(`/api/events/${eventId}/volunteer`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
export const getVolunteerBadge = async (token) => {
  const res = await axios.get('/api/events/my-volunteer-badge', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};