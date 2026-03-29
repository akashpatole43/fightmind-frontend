import axios from 'axios';

/**
 * Global Axios instance communicating with the Spring Boot backend.
 * Automatically injects the JWT token on every request.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
  timeout: 60000, // 60 seconds to allow for AI generation processing time
});

// Request Interceptor: Attach JWT Token if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response Interceptor: Global 401 Unauthorized handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // The JWT expired, or the user was deleted/banned by an admin.
      // Clear local storage and broadcast an event so the Router can kick them to /login
      console.warn("Unauthorized access detected. Clearing session...");
      localStorage.removeItem('auth-store'); // Zustand persistance key
      localStorage.removeItem('token');
      window.dispatchEvent(new Event('auth:unauthorized'));
    }
    return Promise.reject(error);
  }
);

export default api;
