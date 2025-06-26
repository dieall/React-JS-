import React from 'react';
import { Navigate } from 'react-router-dom';
import AuthService from '../services/AuthService';

const PrivateRoute = ({ children }) => {
  const isAuthenticated = AuthService.isAuthenticated();
  
  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

export default PrivateRoute; 