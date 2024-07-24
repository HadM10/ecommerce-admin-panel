import axios from 'axios';

// Base URL for your backend API
const API_URL = 'http://localhost:5000/api/settings';

// Update admin details
export const updateAdminDetails = async (token, details) => {
  try {
    const response = await axios.put(`${API_URL}/update-details`, details, {
      headers: {
        'x-auth-token': token,
      },
    });
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Update Details failed';
    throw new Error(errorMessage);
  }
};

// Change admin password
export const changePassword = async (token, passwords) => {
  try {
    const response = await axios.put(`${API_URL}/change-password`, passwords, {
      headers: {
        'x-auth-token': token,
      },
    });
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Password Update failed';
    throw new Error(errorMessage);
  }
};
