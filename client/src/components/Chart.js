// src/components/Chart.jsx
import React from 'react';
import { Bar, Doughnut, Line, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  PointElement,
} from 'chart.js';

// Register the required components for Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  PointElement,
);

const ChartComponent = ({ type = 'bar', data = {}, options }) => {
  // Choose the chart type based on the `type` prop
  const ChartType =
    type === 'pie' ? Pie : type === 'doughnut' ? Doughnut : type === 'line' ? Line : Bar; // Default to Bar if no type matches

  return (
    <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-lg flex items-center justify-center">
      <div className="relative w-full max-w-md h-64">
        {/* Ensure the chart component is rendering */}
        <ChartType data={data} options={options} />
      </div>
    </div>
  );
};

export default ChartComponent;
