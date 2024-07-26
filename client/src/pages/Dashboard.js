// src/pages/Dashboard.jsx
import React from 'react';
import DashboardSummary from '../components/DashboardSummary';
import MostSoldProducts from '../components/MostPurchasedProducts';
import MostSoldCategories from '../components/MostPurchasedCategories';
import SalesOverview from '../components/SalesOverview';
import RecentActivity from '../components/AdminLogs';
const Dashboard = () => {
  return (
    <div className="p-6 space-y-6">
      <DashboardSummary />
      <div className="flex flex-wrap gap-6">
        <div className="flex-1 min-w-[300px]">
          <MostSoldProducts />
        </div>
        <div className="flex-1 min-w-[300px]">
          <MostSoldCategories />
        </div>
        <div className="flex-1 min-w-[300px]">
          <SalesOverview />
        </div>
        <div className="flex-1 min-w-[300px]">
          <RecentActivity />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
