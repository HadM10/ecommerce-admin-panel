import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { getAllAdmins, approveUser, blockUser } from '../api/auth'; // Update with actual import paths

const ApproveAdmin = () => {
  const [admins, setAdmins] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const { auth } = useContext(AuthContext);

  useEffect(() => {
    if (auth?.role !== 'general_admin') {
      setError('Unauthorized');
      setLoading(false);
      return;
    }

    const fetchAdmins = async () => {
      try {
        const response = await getAllAdmins(auth.token); // Fetch all admins
        if (Array.isArray(response)) {
          setAdmins(response);
        } else {
          setError('Unexpected data format');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAdmins();
  }, [auth]);

  const handleApprove = async (id) => {
    try {
      await approveUser(id, auth.token);
      setAdmins(admins.map((admin) =>
        admin.id === id ? { ...admin, isApproved: true } : admin
      ));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleBlock = async (id) => {
    try {
      await blockUser(id, auth.token);
      setAdmins(admins.map((admin) =>
        admin.id === id ? { ...admin, isApproved: false } : admin
      ));
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-semibold mb-4">Manage Admins</h1>
      <ul>
        {admins.map((admin) => (
          <li key={admin.id} className="mb-4 flex justify-between items-center">
            <span>
              {admin.username} ({admin.role})
            </span>
            {admin.isApproved ? (
              <button
                onClick={() => handleBlock(admin.id)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-700"
              >
                Block
              </button>
            ) : (
              <button
                onClick={() => handleApprove(admin.id)}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary"
              >
                Approve
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ApproveAdmin;
