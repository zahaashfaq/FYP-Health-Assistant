// src/admin/AdminLogin.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaDumbbell, FaLock, FaEnvelope, FaEye, FaEyeSlash, FaShieldAlt } from 'react-icons/fa';
import * as Yup from 'yup';
import './AdminLogin.css';

const ADMIN_EMAIL = 'adminfitness@example.com';
const ADMIN_PASSWORD = 'Admin@123'; // Change as needed

const adminSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email format').required('Email is required'),
  password: Yup.string()
    .min(6, 'At least 6 characters')
    .matches(/[A-Z]/, 'At least one uppercase letter')
    .matches(/\d/, 'At least one number')
    .required('Password is required'),
});

export default function AdminLogin() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const validate = async () => {
    try {
      await adminSchema.validate(formData, { abortEarly: false });
      setErrors({});
      return true;
    } catch (err) {
      const fieldErrors = {};
      err.inner.forEach((e) => { fieldErrors[e.path] = e.message; });
      setErrors(fieldErrors);
      return false;
    }
  };

  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
    // Clear field error on change
    if (errors[field]) setErrors({ ...errors, [field]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const valid = await validate();
    if (!valid) return;

    setIsLoading(true);
    setTimeout(() => {
      if (
        formData.email.trim().toLowerCase() === ADMIN_EMAIL &&
        formData.password === ADMIN_PASSWORD
      ) {
        localStorage.setItem('admin_token', 'admin_authenticated');
        navigate('/admin/dashboard');
      } else {
        setError('Invalid admin credentials.');
      }
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="admin-login-wrapper">
      <div className="admin-login-bg-grid" />
      <div className="admin-login-card">
        <div className="admin-login-logo">
          <FaDumbbell />
          <span>FitBot <span className="accent">Admin</span></span>
        </div>

        <div className="admin-login-badge">
          <FaShieldAlt size={13} />
          Restricted Access — Administrators Only
        </div>

        <h2 className="admin-login-title">Welcome Back, Admin</h2>
        <p className="admin-login-sub">Sign in to manage your FitBot platform</p>

        {error && <div className="admin-error-alert">{error}</div>}

        <form onSubmit={handleSubmit} noValidate>
          {/* Email */}
          <div className="admin-field">
            <label>Admin Email</label>
            <div className={`admin-input-wrap ${errors.email ? 'has-error' : ''}`}>
              <FaEnvelope className="admin-input-icon" />
              <input
                type="email"
                placeholder="adminfitness@example.com"
                value={formData.email}
                onChange={handleChange('email')}
              />
            </div>
            {errors.email && <span className="admin-field-error">{errors.email}</span>}
          </div>

          {/* Password */}
          <div className="admin-field">
            <label>Password</label>
            <div className={`admin-input-wrap ${errors.password ? 'has-error' : ''}`}>
              <FaLock className="admin-input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange('password')}
              />
              <span className="admin-pw-toggle" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            {errors.password && <span className="admin-field-error">{errors.password}</span>}
          </div>

          <button type="submit" className="admin-login-btn" disabled={isLoading}>
            {isLoading ? 'Authenticating...' : 'Access Admin Dashboard'}
          </button>
        </form>

        <p className="admin-back-link" onClick={() => navigate('/login')}>
          ← Back to User Login
        </p>
      </div>
    </div>
  );
}