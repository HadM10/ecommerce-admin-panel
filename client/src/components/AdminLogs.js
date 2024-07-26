import React, { useEffect, useState } from 'react';
import { getRecentActivity } from '../api/dashboard';

const RecentActivity = () => {
  const [activity, setActivity] = useState([]);

  useEffect(() => {
    const fetchRecentActivity = async () => {
      try {
        const response = await getRecentActivity();
        setActivity(response.data);
      } catch (error) {
        console.error('Error fetching recent activity:', error);
      }
    };

    fetchRecentActivity();
  }, []);

  return (
    <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-lg h-64 overflow-auto">
      <h2 className="text-xl font-semibold mb-4 text-gray-900">Recent Activity</h2>
      <ul className="space-y-4">
        {activity.map((log) => (
          <li key={log.id} className="p-4 bg-gray-50 border border-gray-200 rounded-md shadow-sm">
            <p><strong>Admin ID:</strong> {log.adminId}</p>
            <p><strong>Action:</strong> {log.action}</p>
            <p><strong>Details:</strong> {JSON.stringify(log.details)}</p>
            <p><strong>Date:</strong> {new Date(log.createdAt).toLocaleString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentActivity;
