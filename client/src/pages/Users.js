import React, { useState, useEffect } from 'react';
import { getAllUsers, suspendUser, reactivateUser } from '../api/users'; // Update API imports

const ClientUserManagement = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sortKey, setSortKey] = useState('createdAt'); // Default sort key
  const [sortOrder, setSortOrder] = useState('asc'); // Default sorting order is ascending
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getAllUsers({
          searchTerm,
          sortKey,
          sortOrder,
          filterStatus,
        });
        const usersWithFullName = response.map((user) => ({
          ...user,
          fullName: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
        }));
        setUsers(usersWithFullName);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch users');
        setLoading(false);
      }
    };

    fetchUsers();
  }, [searchTerm, sortKey, sortOrder, filterStatus]);

  useEffect(() => {
    const filterAndSortUsers = () => {
      let result = users;

      // Filter by status
      if (filterStatus !== 'all') {
        result = result.filter((user) => user.status === filterStatus);
      }

      // Search filter
      if (searchTerm) {
        result = result.filter(
          (user) =>
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.fullName.toLowerCase().includes(searchTerm.toLowerCase()),
        );
      }

      // Sorting
      if (sortKey) {
        result.sort((a, b) => {
          let aValue = a[sortKey];
          let bValue = b[sortKey];

          // Handle sorting based on field type
          if (sortKey === 'createdAt') {
            aValue = new Date(aValue);
            bValue = new Date(bValue);
          } else if (['totalOrders', 'totalSpent'].includes(sortKey)) {
            aValue = Number(aValue);
            bValue = Number(bValue);
          }

          if (aValue < bValue) {
            return sortOrder === 'asc' ? -1 : 1;
          }
          if (aValue > bValue) {
            return sortOrder === 'asc' ? 1 : -1;
          }
          return 0;
        });
      }

      setFilteredUsers(result);
    };

    filterAndSortUsers();
  }, [searchTerm, users, sortKey, sortOrder, filterStatus]);

  const handleSuspend = async (id) => {
    try {
      await suspendUser(id);
      setUsers(users.map((user) => (user.id === id ? { ...user, status: 'suspended' } : user)));
    } catch (err) {
      setError('Failed to suspend user');
    }
  };

  const handleReactivate = async (id) => {
    try {
      await reactivateUser(id);
      setUsers(users.map((user) => (user.id === id ? { ...user, status: 'active' } : user)));
    } catch (err) {
      setError('Failed to reactivate user');
    }
  };

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  return (
    <div className="p-8 bg-white shadow-lg rounded-lg border border-border">
      <h2 className="text-2xl font-bold mb-6 text-primary">User Management</h2>

      <div className="mb-6 flex flex-col md:flex-row items-start md:items-center">
        <input
          type="text"
          placeholder="Search by email, username, or full name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-1/3 px-3 py-2 border border-border rounded-md mb-4 md:mb-0 md:mr-4"
        />

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="mb-4 md:mb-0 md:mr-4 px-3 py-2 border border-border rounded-md"
        >
          <option value="all">All Statuses</option>
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
        </select>

        <div className="flex items-center">
          <label className="mr-2">Sort by:</label>
          <select
            value={sortKey}
            onChange={(e) => handleSort(e.target.value)}
            className="mr-4 px-3 py-2 border border-border rounded-md"
          >
            <option value="createdAt">Created At</option>
            <option value="username">Name</option>
            <option value="totalOrders">Total Orders</option>
            <option value="totalSpent">Total Spent</option>
          </select>

          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Sort Order: {sortOrder === 'asc' ? 'Descending' : 'Ascending'}
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-center text-text">Loading...</p>
      ) : (
        <>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <table className="w-full table-auto">
            <thead>
              <tr className="border-b border-border">
                <th className="px-4 py-2 text-left text-text">Username</th>
                <th className="px-4 py-2 text-left text-text">Email</th>
                <th className="px-4 py-2 text-left text-text">Full Name</th>
                <th className="px-4 py-2 text-left text-text">Status</th>
                <th
                  className="cursor-pointer px-4 py-2 text-left text-text"
                  onClick={() => handleSort('createdAt')}
                >
                  Created At
                </th>
                <th
                  className="cursor-pointer px-4 py-2 text-left text-text"
                  onClick={() => handleSort('totalOrders')}
                >
                  Total Orders
                </th>
                <th
                  className="cursor-pointer px-4 py-2 text-left text-text"
                  onClick={() => handleSort('totalSpent')}
                >
                  Total Spent
                </th>
                <th className="px-4 py-2 text-left text-text">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-border">
                    <td className="px-4 py-2">{user.username}</td>
                    <td className="px-4 py-2">{user.email}</td>
                    <td className="px-4 py-2">{user.fullName || 'N/A'}</td>
                    <td className="px-4 py-2">
                      <span
                        className={`px-2 py-1 rounded ${user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="px-4 py-2">{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-2">{user.totalOrders}</td>
                    <td className="px-4 py-2">${(Number(user.totalSpent) || 0).toFixed(2)}</td>
                    <td className="px-4 py-2">
                      {user.status === 'active' ? (
                        <button
                          onClick={() => handleSuspend(user.id)}
                          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                        >
                          Suspend
                        </button>
                      ) : (
                        <button
                          onClick={() => handleReactivate(user.id)}
                          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                        >
                          Reactivate
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center px-4 py-2">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default ClientUserManagement;
