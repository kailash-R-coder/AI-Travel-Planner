import React, { useState } from 'react';
import { UserPlus, User, Lock, Mail, Compass, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage({ setActivePage }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    try {
      await register(name, email, password);
      setActivePage('dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try a different email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '460px', padding: '3.5rem 1rem' }}>
      <div className="card" style={{ padding: '2.2rem 2rem', boxShadow: 'var(--shadow-lg)' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div className="brand-icon-wrapper" style={{ margin: '0 auto 1rem', width: '48px', height: '48px' }}>
            <Compass size={26} />
          </div>
          <h2 style={{ fontSize: '1.6rem' }}>Create Your Account</h2>
          <p style={{ fontSize: '0.88rem' }}>Start generating personalized AI travel itineraries</p>
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
              <User size={15} color="var(--primary-600)" />
              Full Name
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Kailash N"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

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
              Password (min. 6 chars)
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
            {loading ? <div className="loading-spinner" /> : <><UserPlus size={18} /> Create Account</>}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
          Already have an account?{' '}
          <a href="#login" onClick={(e) => { e.preventDefault(); setActivePage('login'); }} style={{ fontWeight: 700 }}>
            Sign in
          </a>
        </div>
      </div>
    </div>
  );
}
