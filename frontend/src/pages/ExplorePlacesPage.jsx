import React, { useState, useEffect } from 'react';
import { MapPin, Search, Sparkles, Filter } from 'lucide-react';
import { api } from '../services/api';
import PlaceCard from '../components/PlaceCard';

export default function ExplorePlacesPage({ setActivePage, setSelectedDestination }) {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDestination, setSelectedDest] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [search, setSearch] = useState('');

  const destinationsList = ['', 'Goa', 'Jaipur', 'Manali', 'Kerala', 'Varanasi', 'Ladakh', 'Agra', 'Dubai', 'Paris'];
  const categoriesList = ['', 'Nature', 'Food', 'Adventure', 'History', 'Shopping', 'Beaches'];

  const fetchPlaces = async () => {
    try {
      setLoading(true);
      const params = {};
      if (selectedDestination) params.destination = selectedDestination;
      if (selectedCategory) params.category = selectedCategory;
      const data = await api.places.list(params);
      setPlaces(data);
    } catch (err) {
      console.warn('Failed to load places:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaces();
  }, [selectedDestination, selectedCategory]);

  const filteredPlaces = places.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container page-wrapper">
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <span className="badge badge-primary" style={{ marginBottom: '0.5rem' }}>
          Attraction Knowledge Base
        </span>
        <h1>Explore Verified Tourist Attractions</h1>
        <p>Ground-truth curated attractions with verified locations, categories, and average costs in INR</p>
      </div>

      {/* Filter Toolbar */}
      <div className="card" style={{ padding: '1.25rem', marginBottom: '2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div>
            <label className="form-label" style={{ fontSize: '0.8rem' }}>Filter by Destination</label>
            <select
              className="form-control"
              value={selectedDestination}
              onChange={(e) => setSelectedDest(e.target.value)}
            >
              <option value="">All Destinations</option>
              {destinationsList.filter(Boolean).map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="form-label" style={{ fontSize: '0.8rem' }}>Filter by Category</label>
            <select
              className="form-control"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categoriesList.filter(Boolean).map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="form-label" style={{ fontSize: '0.8rem' }}>Search by Name / Keyword</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Fort, Beach, Waterfall..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Places Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <div className="loading-spinner" style={{ margin: '0 auto 1rem', borderColor: 'var(--primary-200)', borderTopColor: 'var(--primary-600)' }} />
          <p>Loading verified destination attractions...</p>
        </div>
      ) : filteredPlaces.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
          <h3>No Attractions Found</h3>
          <p>Try clearing your destination or category filters.</p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem'
        }}>
          {filteredPlaces.map((place) => (
            <PlaceCard key={place.id} place={place} />
          ))}
        </div>
      )}
    </div>
  );
}
