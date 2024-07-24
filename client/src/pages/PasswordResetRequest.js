import React, { useState } from 'react';
import { requestPasswordReset } from '../api/auth';

const PasswordResetRequest = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await requestPasswordReset(email);
      setMessage('Password reset email sent successfully!');
      setError('');
    } catch (err) {
      setError(err.message);
      setMessage('');
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-text">Forgot Password</h1>
        {message && <p className="text-green-500 mb-4">{message}</p>}
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-text mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Your Email"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-primary text-white py-2 px-4 rounded-lg hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-primary"
          >
            Send Reset Email
          </button>
        </form>
      </div>
    </div>
  );
};

export default PasswordResetRequest;
