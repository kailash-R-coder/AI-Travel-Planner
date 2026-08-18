import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ChatDrawer from './components/ChatDrawer';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import TripPlannerPage from './pages/TripPlannerPage';
import ItineraryViewPage from './pages/ItineraryViewPage';
import SavedTripsPage from './pages/SavedTripsPage';
import ExplorePlacesPage from './pages/ExplorePlacesPage';
import ProfilePage from './pages/ProfilePage';
import { useAuth } from './context/AuthContext';
import { api } from './services/api';

export default function App() {
  const [activePage, setActivePage] = useState('landing');
  const [activeTrip, setActiveTrip] = useState(null);
  const [initialDestination, setInitialDestination] = useState('');
  const { isAuthenticated, loading } = useAuth();

  const handleTripGenerated = (tripData) => {
    setActiveTrip(tripData);
    setActivePage('itinerary');
  };

  const handleViewTrip = async (tripId) => {
    try {
      const fullTrip = await api.trips.get(tripId);
      setActiveTrip(fullTrip);
      setActivePage('itinerary');
    } catch (err) {
      alert('Failed to load trip: ' + err.message);
    }
  };

  const handleSelectDestinationForPlanner = (destName) => {
    setInitialDestination(destName);
    setActivePage('planner');
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', flexDirection: 'column', gap: '1rem' }}>
        <div className="loading-spinner" style={{ width: '36px', height: '36px', borderColor: 'var(--primary-200)', borderTopColor: 'var(--primary-600)' }} />
        <p style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Loading AI Travel Planner...</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar activePage={activePage} setActivePage={setActivePage} />

      <main style={{ flex: 1 }}>
        {activePage === 'landing' && (
          <LandingPage
            setActivePage={setActivePage}
            setSelectedDestination={handleSelectDestinationForPlanner}
          />
        )}

        {activePage === 'login' && <LoginPage setActivePage={setActivePage} />}

        {activePage === 'register' && <RegisterPage setActivePage={setActivePage} />}

        {activePage === 'dashboard' && (
          <DashboardPage setActivePage={setActivePage} onViewTrip={handleViewTrip} />
        )}

        {activePage === 'planner' && (
          <TripPlannerPage
            setActivePage={setActivePage}
            onTripGenerated={handleTripGenerated}
            initialDestination={initialDestination}
          />
        )}

        {activePage === 'itinerary' && (
          <ItineraryViewPage
            trip={activeTrip}
            onBack={() => setActivePage(isAuthenticated ? 'dashboard' : 'planner')}
            onUpdateTrip={(updated) => setActiveTrip(updated)}
          />
        )}

        {activePage === 'saved' && (
          <SavedTripsPage setActivePage={setActivePage} onViewTrip={handleViewTrip} />
        )}

        {activePage === 'explore' && (
          <ExplorePlacesPage
            setActivePage={setActivePage}
            setSelectedDestination={handleSelectDestinationForPlanner}
          />
        )}

        {activePage === 'profile' && <ProfilePage setActivePage={setActivePage} />}
      </main>

      {/* Global AI Chatbot Drawer (Always accessible) */}
      {activePage !== 'itinerary' && <ChatDrawer currentTrip={activeTrip} />}

      <Footer />
    </div>
  );
}
