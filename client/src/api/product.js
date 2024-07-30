import axios from 'axios';

const API_URL = 'http://localhost:5000/api/products'; // Update this URL if your backend is hosted elsewhere

// Get all products with optional query parameters for search and filter
export const getAllProducts = async (params = {}) => {
    try {
        const response = await axios.get(API_URL, { params });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

// Get a single product by ID
export const getProductById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

// Create a new product
export const createProduct = async (productData) => {
    try {
        const response = await axios.post(API_URL, productData);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

// Update an existing product by ID
export const updateProduct = async (id, productData) => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, productData);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

// Delete a product by ID
export const deleteProduct = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};
