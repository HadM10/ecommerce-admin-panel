import axios from 'axios';

const baseURL = 'http://localhost:5000/api/orders'; // Replace with your actual backend URL

// Function to fetch all orders
export const getAllOrders = async (queryParams) => {
  try {
    const response = await axios.get(baseURL, { params: queryParams });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch orders:', error);
    throw error.response ? error.response.data.error : 'Failed to fetch orders';
  }
};

// Function to fetch order by ID
export const getOrderById = async (orderId) => {
  try {
    const response = await axios.get(`${baseURL}/${orderId}`);
    return response.data;
  } catch (error) {
    throw error.response.data.error;
  }
};

// Function to update order status
export const updateOrderStatus = async (orderId, status) => {
  try {
    const response = await axios.put(`${baseURL}/${orderId}`, { status });
    return response.data;
  } catch (error) {
    throw error.response.data.error;
  }
};

// Function to delete order
export const deleteOrder = async (orderId) => {
  try {
    const response = await axios.delete(`${baseURL}/${orderId}`);
    return response.data;
  } catch (error) {
    throw error.response.data.error;
  }
};

// Function to archive order
export const archiveOrder = async (orderId) => {
  try {
    const response = await axios.put(`${baseURL}/archive/${orderId}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data.error : 'Failed to archive order';
  }
};
