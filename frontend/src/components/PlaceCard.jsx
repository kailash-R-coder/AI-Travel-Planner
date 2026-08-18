import React from 'react';
import { Star, MapPin, IndianRupee, Clock, Sparkles } from 'lucide-react';

export default function PlaceCard({ place, onSelect }) {
  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.6rem' }}>
        <div>
          <span className="badge badge-primary" style={{ marginBottom: '0.4rem' }}>
            {place.category}
          </span>
          <h4 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{place.name}</h4>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            <MapPin size={13} />
            <span>{place.location}</span>
          </div>
        </div>

        {place.match_score && (
          <div style={{
            background: 'linear-gradient(135deg, var(--primary-600), var(--primary-800))',
            color: 'white',
            borderRadius: 'var(--radius-md)',
            padding: '0.3rem 0.6rem',
            textAlign: 'center',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', fontWeight: 700 }}>Match</div>
            <div style={{ fontSize: '0.95rem', fontWeight: 800 }}>{place.match_score}%</div>
          </div>
        )}
      </div>

      <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', flex: 1, marginBottom: '0.8rem' }}>
        {place.description}
      </p>

      {/* Tags */}
      {place.tags && place.tags.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginBottom: '0.8rem' }}>
          {place.tags.slice(0, 4).map((tag, idx) => (
            <span key={idx} style={{
              fontSize: '0.75rem',
              background: 'var(--bg-subtle)',
              padding: '0.15rem 0.5rem',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--text-secondary)'
            }}>
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Meta Footer */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: '0.75rem',
        borderTop: '1px solid var(--border-light)',
        fontSize: '0.85rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: 700, color: '#d97706' }}>
          <Star size={15} fill="#d97706" />
          <span>{place.rating} / 5</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', fontWeight: 700, color: 'var(--accent-emerald)' }}>
          <IndianRupee size={14} />
          <span>{place.avg_cost > 0 ? `₹${place.avg_cost}` : 'Free Entry'}</span>
        </div>
      </div>
    </div>
  );
}
