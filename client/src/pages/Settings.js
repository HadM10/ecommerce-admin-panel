import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import { AuthContext } from '../context/AuthContext';
import { updateAdminDetails, changePassword } from '../api/settings';

const Settings = () => {
  const { auth, logout } = useContext(AuthContext); // Access logout function for clearing auth data
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate for redirection

  useEffect(() => {
    if (auth) {
      setUsername(auth.username || '');
      setEmail(auth.email || '');
    }
  }, [auth]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(''), 3000); // Clear success message after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [success]);

  const handleUpdateDetails = async (e) => {
    e.preventDefault();
    try {
      await updateAdminDetails(auth.token, { username, email });
      setError(''); // Clear any existing error message
      setSuccess('Details updated successfully');

      // Delay logout by 2 seconds
      setTimeout(() => {
        logout();
        navigate('/login');
      }, 2000);
    } catch (err) {
      setSuccess(''); // Clear any existing success message
      setError(err.message || 'Update Details failed');
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      const response = await changePassword(auth.token, { currentPassword, newPassword });
      setError(''); // Clear any existing error message
      setSuccess(response.message || 'Password changed successfully');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      setSuccess(''); // Clear any existing success message
      setError(err.message || 'Password Update failed');
    }
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-semibold mb-4">Settings</h1>
      <form onSubmit={handleUpdateDetails} className="mb-6">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            required
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary"
        >
          Update Details
        </button>
      </form>
      <form onSubmit={handleChangePassword} className="mb-6">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Current Password</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            required
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary"
        >
          Change Password
        </button>
      </form>
      <div className="mt-4">
        {error && <div className="text-red-500 mb-2">{error}</div>}
        {success && <div className="text-green-500">{success}</div>}
      </div>
    </div>
  );
};

export default Settings;
