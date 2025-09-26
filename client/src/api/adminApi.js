import axios from 'axios';

export const getDonationStats = async (token) => {
  const res = await axios.get('/api/admin/stats/donations', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const getVolunteerStats = async (token) => {
  const res = await axios.get('/api/admin/stats/volunteers', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const getFundingStats = async (token) => {
  const res = await axios.get('/api/admin/stats/funding', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const getAdminStats = async (token) => {
  const res = await axios.get('/api/admin/stats', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const getSummaryStats = async (token) => {
  const res = await axios.get('/api/admin/stats/summary', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const getAllUsers = async (token) => {
  const res = await axios.get('/api/admin/users', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};


export const deleteUser = async (userId, token) => {
  const res = await fetch(`/api/admin/users/${userId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Delete failed');
  }

  return true;
};