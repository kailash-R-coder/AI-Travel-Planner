import React, { useState, useEffect } from 'react';
import {
  Sparkles, MapPin, Calendar, IndianRupee, Users, Compass,
  Plane, Train, Bus, Car, Hotel, AlertCircle, Check, ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function TripPlannerPage({ setActivePage, onTripGenerated, initialDestination = '' }) {
  const { isAuthenticated } = useAuth();

  // Form State
  const [origin, setOrigin] = useState('Mumbai');
  const [destination, setDestination] = useState(initialDestination || 'Goa');
  
  // Default to upcoming dates (7 days from now, 3 days duration)
  const defaultStart = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const defaultEnd = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const [startDate, setStartDate] = useState(defaultStart);
  const [endDate, setEndDate] = useState(defaultEnd);
  const [budget, setBudget] = useState(25000);
  const [travelers, setTravelers] = useState(2);
  const [tripType, setTripType] = useState('Friends');
  const [interests, setInterests] = useState(['Beaches', 'Food', 'Adventure']);
  const [transportation, setTransportation] = useState('Flight');
  const [accommodation, setAccommodation] = useState('Standard');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialDestination) {
      setDestination(initialDestination);
    }
  }, [initialDestination]);

  // Calculate day count
  const calculateDays = () => {
    if (!startDate || !endDate) return 1;
    const s = new Date(startDate);
    const e = new Date(endDate);
    const diffTime = e - s;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays > 0 ? diffDays : 1;
  };

  const daysCount = calculateDays();

  // Multi-select interests toggle
  const toggleInterest = (interest) => {
    if (interests.includes(interest)) {
      setInterests(interests.filter((i) => i !== interest));
    } else {
      setInterests([...interests, interest]);
    }
  };

  const popularDestinations = ['Goa', 'Manali', 'Jaipur', 'Kerala', 'Varanasi', 'Ladakh', 'Agra', 'Dubai', 'Paris'];
  const allInterests = ['Nature', 'Food', 'Adventure', 'History', 'Shopping', 'Beaches'];
  const tripTypes = ['Solo', 'Couple', 'Family', 'Friends'];
  const transportOptions = [
    { label: 'Flight', icon: Plane },
    { label: 'Train', icon: Train },
    { label: 'Bus', icon: Bus },
    { label: 'Car / Drive', icon: Car },
  ];
  const stayOptions = [
    { label: 'Hostel', desc: 'Budget & Social (~₹800/nt)' },
    { label: 'Budget', desc: 'Clean & Affordable (~₹1,800/nt)' },
    { label: 'Standard', desc: 'Comfortable 3-Star (~₹3,500/nt)' },
    { label: 'Luxury', desc: 'Premium 5-Star (~₹9,500/nt)' },
    { label: 'Resort', desc: 'Spa & Scenic (~₹7,500/nt)' },
  ];

  const handleGenerate = async (e) => {
    e.preventDefault();
    setError('');

    if (!origin.trim() || !destination.trim()) {
      setError('Please provide both origin and destination.');
      return;
    }

    if (new Date(endDate) < new Date(startDate)) {
      setError('End date cannot be earlier than start date.');
      return;
    }

    if (!isAuthenticated) {
      setActivePage('login');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        origin: origin.trim(),
        destination: destination.trim(),
        start_date: startDate,
        end_date: endDate,
        budget: Number(budget),
        travelers: Number(travelers),
        trip_type: tripType,
        interests: interests.length > 0 ? interests : ['Nature', 'Food'],
        transportation: transportation,
        accommodation: accommodation,
      };

      const generatedTrip = await api.trips.generate(payload);

      // Trigger Confetti Celebration!
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (cErr) {}

      onTripGenerated(generatedTrip);
      setActivePage('itinerary');
    } catch (err) {
      setError(err.message || 'Failed to generate itinerary. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container page-wrapper" style={{ maxWidth: '920px' }}>
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <span className="badge badge-primary" style={{ marginBottom: '0.5rem' }}>
          <Sparkles size={14} /> AI Trip Generator
        </span>
        <h1 style={{ fontSize: '2.4rem', marginBottom: '0.5rem' }}>
          Personalize Your Dream Travel Itinerary
        </h1>
        <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)' }}>
          Enter your preferences to receive a live-weather-optimized, RAG-grounded day-by-day travel plan.
        </p>
      </div>

      {error && (
        <div style={{
          padding: '0.85rem 1.25rem',
          background: '#fef2f2',
          border: '1px solid #fee2e2',
          borderRadius: 'var(--radius-md)',
          color: '#b91c1c',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem'
        }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleGenerate} className="card" style={{ padding: '2rem 2.2rem', boxShadow: 'var(--shadow-md)' }}>
        {/* Step 1: Destination & Origin */}
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MapPin size={20} color="var(--primary-600)" />
            1. Where are you traveling?
          </h3>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Starting Location (Origin)</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Mumbai, New Delhi, Bengaluru"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Destination City / Region</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Goa, Manali, Jaipur, Kerala, Paris"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Quick Select Destination Badges */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.4rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Popular:</span>
            {popularDestinations.map((city) => (
              <button
                type="button"
                key={city}
                onClick={() => setDestination(city)}
                style={{
                  background: destination.toLowerCase() === city.toLowerCase() ? 'var(--primary-100)' : 'var(--bg-subtle)',
                  color: destination.toLowerCase() === city.toLowerCase() ? 'var(--primary-800)' : 'var(--text-secondary)',
                  border: '1px solid var(--border-light)',
                  borderRadius: 'var(--radius-full)',
                  padding: '0.2rem 0.65rem',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                {city}
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: Dates & Duration */}
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Calendar size={20} color="var(--primary-600)" />
            2. Travel Dates & Duration ({daysCount} Days)
          </h3>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Start Date</label>
              <input
                type="date"
                className="form-control"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">End Date</label>
              <input
                type="date"
                className="form-control"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </div>
          </div>
        </div>

        {/* Step 3: Budget, Travelers & Trip Type */}
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <IndianRupee size={20} color="var(--primary-600)" />
            3. Budget & Travel Group
          </h3>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">
                Total Budget: <strong style={{ color: 'var(--accent-emerald)', fontSize: '1.1rem' }}>₹{Number(budget).toLocaleString('en-IN')}</strong>
              </label>
              <input
                type="range"
                min="5000"
                max="250000"
                step="2500"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--primary-600)', margin: '0.5rem 0' }}
              />
              <input
                type="number"
                className="form-control"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                min="1000"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Number of Travelers</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginTop: '0.2rem' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ width: '42px', height: '42px', padding: 0 }}
                  onClick={() => setTravelers(Math.max(1, travelers - 1))}
                >
                  -
                </button>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, minWidth: '40px', textAlign: 'center' }}>
                  {travelers}
                </div>
                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ width: '42px', height: '42px', padding: 0 }}
                  onClick={() => setTravelers(travelers + 1)}
                >
                  +
                </button>
              </div>
            </div>
          </div>

          <div className="form-group" style={{ marginTop: '1rem' }}>
            <label className="form-label">Trip Style</label>
            <div className="chips-grid">
              {tripTypes.map((type) => (
                <button
                  type="button"
                  key={type}
                  className={`chip-btn ${tripType === type ? 'selected' : ''}`}
                  onClick={() => setTripType(type)}
                >
                  <Users size={15} />
                  <span>{type}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Step 4: Interests Multi-Select */}
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Compass size={20} color="var(--primary-600)" />
            4. Select Your Travel Interests
          </h3>

          <div className="chips-grid">
            {allInterests.map((interest) => {
              const isSel = interests.includes(interest);
              return (
                <button
                  type="button"
                  key={interest}
                  className={`chip-btn ${isSel ? 'selected' : ''}`}
                  onClick={() => toggleInterest(interest)}
                >
                  {isSel && <Check size={14} />}
                  <span>{interest}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 5: Transportation & Accommodation */}
        <div style={{ marginBottom: '2.5rem' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Hotel size={20} color="var(--primary-600)" />
            5. Travel & Stay Preferences
          </h3>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Preferred Transportation</label>
              <div className="chips-grid">
                {transportOptions.map((opt) => {
                  const Icon = opt.icon;
                  return (
                    <button
                      type="button"
                      key={opt.label}
                      className={`chip-btn ${transportation === opt.label ? 'selected' : ''}`}
                      onClick={() => setTransportation(opt.label)}
                    >
                      <Icon size={16} />
                      <span>{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Accommodation Tier</label>
              <select
                className="form-control"
                value={accommodation}
                onChange={(e) => setAccommodation(e.target.value)}
              >
                {stayOptions.map((opt) => (
                  <option key={opt.label} value={opt.label}>
                    {opt.label} — {opt.desc}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Prominent Generate Button */}
        <button
          type="submit"
          className="btn btn-primary btn-lg"
          style={{ width: '100%', padding: '1rem', fontSize: '1.15rem' }}
          disabled={loading}
        >
          {loading ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
              <div className="loading-spinner" />
              <span>Analyzing live weather, places RAG & synthesizing itinerary...</span>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Sparkles size={22} />
              <span>Generate AI Travel Itinerary</span>
              <ArrowRight size={20} />
            </div>
          )}
        </button>
      </form>
    </div>
  );
}
