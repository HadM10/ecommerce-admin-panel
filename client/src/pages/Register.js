import React, { useState } from 'react';
import { register } from '../api/auth';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
    inviteCode: '',
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const { username, email, password, confirmPassword, role, inviteCode } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      await register({ username, email, password, role, inviteCode });
      navigate('/login'); // Redirect to login page on successful registration
    } catch (err) {
      setError(err.response?.data?.msg || err.message); // Adjust error handling to show backend messages
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-text">Register</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-text mb-2" htmlFor="username">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Your Username"
            />
          </div>
          <div className="mb-4">
            <label className="block text-text mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="you@example.com"
            />
          </div>
          <div className="mb-4">
            <label className="block text-text mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="********"
            />
          </div>
          <div className="mb-4">
            <label className="block text-text mb-2" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="********"
            />
          </div>
          <div className="mb-6">
            <label className="block text-text mb-2" htmlFor="role">
              Role
            </label>
            <select
              id="role"
              name="role"
              value={role}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Select Role</option>
              <option value="general_admin">General Admin</option>
              <option value="product_manager">Product Manager</option>
              <option value="order_manager">Product Manager</option>
              <option value="customer_service">Customer Service</option>
              <option value="delivery">Delivery</option>
            </select>
          </div>
          {(role === 'admin' || role === 'general_admin') && (
            <div className="mb-4">
              <label className="block text-text mb-2" htmlFor="inviteCode">
                Invite Code
              </label>
              <input
                type="text"
                id="inviteCode"
                name="inviteCode"
                value={inviteCode}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Invite Code"
              />
            </div>
          )}
          <button
            type="submit"
            className="w-full bg-primary text-white py-2 px-4 rounded-lg hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-primary"
          >
            Register
          </button>
        </form>
        <div className="mt-4 text-center">
          <p className="text-text">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:underline">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
