import React from 'react';
import { User, Mail, Calendar, LogOut, ShieldCheck, GraduationCap, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function ProfilePage({ setActivePage }) {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    setActivePage('login');
  };

  return (
    <div className="container page-wrapper" style={{ maxWidth: '640px' }}>
      <div className="card" style={{ padding: '2.5rem 2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '2rem' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--primary-600), var(--primary-800))',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.75rem',
            fontWeight: 800
          }}>
            {user?.name ? user.name[0].toUpperCase() : 'U'}
          </div>

          <div>
            <span className="badge badge-emerald" style={{ marginBottom: '0.3rem' }}>
              <ShieldCheck size={13} /> Active Session
            </span>
            <h2 style={{ fontSize: '1.6rem' }}>{user?.name || 'User Profile'}</h2>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{user?.email}</div>
          </div>
        </div>

        {/* Profile Info Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1rem',
            background: 'var(--bg-subtle)',
            borderRadius: 'var(--radius-md)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--text-secondary)' }}>
              <User size={18} color="var(--primary-600)" />
              <span style={{ fontWeight: 600 }}>Full Name</span>
            </div>
            <span style={{ fontWeight: 700 }}>{user?.name}</span>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1rem',
            background: 'var(--bg-subtle)',
            borderRadius: 'var(--radius-md)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--text-secondary)' }}>
              <Mail size={18} color="var(--primary-600)" />
              <span style={{ fontWeight: 600 }}>Email Address</span>
            </div>
            <span style={{ fontWeight: 700 }}>{user?.email}</span>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1rem',
            background: 'var(--bg-subtle)',
            borderRadius: 'var(--radius-md)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--text-secondary)' }}>
              <Calendar size={18} color="var(--primary-600)" />
              <span style={{ fontWeight: 600 }}>Account Created</span>
            </div>
            <span style={{ fontWeight: 700 }}>
              {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Active Member'}
            </span>
          </div>
        </div>

        {/* Academic Project Info Card */}
        <div style={{
          padding: '1.25rem',
          background: 'linear-gradient(135deg, #f0fdfa, #ccfbf1)',
          border: '1px solid var(--primary-200)',
          borderRadius: 'var(--radius-md)',
          marginBottom: '2rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, color: 'var(--primary-800)', marginBottom: '0.4rem' }}>
            <GraduationCap size={18} />
            <span>Academic Project Verification</span>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--primary-900)' }}>
            <strong>AI Travel Planner</strong> developed for B.Tech AI & Data Science coursework. Features FastAPI backend, SQLAlchemy ORM, RAG semantic vector retrieval, live Open-Meteo weather integration, and Leaflet spatial routing.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn btn-primary" onClick={() => setActivePage('dashboard')} style={{ flex: 1 }}>
            Go to Dashboard
          </button>
          <button className="btn btn-danger" onClick={handleLogout}>
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
}
