// src/components/MostSoldProducts.jsx
import React from 'react';
import ChartComponent from './Chart';

const MostSoldProducts = () => {
  // Static data for testing
  const chartData = {
    labels: ['Product A', 'Product B', 'Product C', 'Product D', 'Product E'],
    datasets: [
      {
        label: 'Most Sold Products',
        data: [300, 150, 200, 100, 250], // Static values for testing
        backgroundColor: [
          '#FF6384', // Colors for the chart segments
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
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
      <h2 className="text-xl font-semibold mb-4 text-text ">Most Sold Products</h2>
      <div className="w-full flex items-center justify-center w-full max-w-lg">
        <ChartComponent type="doughnut" data={chartData} options={options} />
      </div>
    </div>
  );
};

export default MostSoldProducts;
