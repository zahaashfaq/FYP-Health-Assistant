import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { FaDumbbell, FaEnvelope, FaArrowLeft } from 'react-icons/fa';
import './auth.css';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setIsLoading(true);

    try {
      await api.forgotPassword(email);
      setMessage('If an account exists for this email, you will receive a password reset link.');
      setEmail('');
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="custom-auth-wrapper">
      <div className="custom-auth-logo">
        <FaDumbbell /> FitBot AI
      </div>

      <div className="custom-auth-box">
        <h2>Forgot Password</h2>
        <p className="custom-auth-subtitle">
          Enter your email and we&apos;ll send you a link to reset your password.
        </p>

        {error && (
          <div
            style={{
              color: '#721c24',
              backgroundColor: '#f8d7da',
              borderColor: '#f5c6cb',
              padding: '10px',
              borderRadius: '5px',
              marginBottom: '15px',
              fontSize: '14px',
            }}
          >
            {error}
          </div>
        )}
        {message && (
          <div
            style={{
              color: '#155724',
              backgroundColor: '#d4edda',
              borderColor: '#c3e6cb',
              padding: '10px',
              borderRadius: '5px',
              marginBottom: '15px',
              fontSize: '14px',
            }}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="custom-input-group">
            <label>Email Address</label>
            <div className="custom-input-wrapper">
              <FaEnvelope className="custom-input-icon" />
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="custom-auth-btn" disabled={isLoading}>
            {isLoading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        <p className="custom-switch-auth" style={{ marginTop: '20px' }}>
          <Link to="/login">
            <FaArrowLeft style={{ marginRight: '6px', verticalAlign: 'middle' }} />
            Back to Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
