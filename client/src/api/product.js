import axios from 'axios';

const API_URL = 'http://localhost:5000/api/products'; // Update this URL if your backend is hosted elsewhere

// Get all products with optional query parameters for search and filter
export const getAllProducts = async (token, params = {}) => {
  try {
    const response = await axios.get(API_URL, {
      params,
      headers: { 'x-auth-token': token },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Get a single product by ID
export const getProductById = async (token, id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`, {
      headers: { 'x-auth-token': token },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Create a new product (requires token)
export const createProduct = async (token, productData) => {
  try {
    const response = await axios.post(API_URL, productData, {
      headers: { 'x-auth-token': token },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Update an existing product by ID (requires token)
export const updateProduct = async (token, id, productData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, productData, {
      headers: { 'x-auth-token': token },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Delete a product by ID (requires token)
export const deleteProduct = async (token, id) => {
  try {
    console.log('Token:', token); // Log token
    const response = await axios.delete(`${API_URL}/${id}`, {
      headers: { 'x-auth-token': token },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
