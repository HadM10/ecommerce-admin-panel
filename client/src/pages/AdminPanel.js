import React, { useContext } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; // Ensure the path is correct

const AdminPanel = () => {
  const { auth, logout, loading } = useContext(AuthContext); // Destructure logout from AuthContext
  const location = useLocation(); // Get the current path

  if (loading) return <div>Loading...</div>; // Handle loading state

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg h-full border-r border-border">
        <div className="p-6">
          <h1 className="text-3xl font-semibold mb-8 text-text">Admin Panel</h1>
          <nav>
            <ul className="space-y-4">
              <li>
                <Link
                  to="/dashboard"
                  className={`block px-4 py-2 rounded-lg text-lg transition duration-300 ${
                    location.pathname === '/dashboard'
                      ? 'bg-primary text-white'
                      : 'text-text hover:bg-primary hover:text-white'
                  }`}
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  to="/users"
                  className={`block px-4 py-2 rounded-lg text-lg transition duration-300 ${
                    location.pathname === '/users'
                      ? 'bg-primary text-white'
                      : 'text-text hover:bg-primary hover:text-white'
                  }`}
                >
                  Users
                </Link>
              </li>
              <li>
                <Link
                  to="/orders"
                  className={`block px-4 py-2 rounded-lg text-lg transition duration-300 ${
                    location.pathname === '/orders'
                      ? 'bg-primary text-white'
                      : 'text-text hover:bg-primary hover:text-white'
                  }`}
                >
                  Orders
                </Link>
              </li>
              <li>
                <Link
                  to="/categories"
                  className={`block px-4 py-2 rounded-lg text-lg transition duration-300 ${
                    location.pathname === '/categories'
                      ? 'bg-primary text-white'
                      : 'text-text hover:bg-primary hover:text-white'
                  }`}
                >
                  Categories
                </Link>
              </li>
              <li>
                <Link
                  to="/products"
                  className={`block px-4 py-2 rounded-lg text-lg transition duration-300 ${
                    location.pathname === '/products'
                      ? 'bg-primary text-white'
                      : 'text-text hover:bg-primary hover:text-white'
                  }`}
                >
                  Products
                </Link>
              </li>
              <li>
                <Link
                  to="/customer-service"
                  className={`block px-4 py-2 rounded-lg text-lg transition duration-300 ${
                    location.pathname === '/customer-service'
                      ? 'bg-primary text-white'
                      : 'text-text hover:bg-primary hover:text-white'
                  }`}
                >
                  Customer Service
                </Link>
              </li>
              <li>
                <Link
                  to="/settings"
                  className={`block px-4 py-2 rounded-lg text-lg transition duration-300 ${
                    location.pathname === '/settings'
                      ? 'bg-primary text-white'
                      : 'text-text hover:bg-primary hover:text-white'
                  }`}
                >
                  Settings
                </Link>
              </li>
              {/* Conditionally render the Approval section */}
              {auth?.role === 'general_admin' && (
                <li>
                  <Link
                    to="/approve"
                    className={`block px-4 py-2 rounded-lg text-lg transition duration-300 ${
                      location.pathname === '/approve'
                        ? 'bg-primary text-white'
                        : 'text-text hover:bg-primary hover:text-white'
                    }`}
                  >
                    Approve Admins
                  </Link>
                </li>
              )}
            </ul>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 bg-white shadow-inner">
        <header className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            {/* Search Bar */}
            <input
              type="text"
              placeholder="Search..."
              className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-primary"
            />
            {/* Notifications */}
            <button className="relative">
              <span className="material-icons">notifications</span>
              <span className="px-4 py-2 bg-primary text-white text-xs rounded-full px-2 py-1">
                3
              </span>
            </button>
          </div>
          <div className="flex items-center space-x-4">
            {/* User Profile */}
            <div className="flex items-center space-x-2">
              <span className="material-icons">Admin :</span>
              <span>{auth?.username || 'Admin Name'}</span> {/* Display username or fallback */}
            </div>
            {/* Logout Button */}
            <button
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary"
              onClick={logout} // Ensure logout function is correctly referenced
            >
              Logout
            </button>
          </div>
        </header>

        {/* This is where the nested routes will render */}
        <Outlet />
      </main>
    </div>
  );
};

export default AdminPanel;
