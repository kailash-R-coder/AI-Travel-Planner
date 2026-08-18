import React from 'react';
import { Sparkles, MapPin, Compass, ShieldCheck, CloudSun, IndianRupee, ArrowRight, CheckCircle2, Navigation, Layers } from 'lucide-react';

export default function LandingPage({ setActivePage, setSelectedDestination }) {
  const popularDestinations = [
    { name: 'Goa', state: 'India', type: 'Beaches & Nightlife', image: '🌴', color: '#0d9488' },
    { name: 'Manali', state: 'Himachal Pradesh', type: 'Snow & Adventure', image: '🏔️', color: '#0284c7' },
    { name: 'Jaipur', state: 'Rajasthan', type: 'Heritage & Palaces', image: '🏰', color: '#d97706' },
    { name: 'Kerala', state: 'India', type: 'Backwaters & Nature', image: '🛶', color: '#059669' },
    { name: 'Ladakh', state: 'Himalayas', type: 'High Altitude Passes', image: '🏍️', color: '#7c3aed' },
    { name: 'Paris', state: 'France', type: 'Art & Romantic Icons', image: '🗼', color: '#e11d48' },
  ];

  const handleDestinationClick = (destName) => {
    if (setSelectedDestination) {
      setSelectedDestination(destName);
    }
    setActivePage('planner');
  };

  return (
    <div>
      {/* Hero Section */}
      <section style={{
        padding: '4.5rem 0 3.5rem',
        background: 'radial-gradient(ellipse at top, #ccfbf1 0%, #f8fafc 70%)',
        textAlign: 'center'
      }}>
        <div className="container" style={{ maxWidth: '860px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            background: '#ffffff',
            padding: '0.4rem 1rem',
            borderRadius: 'var(--radius-full)',
            border: '1px solid var(--border-light)',
            boxShadow: 'var(--shadow-sm)',
            marginBottom: '1.5rem',
            fontSize: '0.85rem',
            fontWeight: 700,
            color: 'var(--primary-700)'
          }}>
            <Sparkles size={16} color="var(--primary-600)" />
            AI-Driven Hybrid Recommendation & RAG Architecture
          </div>

          <h1 style={{ fontSize: '3rem', marginBottom: '1.2rem', lineHeight: 1.15 }}>
            Craft Your Perfect Journey with <span style={{ color: 'var(--primary-600)' }}>Intelligent AI Planning</span>
          </h1>

          <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', marginBottom: '2.5rem', lineHeight: 1.6 }}>
            Generate grounded day-by-day itineraries tailored to your interests, budget in INR, traveler style, and real-time live weather forecasts.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              className="btn btn-primary btn-lg"
              onClick={() => setActivePage('planner')}
              style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}
            >
              <Sparkles size={20} />
              <span>Start Planning Now</span>
              <ArrowRight size={18} />
            </button>
            <button
              className="btn btn-secondary btn-lg"
              onClick={() => setActivePage('explore')}
            >
              <Compass size={19} />
              <span>Explore Verified Places</span>
            </button>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section style={{ padding: '3.5rem 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h2>Built with Explainable Multi-Criteria AI</h2>
            <p>Combining RAG vector embeddings, live APIs, and deterministic decision modeling</p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1.5rem'
          }}>
            <div className="card">
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--primary-100)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem'
              }}>
                <Layers size={24} color="var(--primary-700)" />
              </div>
              <h3>RAG Grounded Context</h3>
              <p>Eliminates LLM hallucinations by retrieving verified attraction databases and true operating details.</p>
            </div>

            <div className="card">
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: 'var(--radius-md)',
                background: '#fef3c7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem'
              }}>
                <CloudSun size={24} color="#d97706" />
              </div>
              <h3>Live Weather Adaptation</h3>
              <p>Forecasts weather using Open-Meteo API and automatically optimizes indoor vs. outdoor activity schedules.</p>
            </div>

            <div className="card">
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: 'var(--radius-md)',
                background: '#e0f2fe',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem'
              }}>
                <IndianRupee size={24} color="#0284c7" />
              </div>
              <h3>Realistic INR Budgeting</h3>
              <p>Smart percentage budget split across accommodations, regional food, sightseeing, and emergency buffers.</p>
            </div>

            <div className="card">
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: 'var(--radius-md)',
                background: '#ede9fe',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem'
              }}>
                <Navigation size={24} color="#7c3aed" />
              </div>
              <h3>Interactive Map Routing</h3>
              <p>Visual route sequences on OpenStreetMap with Haversine distance computations and transit estimates.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Destinations Showcase */}
      <section style={{ padding: '3.5rem 0 5rem', background: '#ffffff', borderTop: '1px solid var(--border-light)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2>Popular Featured Destinations</h2>
              <p>Click any destination to generate a customized AI itinerary instantly</p>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={() => setActivePage('explore')}>
              View All Places
            </button>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem'
          }}>
            {popularDestinations.map((dest, idx) => (
              <div
                key={idx}
                className="card"
                style={{
                  cursor: 'pointer',
                  transition: 'transform var(--transition-fast), box-shadow var(--transition-fast)',
                  borderTop: `4px solid ${dest.color}`,
                }}
                onClick={() => handleDestinationClick(dest.name)}
              >
                <div style={{ fontSize: '2.5rem', marginBottom: '0.8rem' }}>{dest.image}</div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.2rem' }}>{dest.name}</h3>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.6rem' }}>
                  {dest.state}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                  <span className="badge badge-primary">{dest.type}</span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary-600)', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                    Plan <ArrowRight size={14} />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
