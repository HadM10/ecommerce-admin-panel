// src/components/SalesOverview.jsx
import React, { useEffect, useState } from 'react';
import { getSalesOverview } from '../api/dashboard';
import ChartComponent from './Chart';

const SalesOverview = () => {
    // Example data
    const data = {
      labels: ['January', 'February', 'March', 'April', 'May'],
      datasets: [
        {
          label: 'Monthly Sales',
          data: [0, 0, 0, 0, 0],
          fill: false,
          backgroundColor: 'rgba(29, 78, 216, 0.2)', // Primary color from Tailwind
          borderColor: '#1D4ED8', // Primary color from Tailwind
          tension: 0.1,
        },
      ],
    };
  
    const options = {
      plugins: {
        legend: {
          display: true,
          labels: {
            color: '#111827', // Text color from Tailwind
          },
        },
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Month',
            color: '#111827', // Text color from Tailwind
          },
        },
        y: {
          title: {
            display: true,
            text: 'Sales',
            color: '#111827', // Text color from Tailwind
          },
        },
      },
    };
  
    return (
        <div className="flex flex-col items-center p-4 bg-background border border-border rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold text-text mb-4">Sales Overview</h2>
        <div className="w-full flex items-center justify-center w-full max-w-lg">
        <ChartComponent type="line" data={data} options={options} /></div>
      </div>
    );
  };
  
  export default SalesOverview;