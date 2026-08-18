import React from 'react';
import { Compass, Heart, GraduationCap, Cpu } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{
      background: '#ffffff',
      borderTop: '1px solid var(--border-light)',
      padding: '2.5rem 0',
      marginTop: 'auto'
    }}>
      <div className="container" style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '1.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <div className="brand-icon-wrapper" style={{ width: '32px', height: '32px' }}>
            <Compass size={18} />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontFamily: 'var(--font-heading)', color: 'var(--primary-800)' }}>
              AI Travel Planner
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Personalized Multi-Criteria Itinerary Engine
            </div>
          </div>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          fontSize: '0.85rem',
          color: 'var(--text-secondary)'
        }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
            <GraduationCap size={16} color="var(--primary-600)" />
            B.Tech AI & Data Science Final Project
          </span>
          <span>•</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
            <Cpu size={16} color="var(--accent-amber)" />
            Powered by FastAPI & RAG
          </span>
        </div>
      </div>
    </footer>
  );
}
