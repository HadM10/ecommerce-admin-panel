import React, { useEffect, useState } from 'react';
import { getDashboardSummary } from '../api/dashboard';

const DashboardSummary = () => {
  const [summary, setSummary] = useState({});

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await getDashboardSummary();
        setSummary(response.data);
      } catch (error) {
        console.error('Error fetching dashboard summary:', error);
      }
    };

    fetchSummary();
  }, []);

  return (
    <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Dashboard Summary</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-blue-100 p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-blue-600">Total Users</h3>
          <p className="text-2xl font-bold text-blue-800">{summary.totalUsers || '0'}</p>
        </div>
        <div className="bg-green-100 p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-green-600">Total Products</h3>
          <p className="text-2xl font-bold text-green-800">{summary.totalProducts || '0'}</p>
        </div>
        <div className="bg-yellow-100 p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-yellow-600">Total Orders</h3>
          <p className="text-2xl font-bold text-yellow-800">{summary.totalOrders || '0'}</p>
        </div>
        <div className="bg-purple-100 p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-purple-600">Total Categories</h3>
          <p className="text-2xl font-bold text-purple-800">{summary.totalCategories || '0'}</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardSummary;
