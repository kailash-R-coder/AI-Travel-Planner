import React from 'react';
import { Compass, Sparkles, MapPin, Bookmark, User as UserIcon, LogOut, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ activePage, setActivePage }) {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <header className="navbar">
      <div className="container navbar-container">
        {/* Brand Logo */}
        <div className="brand-logo" onClick={() => setActivePage('landing')}>
          <div className="brand-icon-wrapper">
            <Compass size={22} strokeWidth={2.5} />
          </div>
          <span>AI Travel Planner</span>
        </div>

        {/* Navigation Links */}
        <nav>
          <ul className="nav-links">
            <li>
              <button
                className={`nav-link-btn ${activePage === 'dashboard' ? 'active' : ''}`}
                onClick={() => setActivePage(isAuthenticated ? 'dashboard' : 'login')}
              >
                Dashboard
              </button>
            </li>
            <li>
              <button
                className={`nav-link-btn ${activePage === 'planner' ? 'active' : ''}`}
                onClick={() => setActivePage(isAuthenticated ? 'planner' : 'login')}
              >
                <Sparkles size={16} color="#0d9488" />
                Plan Trip
              </button>
            </li>
            <li>
              <button
                className={`nav-link-btn ${activePage === 'saved' ? 'active' : ''}`}
                onClick={() => setActivePage(isAuthenticated ? 'saved' : 'login')}
              >
                <Bookmark size={16} />
                Saved Trips
              </button>
            </li>
            <li>
              <button
                className={`nav-link-btn ${activePage === 'explore' ? 'active' : ''}`}
                onClick={() => setActivePage('explore')}
              >
                <MapPin size={16} />
                Explore Places
              </button>
            </li>
          </ul>
        </nav>

        {/* User Auth Buttons */}
        <div className="nav-auth-group">
          {isAuthenticated ? (
            <>
              <button
                className="nav-link-btn"
                onClick={() => setActivePage('profile')}
                title="User Profile"
              >
                <UserIcon size={18} />
                <span>{user?.name?.split(' ')[0] || 'Profile'}</span>
              </button>
              <button className="btn btn-secondary btn-sm" onClick={logout} title="Sign Out">
                <LogOut size={16} />
                <span>Sign Out</span>
              </button>
            </>
          ) : (
            <>
              <button className="btn btn-secondary btn-sm" onClick={() => setActivePage('login')}>
                <LogIn size={16} />
                <span>Sign In</span>
              </button>
              <button className="btn btn-primary btn-sm" onClick={() => setActivePage('register')}>
                <span>Get Started</span>
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
