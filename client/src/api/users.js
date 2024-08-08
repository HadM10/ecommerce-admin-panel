import axios from 'axios';

// Define the base URL for the API
const API_URL = 'http://localhost:5000/api/client-users';

// Register a new client user
export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

// Sign in an existing client user
export const signInUser = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/signIn`, credentials);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

// Update client user information
export const updateUser = async (id, userData) => {
  try {
    const response = await axios.put(`${API_URL}/update/${id}`, userData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

// Get all client users (no token needed)
export const getAllUsers = async () => {
  try {
    const response = await axios.get(`${API_URL}/`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

// Get a specific client user by ID (no token needed)
export const getUserById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

// Delete a client user
export const deleteUser = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

// Suspend a client user
export const suspendUser = async (id) => {
  try {
    const response = await axios.put(`${API_URL}/suspend/${id}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

// Reactivate a suspended client user
export const reactivateUser = async (id) => {
  try {
    const response = await axios.put(`${API_URL}/reactivate/${id}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};
