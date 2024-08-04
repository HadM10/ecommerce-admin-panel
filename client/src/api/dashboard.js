import axios from 'axios';

const API_URL = 'http://localhost:5000/api/dashboard';

// Fetch dashboard summary
const getDashboardSummary = () => axios.get(`${API_URL}/summary`);

// Fetch most sold products
const getMostSoldProducts = () => axios.get(`${API_URL}/most-sold-products`);

// Fetch most sold categories
const getMostSoldCategories = () => axios.get(`${API_URL}/most-sold-categories`);

// Fetch sales overview
const getSalesOverview = () => axios.get(`${API_URL}/sales-overview`);

// Fetch daily sales overview
const getDailySalesOverview = () => axios.get(`${API_URL}/daily-sales-overview`);

// Fetch recent admin logs
const getRecentActivity = () => axios.get(`${API_URL}/recent-activity`);

export {
  getDashboardSummary,
  getMostSoldProducts,
  getMostSoldCategories,
  getSalesOverview,
  getRecentActivity,
  getDailySalesOverview
};
