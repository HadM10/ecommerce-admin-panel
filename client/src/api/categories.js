import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/categories'; // Adjust the base URL as needed

// Get all categories
export const getAllCategories = async () => {
  try {
    const response = await axios.get(BASE_URL);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch categories');
  }
};

// Get category by ID
export const getCategoryById = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch category');
  }
};

// Create a new category
export const createCategory = async (categoryData) => {
  try {
    const response = await axios.post(BASE_URL, categoryData);
    return response.data;
  } catch (error) {
    throw new Error('Failed to create category');
  }
};

// Update a category
export const updateCategory = async (id, categoryData) => {
  try {
    const response = await axios.put(`${BASE_URL}/${id}`, categoryData);
    return response.data;
  } catch (error) {
    throw new Error('Failed to update category');
  }
};

// Delete a category
export const deleteCategory = async (id) => {
  try {
    await axios.delete(`${BASE_URL}/${id}`);
  } catch (error) {
    throw new Error('Failed to delete category');
  }
};
