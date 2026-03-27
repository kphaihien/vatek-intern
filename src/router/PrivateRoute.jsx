import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const user = useSelector((state) => state.user);

  if (user === null) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default PrivateRoute;
