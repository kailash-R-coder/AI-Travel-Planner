import React from 'react';
import { IndianRupee, Bed, Utensils, Ticket, Car, ShieldAlert, AlertCircle } from 'lucide-react';

export default function BudgetSummary({ budgetBreakdown, totalBudget, travelers, days }) {
  if (!budgetBreakdown) return null;

  const items = [
    { label: 'Stay & Hotels', amount: budgetBreakdown.stay || 0, icon: Bed, color: '#0d9488', pct: 35 },
    { label: 'Food & Dining', amount: budgetBreakdown.food || 0, icon: Utensils, color: '#d97706', pct: 25 },
    { label: 'Activities & Entry', amount: budgetBreakdown.activities || 0, icon: Ticket, color: '#0284c7', pct: 20 },
    { label: 'Transit & Local Travel', amount: budgetBreakdown.transportation || 0, icon: Car, color: '#7c3aed', pct: 12 },
    { label: 'Emergency Buffer', amount: budgetBreakdown.emergency_buffer || 0, icon: ShieldAlert, color: '#059669', pct: 8 }
  ];

  const dailyAllowance = Math.round(totalBudget / (Math.max(days, 1) * Math.max(travelers, 1)));

  return (
    <div className="card" style={{ marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.8rem' }}>
        <div>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <IndianRupee size={20} color="var(--primary-600)" />
            Estimated Budget Allocation
          </h3>
          <p style={{ fontSize: '0.85rem' }}>
            Dynamic financial breakdown tailored for {travelers} traveler(s) across {days} day(s)
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary-700)', fontFamily: 'var(--font-heading)' }}>
            ₹{totalBudget.toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            ≈ ₹{dailyAllowance.toLocaleString('en-IN')} / person / day
          </div>
        </div>
      </div>

      {/* Segmented Progress Bar */}
      <div style={{
        height: '14px',
        borderRadius: 'var(--radius-full)',
        display: 'flex',
        overflow: 'hidden',
        background: '#e2e8f0',
        marginBottom: '1.5rem',
        boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.1)'
      }}>
        {items.map((item, idx) => (
          <div
            key={idx}
            style={{
              width: `${item.pct}%`,
              background: item.color,
              transition: 'width 0.4s ease'
            }}
            title={`${item.label}: ₹${item.amount.toLocaleString('en-IN')} (${item.pct}%)`}
          />
        ))}
      </div>

      {/* Grid of Budget Categories */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem'
      }}>
        {items.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.8rem',
                padding: '0.85rem',
                background: 'var(--bg-subtle)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-light)'
              }}
            >
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: 'var(--radius-md)',
                background: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'var(--shadow-sm)'
              }}>
                <Icon size={20} color={item.color} />
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                  {item.label}
                </div>
                <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  ₹{Math.round(item.amount).toLocaleString('en-IN')}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Disclaimer */}
      <div style={{
        marginTop: '1.2rem',
        padding: '0.65rem 0.9rem',
        background: '#fffbeb',
        borderRadius: 'var(--radius-sm)',
        border: '1px solid #fef3c7',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        fontSize: '0.8rem',
        color: '#92400e'
      }}>
        <AlertCircle size={16} />
        <span>
          <strong>Note:</strong> All prices and estimates are indicative and subject to seasonal fluctuations, flight schedules, and personal dining preferences.
        </span>
      </div>
    </div>
  );
}
