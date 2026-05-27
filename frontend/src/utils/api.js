import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://real-estate-backend-cnvt.onrender.com/api',
});

// Add interceptor to include token if available
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('bridl360_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
