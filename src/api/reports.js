import api from './register.js';

/**
 * Generate a new report
 * @param {Object} reportData - Report generation data
 * @param {string} reportData.query - The query/topic for the report
 * @returns {Promise<Object>} Generated report response
 */
export const generateReport = async (reportData) => {
  try {
    const response = await api.post('/api/reports/generate', reportData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Report generation failed. Please try again.' };
  }
};

/**
 * Get all reports for the authenticated user
 * @returns {Promise<Object>} List of reports
 */
export const getAllReports = async () => {
  try {
    const response = await api.get('/api/reports');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch reports. Please try again.' };
  }
};

/**
 * Get a single report by ID
 * @param {string} reportId - The ID of the report to fetch
 * @returns {Promise<Object>} Single report data
 */
export const getReportById = async (reportId) => {
  try {
    const response = await api.get(`/api/reports/${reportId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch report. Please try again.' };
  }
};

/**
 * Test reports endpoint connectivity
 * @returns {Promise<Object>} Test response
 */
export const testReportsEndpoint = async () => {
  try {
    const response = await api.get('/api/reports/test');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Reports endpoint test failed.' };
  }
};
