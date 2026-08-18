import React, { useState } from 'react';
import { LogIn, Lock, Mail, Compass, AlertCircle, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export default function LoginPage({ setActivePage }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      setActivePage('dashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setEmail('kailash@example.com');
    setPassword('Password123!');
    setError('');
    setLoading(true);
    try {
      await login('kailash@example.com', 'Password123!');
      setActivePage('dashboard');
    } catch (err) {
      try {
        await api.auth.register('Kailash Student', 'kailash@example.com', 'Password123!');
        await login('kailash@example.com', 'Password123!');
        setActivePage('dashboard');
      } catch (regErr) {
        setError('Demo login error: ' + regErr.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '440px', padding: '3.5rem 1rem' }}>
      <div className="card" style={{ padding: '2.2rem 2rem', boxShadow: 'var(--shadow-lg)' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div className="brand-icon-wrapper" style={{ margin: '0 auto 1rem', width: '48px', height: '48px' }}>
            <Compass size={26} />
          </div>
          <h2 style={{ fontSize: '1.6rem' }}>Welcome Back</h2>
          <p style={{ fontSize: '0.88rem' }}>Sign in to manage and view your saved AI travel itineraries</p>
        </div>

        {error && (
          <div style={{
            padding: '0.75rem 1rem',
            background: '#fef2f2',
            border: '1px solid #fee2e2',
            borderRadius: 'var(--radius-md)',
            color: '#b91c1c',
            fontSize: '0.85rem',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">
              <Mail size={15} color="var(--primary-600)" />
              Email Address
            </label>
            <input
              type="email"
              className="form-control"
              placeholder="e.g. kailash@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <Lock size={15} color="var(--primary-600)" />
              Password
            </label>
            <input
              type="password"
              className="form-control"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.8rem', marginTop: '0.5rem' }}
            disabled={loading}
          >
            {loading ? <div className="loading-spinner" /> : <><LogIn size={18} /> Sign In</>}
          </button>
        </form>

        {/* Demo Fast Login Button */}
        <div style={{ marginTop: '1rem' }}>
          <button
            type="button"
            className="btn btn-secondary"
            style={{ width: '100%', borderStyle: 'dashed', borderColor: 'var(--primary-400)', color: 'var(--primary-700)' }}
            onClick={handleDemoLogin}
            disabled={loading}
          >
            <Sparkles size={16} />
            <span>1-Click Demo Login (College Viva)</span>
          </button>
        </div>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
          Don't have an account?{' '}
          <a href="#register" onClick={(e) => { e.preventDefault(); setActivePage('register'); }} style={{ fontWeight: 700 }}>
            Sign up
          </a>
        </div>
      </div>
    </div>
  );
}
