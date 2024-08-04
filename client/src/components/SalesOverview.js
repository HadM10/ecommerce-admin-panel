// import React, { useEffect, useState } from 'react';
// import { getSalesOverview } from '../api/dashboard'; // Adjust the import path as needed
// import ChartComponent from './Chart'; // Adjust the import path as needed

// const SalesOverview = () => {
//     const [chartData, setChartData] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     // Function to get month names from month numbers
//     const getMonthName = (monthNumber) => {
//         const months = [
//             'January', 'February', 'March', 'April', 'May', 'June',
//             'July', 'August', 'September', 'October', 'November', 'December'
//         ];
//         return months[monthNumber - 1]; // monthNumber is 1-based
//     };

//     useEffect(() => {
//         const fetchSalesOverview = async () => {
//             try {
//                 const response = await getSalesOverview();
//                 const data = response.data;

//                 // Prepare data for chart
//                 const labels = data.map(item => getMonthName(parseInt(item.month.split('-')[1], 10))); // Convert month number to name
//                 const salesData = data.map(item => item.totalSales);

//                 setChartData({
//                     labels,
//                     datasets: [
//                         {
//                             label: 'Monthly Sales',
//                             data: salesData,
//                             fill: false,
//                             backgroundColor: 'rgba(29, 78, 216, 0.2)', // Primary color from Tailwind
//                             borderColor: '#1D4ED8', // Primary color from Tailwind
//                             tension: 0.1,
//                         },
//                     ],
//                 });
//                 setLoading(false);
//             } catch (err) {
//                 console.error('Failed to fetch sales overview:', err);
//                 setError('Failed to fetch sales overview');
//                 setLoading(false);
//             }
//         };

//         fetchSalesOverview();
//     }, []);

//     const options = {
//         plugins: {
//             legend: {
//                 display: true,
//                 labels: {
//                     color: '#111827', // Text color from Tailwind
//                 },
//             },
//         },
//         scales: {
//             x: {
//                 title: {
//                     display: true,
//                     text: 'Month',
//                     color: '#111827', // Text color from Tailwind
//                 },
//                 ticks: {
//                     autoSkip: true, // Auto skips labels if they overlap
//                     maxRotation: 45, // Rotate labels for better readability
//                 },
//             },
//             y: {
//                 title: {
//                     display: true,
//                     text: 'Sales',
//                     color: '#111827', // Text color from Tailwind
//                 },
//                 ticks: {
//                     callback: (value) => `$${value}`, // Optional: format y-axis labels as currency
//                 },
//             },
//         },
//     };

//     if (loading) return <p>Loading...</p>;
//     if (error) return <p>{error}</p>;

//     return (
//         <div className="flex flex-col items-center p-4 bg-background border border-border rounded-lg shadow-lg">
//             <h2 className="text-xl font-semibold text-text mb-4">Sales Overview</h2>
//             <div className="w-full flex items-center justify-center max-w-lg">
//                 {chartData && <ChartComponent type="line" data={chartData} options={options} />}
//             </div>
//         </div>
//     );
// };

// export default SalesOverview;

import React, { useEffect, useState } from 'react';
import { getDailySalesOverview } from '../api/dashboard'; // Adjust the import path as needed
import ChartComponent from './Chart'; // Adjust the import path as needed

const DailySalesOverview = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDailySalesOverview = async () => {
      try {
        const response = await getDailySalesOverview();
        const data = response.data;

        // Prepare data for chart
        const labels = data.map((item) => item.date); // Use date for labels
        const salesData = data.map((item) => item.totalSales);

        setChartData({
          labels,
          datasets: [
            {
              label: 'Daily Sales',
              data: salesData,
              fill: false,
              backgroundColor: 'rgba(29, 78, 216, 0.2)', // Primary color from Tailwind
              borderColor: '#1D4ED8', // Primary color from Tailwind
              tension: 0.1,
            },
          ],
        });
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch daily sales overview:', err);
        setError('Failed to fetch daily sales overview');
        setLoading(false);
      }
    };

    fetchDailySalesOverview();
  }, []);

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
          text: 'Date',
          color: '#111827', // Text color from Tailwind
        },
        ticks: {
          autoSkip: true, // Auto skips labels if they overlap
          maxRotation: 45, // Rotate labels for better readability
        },
      },
      y: {
        title: {
          display: true,
          text: 'Sales',
          color: '#111827', // Text color from Tailwind
        },
        ticks: {
          callback: (value) => `$${value}`, // Optional: format y-axis labels as currency
        },
      },
    },
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="flex flex-col items-center p-4 bg-background border border-border rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold text-text mb-4">Daily Sales Overview</h2>
      <div className="w-full flex items-center justify-center max-w-lg">
        {chartData && <ChartComponent type="line" data={chartData} options={options} />}
      </div>
    </div>
  );
};

export default DailySalesOverview;
