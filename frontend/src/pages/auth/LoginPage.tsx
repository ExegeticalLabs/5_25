import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Auth.css';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await login(email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-screen screen">
      <div className="auth-top">
        <div className="app-logo">
          <span className="logo-main">5/25</span>
          <span className="logo-sub">FITNESS</span>
        </div>
        <h1 className="auth-headline">Welcome back.</h1>
        <p className="auth-subtext">Log in to continue your training.</p>
      </div>

      <div className="auth-form-container">
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              className={`text-input ${error && !email ? 'error' : ''}`}
              placeholder="you@example.com"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(''); }}
              autoComplete="email"
              autoCapitalize="none"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className={`text-input ${error ? 'error' : ''}`}
              placeholder="Your password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(''); }}
              autoComplete="current-password"
            />
          </div>

          {error && <p className="error-text">{error}</p>}

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading && <span className="spinner" />}
            {loading ? 'Logging in...' : 'LOG IN'}
          </button>
        </form>

        <div className="auth-footer">
          <span className="auth-footer-text">Don't have an account?</span>
          <Link to="/signup" className="auth-link">Sign Up</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
