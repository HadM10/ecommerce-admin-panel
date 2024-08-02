import React, { useEffect, useState } from 'react';
import { getMostSoldProducts } from '../api/dashboard'; // Adjust the path as necessary
import ChartComponent from './Chart';

const MostSoldProducts = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMostSoldProducts = async () => {
      try {
        const response = await getMostSoldProducts();
        const data = response.data;

        // Convert totalQuantity to number
        const labels = data.map(item => item.productName);
        const values = data.map(item => Number(item.totalQuantity)); // Convert to number

        setChartData({
          labels,
          datasets: [
            {
              label: 'Most Sold Products',
              data: values,
              backgroundColor: [
                '#FF6384',
                '#36A2EB',
                '#FFCE56',
                '#4BC0C0',
                '#9966FF',
              ],
              borderColor: '#fff',
              borderWidth: 2,
            },
          ],
        });
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch most sold products:', err);
        setError('Failed to fetch most sold products');
        setLoading(false);
      }
    };

    fetchMostSoldProducts();
  }, []);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#111827',
        },
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            const total = tooltipItem.chart.data.datasets[0].data.reduce((acc, value) => acc + value, 0);
            const percentage = (tooltipItem.raw / total) * 100;
            return `${tooltipItem.label}: ${percentage.toFixed(2)}%`;
          },
        },
      },
    },
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="flex flex-col items-center p-4 bg-background border border-border rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4 text-text">Most Sold Products</h2>
      <div className="w-full flex items-center justify-center max-w-lg">
        {chartData && <ChartComponent type="doughnut" data={chartData} options={options} />}
      </div>
    </div>
  );
};

export default MostSoldProducts;
