import React, { useState, useEffect } from 'react';
import { Sparkles, Calendar, MapPin, IndianRupee, Users, ArrowRight, Bookmark, Compass, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export default function DashboardPage({ setActivePage, onViewTrip }) {
  const { user } = useAuth();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

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
    if (window.confirm('Are you sure you want to delete this trip itinerary?')) {
      try {
        await api.trips.delete(tripId);
        setTrips((prev) => prev.filter((t) => t.id !== tripId));
      } catch (err) {
        alert('Failed to delete trip: ' + err.message);
      }
    }
  };

  const totalBudgetManaged = trips.reduce((sum, t) => sum + (t.budget || 0), 0);
  const totalDaysPlanned = trips.reduce((sum, t) => sum + (t.total_days || 0), 0);

  return (
    <div className="container page-wrapper">
      {/* Dashboard Welcome Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1.25rem',
        marginBottom: '2.5rem'
      }}>
        <div>
          <span className="badge badge-primary" style={{ marginBottom: '0.4rem' }}>
            Traveler Dashboard
          </span>
          <h1>Welcome, {user?.name || 'Explorer'}! 👋</h1>
          <p>Plan, customize, and manage your AI-generated travel itineraries.</p>
        </div>

        <button
          className="btn btn-primary btn-lg"
          onClick={() => setActivePage('planner')}
        >
          <Sparkles size={20} />
          <span>Plan New Trip</span>
        </button>
      </div>

      {/* Analytics Metric Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1.25rem',
        marginBottom: '2.5rem'
      }}>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--primary-100)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Bookmark size={24} color="var(--primary-700)" />
          </div>
          <div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>SAVED TRIPS</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)' }}>{trips.length}</div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: 'var(--radius-md)',
            background: '#fef3c7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Calendar size={24} color="#d97706" />
          </div>
          <div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>TOTAL DAYS</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)' }}>{totalDaysPlanned}</div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: 'var(--radius-md)',
            background: '#e0f2fe',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <IndianRupee size={24} color="#0284c7" />
          </div>
          <div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>TOTAL BUDGET</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              ₹{totalBudgetManaged.toLocaleString('en-IN')}
            </div>
          </div>
        </div>
      </div>

      {/* Saved Trips Section */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h2>Your Planned Trips</h2>
          {trips.length > 0 && (
            <button className="btn btn-secondary btn-sm" onClick={() => setActivePage('saved')}>
              View All ({trips.length})
            </button>
          )}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <div className="loading-spinner" style={{ margin: '0 auto 1rem', borderColor: 'var(--primary-200)', borderTopColor: 'var(--primary-600)' }} />
            <p>Loading your travel itineraries...</p>
          </div>
        ) : trips.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '3.5rem 1.5rem', background: 'var(--bg-subtle)' }}>
            <div className="brand-icon-wrapper" style={{ margin: '0 auto 1rem', width: '56px', height: '56px' }}>
              <Compass size={28} />
            </div>
            <h3>No Trips Planned Yet</h3>
            <p style={{ maxWidth: '440px', margin: '0.5rem auto 1.5rem' }}>
              Enter your destination, interests, and budget to let our AI generate a personalized day-by-day itinerary.
            </p>
            <button className="btn btn-primary" onClick={() => setActivePage('planner')}>
              <Sparkles size={18} />
              <span>Create Your First Trip</span>
            </button>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '1.5rem'
          }}>
            {trips.map((trip) => (
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
                        From: {trip.origin}
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
                    View Itinerary <ArrowRight size={15} />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
