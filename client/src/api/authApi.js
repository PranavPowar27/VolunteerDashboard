import axios from 'axios';

// Unified base URL for all auth-related requests
const API = axios.create({
  baseURL: '/api/auth',
});

// Signup request
export const signupUser = async (data) => {
  const res = await API.post('/signup', data);
  return res.data;
};

// Login request
export const loginUser = async (credentials) => {
  const res = await API.post('/login', credentials);

  // ✅ Store user info in localStorage
  const { user, token } = res.data;
  localStorage.setItem('user', JSON.stringify(user));
  localStorage.setItem('token', token);
  localStorage.setItem('userId', user._id);

  return res.data;
};

// Optional: Register endpoint (if different from signup)
export const registerUser = async (form) => {
  const res = await API.post('/register', form);
  return res.data;
};