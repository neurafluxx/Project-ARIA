import api from './register.js';

/**
 * Login user
 * @param {Object} credentials - Login credentials
 * @param {string} credentials.email - User email
 * @param {string} credentials.password - User password
 * @returns {Promise<Object>} Login response
 */
export const loginUser = async (credentials) => {
  try {
    const response = await api.post('/api/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('aria_token', response.data.token);
    }
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Login failed. Please try again.' };
  }
};

/**
 * Logout user
 * @returns {Promise<Object>} Logout response
 */
export const logoutUser = async () => {
  try {
    const response = await api.post('/logout');
    localStorage.removeItem('aria_token');
    return response.data;
  } catch (error) {
    localStorage.removeItem('aria_token');
    throw error.response?.data || { message: 'Logout failed.' };
  }
};

/**
 * Mock user login for development
 * @param {Object} credentials - Login credentials
 * @returns {Promise<Object>} Mock login response
 */
export const mockLoginUser = async (credentials) => {
  // Use real implementation
  return loginUser(credentials);
};
