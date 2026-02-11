import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');

  //  If token not found then redirect login page
  if (!token) {
    console.warn("Access Denied: No token found!");
    return <Navigate to="/login" replace />;
  }

  // if token have in localstorage then show dashboard
  return children;
};

export default PrivateRoute;