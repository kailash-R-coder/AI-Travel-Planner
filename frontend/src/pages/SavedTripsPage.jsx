import React, { useState, useEffect } from 'react';
import { Bookmark, Calendar, Users, IndianRupee, Trash2, ArrowRight, Search, Plus, Compass } from 'lucide-react';
import { api } from '../services/api';

export default function SavedTripsPage({ setActivePage, onViewTrip }) {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchTrips = async () => {
    try {
      setLoading(true);
      const data = await api.trips.list();
      setTrips(data);
    } catch (err) {
      console.warn('Failed to load trips:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  const handleDeleteTrip = async (tripId, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to permanently delete this itinerary?')) {
      try {
        await api.trips.delete(tripId);
        setTrips((prev) => prev.filter((t) => t.id !== tripId));
      } catch (err) {
        alert('Failed to delete trip: ' + err.message);
      }
    }
  };

  const filteredTrips = trips.filter(
    (t) =>
      t.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.origin.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container page-wrapper">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <span className="badge badge-primary" style={{ marginBottom: '0.4rem' }}>
            Trip Collection
          </span>
          <h1>Saved Travel Itineraries</h1>
          <p>Access and review all your personalized AI itineraries</p>
        </div>

        <button className="btn btn-primary" onClick={() => setActivePage('planner')}>
          <Plus size={18} />
          <span>Plan New Trip</span>
        </button>
      </div>

      {/* Search Filter */}
      <div style={{ marginBottom: '2rem', maxWidth: '400px' }}>
        <div style={{ position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            className="form-control"
            placeholder="Search by destination..."
            style={{ paddingLeft: '2.4rem' }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <div className="loading-spinner" style={{ margin: '0 auto 1rem', borderColor: 'var(--primary-200)', borderTopColor: 'var(--primary-600)' }} />
          <p>Loading your saved itineraries...</p>
        </div>
      ) : filteredTrips.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3.5rem 1.5rem', background: 'var(--bg-subtle)' }}>
          <div className="brand-icon-wrapper" style={{ margin: '0 auto 1rem', width: '56px', height: '56px' }}>
            <Compass size={28} />
          </div>
          <h3>{searchTerm ? 'No matching trips found' : 'No Saved Trips Yet'}</h3>
          <p style={{ maxWidth: '400px', margin: '0.5rem auto 1.5rem' }}>
            {searchTerm
              ? `No itineraries match "${searchTerm}". Try a different search term.`
              : 'Generate your first AI travel plan and save it to your collection!'}
          </p>
          <button className="btn btn-primary" onClick={() => setActivePage('planner')}>
            <span>Create a Trip</span>
          </button>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.5rem'
        }}>
          {filteredTrips.map((trip) => (
            <div
              key={trip.id}
              className="card"
              style={{
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                borderTop: '4px solid var(--primary-600)'
              }}
              onClick={() => onViewTrip(trip.id)}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <div>
                    <span className="badge badge-primary" style={{ marginBottom: '0.3rem' }}>
                      {trip.trip_type} Trip
                    </span>
                    <h3 style={{ fontSize: '1.3rem' }}>{trip.destination}</h3>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      Origin: {trip.origin}
                    </div>
                  </div>

                  <button
                    onClick={(e) => handleDeleteTrip(trip.id, e)}
                    style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }}
                    title="Delete trip"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.8rem', fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '1rem 0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Calendar size={15} color="var(--primary-600)" />
                    <span>{trip.total_days} Days ({trip.start_date} to {trip.end_date})</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Users size={15} color="var(--primary-600)" />
                    <span>{trip.travelers} Traveler(s)</span>
                  </div>
                </div>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '1rem',
                borderTop: '1px solid var(--border-light)',
                marginTop: '0.5rem'
              }}>
                <div style={{ fontWeight: 800, color: 'var(--accent-emerald)', fontSize: '1.1rem' }}>
                  ₹{trip.budget.toLocaleString('en-IN')}
                </div>

                <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--primary-600)', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                  Open Itinerary <ArrowRight size={15} />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
