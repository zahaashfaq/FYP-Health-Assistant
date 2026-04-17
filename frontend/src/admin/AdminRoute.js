// src/admin/AdminRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * AdminRoute — wraps any admin-only page.
 * Redirects to /admin/login if the admin_token is missing.
 */
const AdminRoute = ({ children }) => {
  const isAdmin = localStorage.getItem('admin_token') === 'admin_authenticated';
  return isAdmin ? children : <Navigate to="/admin/login" replace />;
};

export default AdminRoute;