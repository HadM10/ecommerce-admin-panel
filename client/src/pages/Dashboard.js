import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Dashboard = () => {
  const { logout } = useContext(AuthContext); // Only import 'logout' since 'auth' is not used

  const handleLogout = () => {
    console.log('Logout button clicked'); // Debug log
    logout();
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-text">Dashboard</h1>
        <p>Welcome to the Dashboard!</p>
        <button
          onClick={handleLogout}
          className="mt-4 w-full bg-primary text-white py-2 px-4 rounded-lg hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-primary"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
