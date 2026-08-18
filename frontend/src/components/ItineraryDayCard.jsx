import React from 'react';
import { Sun, CloudSun, Moon, IndianRupee, Clock, MapPin, Edit2, Trash2, Plus, Utensils, Camera, Compass } from 'lucide-react';

export default function ItineraryDayCard({
  dayNumber,
  items = [],
  onEditItem,
  onDeleteItem,
  onAddItem
}) {
  const getTimeIcon = (timeSlot) => {
    const slot = timeSlot.toLowerCase();
    if (slot.includes('morning')) return <Sun size={18} color="#d97706" />;
    if (slot.includes('afternoon')) return <CloudSun size={18} color="#0284c7" />;
    if (slot.includes('evening') || slot.includes('night')) return <Moon size={18} color="#7c3aed" />;
    return <Clock size={18} color="#0d9488" />;
  };

  const getCategoryBadge = (category) => {
    const cat = (category || '').toLowerCase();
    if (cat.includes('food') || cat.includes('dining')) return <span className="badge badge-amber"><Utensils size={12} /> Food</span>;
    if (cat.includes('beach')) return <span className="badge badge-blue"><Compass size={12} /> Beaches</span>;
    if (cat.includes('adventure')) return <span className="badge badge-rose"><Compass size={12} /> Adventure</span>;
    if (cat.includes('history')) return <span className="badge badge-purple"><Camera size={12} /> History</span>;
    if (cat.includes('nature')) return <span className="badge badge-emerald"><Compass size={12} /> Nature</span>;
    return <span className="badge badge-primary"><MapPin size={12} /> {category || 'Sightseeing'}</span>;
  };

  const dayTotalCost = items.reduce((sum, item) => sum + (Number(item.estimated_cost) || 0), 0);

  return (
    <div className="card" style={{ marginBottom: '1.75rem', borderLeft: '4px solid var(--primary-600)' }}>
      {/* Day Card Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.8rem',
        paddingBottom: '1rem',
        borderBottom: '1px solid var(--border-light)',
        marginBottom: '1.25rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <div style={{
            background: 'var(--primary-600)',
            color: 'white',
            fontWeight: 800,
            padding: '0.35rem 0.85rem',
            borderRadius: 'var(--radius-md)',
            fontFamily: 'var(--font-heading)',
            fontSize: '1.1rem'
          }}>
            Day {dayNumber}
          </div>
          <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
            {items.length} Activities planned
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            Day Cost: <span style={{ color: 'var(--accent-emerald)' }}>₹{dayTotalCost.toLocaleString('en-IN')}</span>
          </div>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => onAddItem(dayNumber)}
            title="Add activity to this day"
          >
            <Plus size={15} />
            <span>Add Activity</span>
          </button>
        </div>
      </div>

      {/* Activity Timeline Slots */}
      {items.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-muted)' }}>
          No activities scheduled for Day {dayNumber}. Click "+ Add Activity" to add one!
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {items.map((item) => (
            <div key={item.id} className="timeline-slot">
              {/* Left Column: Time & Transit */}
              <div className="time-slot-badge">
                <div className="slot-name">
                  {getTimeIcon(item.time)}
                  <span>{item.time}</span>
                </div>
                {item.travel_time && (
                  <div className="slot-transit">
                    <Clock size={12} style={{ display: 'inline', marginRight: '3px' }} />
                    {item.travel_time}
                  </div>
                )}
              </div>

              {/* Right Column: Place Details & Actions */}
              <div className="slot-content">
                <div className="slot-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                    <span className="slot-title">{item.place}</span>
                    {getCategoryBadge(item.activity_type)}
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span className="slot-cost">
                      ₹{(item.estimated_cost || 0).toLocaleString('en-IN')}
                    </span>
                    <button
                      onClick={() => onEditItem(item)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                      title="Edit Activity"
                    >
                      <Edit2 size={15} />
                    </button>
                    <button
                      onClick={() => onDeleteItem(item.id)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}
                      title="Delete Activity"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
