import axios from 'axios';

// Create axios instance with default configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://aria-backend-4l05.onrender.com',
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('aria_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('aria_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @param {string} userData.email - User email
 * @param {string} userData.password - User password
 * @param {string} userData.firstName - User first name (optional)
 * @param {string} userData.lastName - User last name (optional)
 * @returns {Promise<Object>} Registration response
 */
export const registerUser = async (userData) => {
  try {
    const response = await api.post('/api/auth/register', userData);
    if (response.data.token) {
      localStorage.setItem('aria_token', response.data.token);
    }
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Registration failed. Please try again.' };
  }
};

/**
 * Validate user email (check if already exists)
 * @param {string} email - Email to validate
 * @returns {Promise<Object>} Validation response
 */
export const validateEmail = async (email) => {
  try {
    const response = await api.post('/validate-email', { email });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Email validation failed.' };
  }
};

/**
 * Mock user registration for development
 * This simulates a backend API call
 * @param {Object} userData - User registration data
 * @returns {Promise<Object>} Mock registration response
 */
export const mockRegisterUser = async (userData) => {
  // Use real implementation to keep code consistent
  return registerUser(userData);
};

export default api;
