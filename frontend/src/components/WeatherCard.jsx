import React from 'react';
import { Sun, Cloud, CloudSun, CloudRain, CloudLightning, Snowflake, Droplets, Wind } from 'lucide-react';

export default function WeatherCard({ forecast, destination }) {
  if (!forecast || forecast.length === 0) return null;

  const getWeatherIcon = (iconName) => {
    switch (iconName) {
      case 'sun': return <Sun size={24} color="#f59e0b" />;
      case 'cloud-sun': return <CloudSun size={24} color="#0284c7" />;
      case 'cloud': return <Cloud size={24} color="#64748b" />;
      case 'cloud-rain':
      case 'cloud-drizzle':
      case 'cloud-heavy-rain': return <CloudRain size={24} color="#0284c7" />;
      case 'cloud-lightning': return <CloudLightning size={24} color="#7c3aed" />;
      case 'cloud-snow':
      case 'snowflake': return <Snowflake size={24} color="#38bdf8" />;
      default: return <CloudSun size={24} color="#0d9488" />;
    }
  };

  return (
    <div className="card" style={{ marginBottom: '1.5rem', background: 'linear-gradient(180deg, #ffffff 0%, #f0fdfa 100%)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sun size={20} color="#f59e0b" />
            Live Weather Forecast for {destination}
          </h3>
          <p style={{ fontSize: '0.85rem' }}>Real-time meteorological forecast via Open-Meteo API</p>
        </div>
        <span className="badge badge-emerald">Live Grounded Data</span>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
        gap: '0.8rem'
      }}>
        {forecast.map((day, idx) => (
          <div
            key={idx}
            style={{
              background: '#ffffff',
              borderRadius: 'var(--radius-md)',
              padding: '0.85rem 0.7rem',
              border: '1px solid var(--border-light)',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.4rem',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
              {day.date ? new Date(day.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) : `Day ${idx + 1}`}
            </div>
            
            <div style={{ margin: '0.2rem 0' }}>
              {getWeatherIcon(day.icon)}
            </div>

            <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)', minHeight: '36px', display: 'flex', alignItems: 'center' }}>
              {day.condition}
            </div>

            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              {day.temp_max}°C <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>/ {day.temp_min}°C</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', color: day.is_rainy ? '#0284c7' : 'var(--text-muted)' }}>
              <Droplets size={12} />
              <span>{day.precipitation_probability}% rain</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
