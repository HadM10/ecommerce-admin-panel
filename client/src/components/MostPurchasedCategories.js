// src/components/MostSoldCategories.jsx
import React from 'react';
import ChartComponent from './Chart';

const MostSoldCategories = () => {
  // Static data for testing
  const chartData = {
    labels: ['Category A', 'Category B', 'Category C'], // Static labels
    datasets: [
      {
        label: 'Most Sold Categories',
        data: [10, 20, 30], // Static values
        backgroundColor: [
          '#6366F1', // Primary Blue
          '#EAB308', // Bright Yellow
          '#F43F5E', // Light Pink
          '#10B981', // Soft Green
          '#4F46E5', // Darker Blue
        ],
        borderColor: '#fff', // Border color for the segments
        borderWidth: 2, // Border width of the segments
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#111827', // Text color for the legend
        },
      },
      tooltip: {
        callbacks: {
            label: function (tooltipItem) {
                // Get the percentage for the segment
                const percentage = tooltipItem.raw / tooltipItem.chart.data.datasets[0].data.reduce((acc, value) => acc + value, 0) * 100;
                return `${tooltipItem.label}: ${percentage.toFixed(2)}%`; // Tooltip format with percentage
              },
        },
      },
    },
  };

  return (
    <div className="flex flex-col items-center p-4 bg-background border border-border rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4 text-text">Most Sold Categories</h2>
      <div className="w-full flex items-center justify-center w-full max-w-lg">
        <ChartComponent type="pie" data={chartData} options={options} />
      </div>
    </div>
  );
};

export default MostSoldCategories;
