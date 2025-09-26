import axios from 'axios';

export const fetchMyDonations = async (token) => {
  const res = await axios.get('/api/donations/my', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const createDonation = async (data, token) => {
  const res = await axios.post('/api/donations', data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
export const getMyDonations = async (token) => {
  const res = await axios.get('/api/donations/my', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
export const getAllDonations = async (token) => {
  const res = await axios.get('/api/donations/all', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
