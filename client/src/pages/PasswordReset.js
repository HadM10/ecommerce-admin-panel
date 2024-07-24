import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { resetPassword } from '../api/auth'; // Adjust import path as needed

const PasswordReset = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const resetToken = queryParams.get('token');

    if (!resetToken) {
      setError('Invalid or missing reset token');
    }
  }, [location.search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const queryParams = new URLSearchParams(location.search);
    const resetToken = queryParams.get('token');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      // Corrected function call with separate arguments
      await resetPassword(resetToken, newPassword);
      setMessage('Password has been reset successfully!');
      setError('');
      navigate('/login');
    } catch (err) {
      setError(err.message);
      setMessage('');
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-text">Reset Password</h1>
        {message && <p className="text-green-500 mb-4">{message}</p>}
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-text mb-2" htmlFor="new-password">
              New Password
            </label>
            <input
              type="password"
              id="new-password"
              name="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="New Password"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-text mb-2" htmlFor="confirm-password">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirm-password"
              name="confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Confirm Password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-primary text-white py-2 px-4 rounded-lg hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-primary"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default PasswordReset;
