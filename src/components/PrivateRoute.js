import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-off-white text-xl">Loading...</div>
      </div>
    );
  }

  // Allow both registered users and guest users
  return user ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
