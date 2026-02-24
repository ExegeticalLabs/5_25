import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Auth.css';

const SignupPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string; confirm?: string; general?: string }>({});
  const { signup } = useAuth();
  const navigate = useNavigate();

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validate = (): boolean => {
    const newErrors: typeof errors = {};
    if (!name.trim()) newErrors.name = 'Name is required.';
    if (!validateEmail(email)) newErrors.email = 'Please enter a valid email address.';
    if (password.length < 6) newErrors.password = 'Password must be at least 6 characters.';
    if (password !== confirmPassword) newErrors.confirm = 'Passwords do not match.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setErrors({});
    try {
      await signup(email, password, name.trim());
      navigate('/setup');
    } catch (err: any) {
      setErrors({ general: err.message || 'Signup failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const allFilled = name && validateEmail(email) && password.length >= 6 && confirmPassword === password;

  return (
    <div className="auth-screen screen">
      <div className="auth-top">
        <div className="app-logo">
          <span className="logo-main">5/25</span>
          <span className="logo-sub">FITNESS</span>
        </div>
        <h1 className="auth-headline">Start your journey.</h1>
        <p className="auth-subtext">Create your account to begin.</p>
      </div>

      <div className="auth-form-container">
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label">Name</label>
            <input
              type="text"
              className={`text-input ${errors.name ? 'error' : ''}`}
              placeholder="Your name"
              value={name}
              onChange={(e) => { setName(e.target.value); setErrors(prev => ({ ...prev, name: undefined })); }}
              autoComplete="name"
            />
            {errors.name && <p className="error-text">{errors.name}</p>}
          </div>

          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              className={`text-input ${errors.email ? 'error' : ''}`}
              placeholder="you@example.com"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setErrors(prev => ({ ...prev, email: undefined })); }}
              autoComplete="email"
              autoCapitalize="none"
            />
            {errors.email && <p className="error-text">{errors.email}</p>}
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className={`text-input ${errors.password ? 'error' : ''}`}
              placeholder="Min. 6 characters"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setErrors(prev => ({ ...prev, password: undefined })); }}
              autoComplete="new-password"
            />
            {errors.password && <p className="error-text">{errors.password}</p>}
          </div>

          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <input
              type="password"
              className={`text-input ${errors.confirm ? 'error' : ''}`}
              placeholder="Repeat password"
              value={confirmPassword}
              onChange={(e) => { setConfirmPassword(e.target.value); setErrors(prev => ({ ...prev, confirm: undefined })); }}
              autoComplete="new-password"
            />
            {errors.confirm && <p className="error-text">{errors.confirm}</p>}
          </div>

          {errors.general && <p className="error-text">{errors.general}</p>}

          <button type="submit" className="btn-primary" disabled={loading || !allFilled}>
            {loading && <span className="spinner" />}
            {loading ? 'Creating Account...' : 'SIGN UP'}
          </button>
        </form>

        <div className="auth-footer">
          <span className="auth-footer-text">Already have an account?</span>
          <Link to="/login" className="auth-link">Log In</Link>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
