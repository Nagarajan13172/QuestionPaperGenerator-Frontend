import axios, { AxiosError } from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // You can add auth tokens here if needed
    // config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    // Return the data directly
    return response.data;
  },
  (error: AxiosError<{ detail?: string; message?: string }>) => {
    // Handle errors uniformly
    const message = 
      error.response?.data?.detail || 
      error.response?.data?.message || 
      error.message ||
      'An unexpected error occurred';
    
    console.error('API Error:', message);
    return Promise.reject(new Error(message));
  }
);

export default api;

