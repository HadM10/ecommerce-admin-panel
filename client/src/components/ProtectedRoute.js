import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ element }) => {
  const { auth, loading } = useContext(AuthContext);

  if (loading) return <div>Loading...</div>; // Optional: Show a loading state

  return auth ? element : <Navigate to="/login" />;
};

export default ProtectedRoute;
