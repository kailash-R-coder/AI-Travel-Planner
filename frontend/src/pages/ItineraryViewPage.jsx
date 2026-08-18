import React, { useState, useEffect } from 'react';
import {
  Sparkles, Calendar, MapPin, IndianRupee, Users, Compass,
  Printer, ArrowLeft, Plus, Map as MapIcon, DollarSign, CloudSun,
  Edit2, Trash2, Check, X, AlertCircle
} from 'lucide-react';
import { api } from '../services/api';
import WeatherCard from '../components/WeatherCard';
import BudgetSummary from '../components/BudgetSummary';
import MapComponent from '../components/MapComponent';
import ItineraryDayCard from '../components/ItineraryDayCard';
import ChatDrawer from '../components/ChatDrawer';

export default function ItineraryViewPage({ trip, onBack, onUpdateTrip }) {
  const [currentTrip, setCurrentTrip] = useState(trip);
  const [activeTab, setActiveTab] = useState('itinerary'); // 'itinerary', 'map', 'budget', 'weather'
  const [loading, setLoading] = useState(false);

  // Modal State for Add / Edit Item
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [modalForm, setModalForm] = useState({
    day: 1,
    time: 'Morning',
    place: '',
    description: '',
    estimated_cost: 300,
    activity_type: 'Sightseeing',
    travel_time: '15 mins',
  });

  useEffect(() => {
    setCurrentTrip(trip);
  }, [trip]);

  if (!currentTrip) {
    return (
      <div className="container page-wrapper" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
        <h2>No Trip Selected</h2>
        <button className="btn btn-primary" onClick={onBack} style={{ marginTop: '1rem' }}>
          <ArrowLeft size={16} /> Back to Planner
        </button>
      </div>
    );
  }

  // Group itinerary items by day
  const totalDays = currentTrip.total_days || 3;
  const itemsByDay = {};
  for (let d = 1; d <= totalDays; d++) {
    itemsByDay[d] = [];
  }

  (currentTrip.itinerary_items || []).forEach((item) => {
    if (!itemsByDay[item.day]) {
      itemsByDay[item.day] = [];
    }
    itemsByDay[item.day].push(item);
  });

  // Open Add Item Modal for a specific day
  const handleOpenAddModal = (dayNumber = 1) => {
    setEditingItem(null);
    setModalForm({
      day: dayNumber,
      time: 'Morning',
      place: '',
      description: '',
      estimated_cost: 300,
      activity_type: 'Sightseeing',
      travel_time: '15 mins',
    });
    setModalOpen(true);
  };

  // Open Edit Item Modal
  const handleOpenEditModal = (item) => {
    setEditingItem(item);
    setModalForm({
      day: item.day,
      time: item.time,
      place: item.place,
      description: item.description,
      estimated_cost: item.estimated_cost,
      activity_type: item.activity_type || 'Sightseeing',
      travel_time: item.travel_time || '15 mins',
    });
    setModalOpen(true);
  };

  // Save Add or Edit Item
  const handleSaveModal = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        // Update existing item
        const updated = await api.itinerary.updateItem(currentTrip.id, editingItem.id, modalForm);
        const newItems = currentTrip.itinerary_items.map((i) => (i.id === editingItem.id ? updated : i));
        const updatedTrip = { ...currentTrip, itinerary_items: newItems };
        setCurrentTrip(updatedTrip);
        if (onUpdateTrip) onUpdateTrip(updatedTrip);
      } else {
        // Add new item
        const added = await api.itinerary.addItem(currentTrip.id, modalForm);
        const newItems = [...(currentTrip.itinerary_items || []), added];
        const updatedTrip = { ...currentTrip, itinerary_items: newItems };
        setCurrentTrip(updatedTrip);
        if (onUpdateTrip) onUpdateTrip(updatedTrip);
      }
      setModalOpen(false);
    } catch (err) {
      alert('Failed to save activity: ' + err.message);
    }
  };

  // Delete an item
  const handleDeleteItem = async (itemId) => {
    if (window.confirm('Delete this activity from your itinerary?')) {
      try {
        await api.itinerary.deleteItem(currentTrip.id, itemId);
        const newItems = currentTrip.itinerary_items.filter((i) => i.id !== itemId);
        const updatedTrip = { ...currentTrip, itinerary_items: newItems };
        setCurrentTrip(updatedTrip);
        if (onUpdateTrip) onUpdateTrip(updatedTrip);
      } catch (err) {
        alert('Failed to delete item: ' + err.message);
      }
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="container page-wrapper">
      {/* Back Button & Action Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.8rem' }}>
        <button className="btn btn-secondary btn-sm" onClick={onBack}>
          <ArrowLeft size={16} />
          <span>Back to Planner</span>
        </button>

        <div style={{ display: 'flex', gap: '0.6rem' }}>
          <button className="btn btn-secondary btn-sm" onClick={handlePrint} title="Print or Save as PDF">
            <Printer size={16} />
            <span>Print / PDF</span>
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => handleOpenAddModal(1)}>
            <Plus size={16} />
            <span>Add Activity</span>
          </button>
        </div>
      </div>

      {/* Hero Header Banner */}
      <div className="card" style={{
        padding: '2rem',
        background: 'linear-gradient(135deg, #134e4a 0%, #0f766e 100%)',
        color: 'white',
        marginBottom: '2rem',
        boxShadow: 'var(--shadow-lg)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span className="badge" style={{ background: 'rgba(255,255,255,0.2)', color: 'white' }}>
                {currentTrip.trip_type} Trip
              </span>
              <span className="badge" style={{ background: '#f59e0b', color: 'white' }}>
                {totalDays} Days Itinerary
              </span>
            </div>

            <h1 style={{ color: 'white', fontSize: '2.2rem', marginBottom: '0.4rem' }}>
              {currentTrip.destination}
            </h1>
            <p style={{ color: '#ccfbf1', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <MapPin size={16} /> Starting from {currentTrip.origin} • {currentTrip.start_date} to {currentTrip.end_date}
            </p>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.85rem', color: '#99f6e4', textTransform: 'uppercase', fontWeight: 700 }}>
              Total Budget in INR
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'white', fontFamily: 'var(--font-heading)' }}>
              ₹{currentTrip.budget.toLocaleString('en-IN')}
            </div>
            <div style={{ fontSize: '0.85rem', color: '#ccfbf1' }}>
              {currentTrip.travelers} Traveler(s) • {currentTrip.transportation}
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        borderBottom: '2px solid var(--border-light)',
        marginBottom: '2rem',
        overflowX: 'auto'
      }}>
        <button
          className={`nav-link-btn ${activeTab === 'itinerary' ? 'active' : ''}`}
          onClick={() => setActiveTab('itinerary')}
          style={{ padding: '0.8rem 1.2rem', fontSize: '1rem', borderBottom: activeTab === 'itinerary' ? '3px solid var(--primary-600)' : 'none' }}
        >
          <Calendar size={18} />
          <span>Day-by-Day Itinerary</span>
        </button>

        <button
          className={`nav-link-btn ${activeTab === 'map' ? 'active' : ''}`}
          onClick={() => setActiveTab('map')}
          style={{ padding: '0.8rem 1.2rem', fontSize: '1rem', borderBottom: activeTab === 'map' ? '3px solid var(--primary-600)' : 'none' }}
        >
          <MapIcon size={18} />
          <span>Interactive Map</span>
        </button>

        <button
          className={`nav-link-btn ${activeTab === 'budget' ? 'active' : ''}`}
          onClick={() => setActiveTab('budget')}
          style={{ padding: '0.8rem 1.2rem', fontSize: '1rem', borderBottom: activeTab === 'budget' ? '3px solid var(--primary-600)' : 'none' }}
        >
          <DollarSign size={18} />
          <span>Budget Analytics</span>
        </button>

        <button
          className={`nav-link-btn ${activeTab === 'weather' ? 'active' : ''}`}
          onClick={() => setActiveTab('weather')}
          style={{ padding: '0.8rem 1.2rem', fontSize: '1rem', borderBottom: activeTab === 'weather' ? '3px solid var(--primary-600)' : 'none' }}
        >
          <CloudSun size={18} />
          <span>Live Weather</span>
        </button>
      </div>

      {/* Tab Content: Daily Itinerary */}
      {activeTab === 'itinerary' && (
        <div>
          {/* Quick Weather & Budget Snapshot */}
          {currentTrip.weather_forecast && (
            <WeatherCard forecast={currentTrip.weather_forecast.slice(0, 4)} destination={currentTrip.destination} />
          )}

          {Array.from({ length: totalDays }, (_, i) => i + 1).map((dayNum) => (
            <ItineraryDayCard
              key={dayNum}
              dayNumber={dayNum}
              items={itemsByDay[dayNum] || []}
              onEditItem={handleOpenEditModal}
              onDeleteItem={handleDeleteItem}
              onAddItem={handleOpenAddModal}
            />
          ))}
        </div>
      )}

      {/* Tab Content: Map View */}
      {activeTab === 'map' && (
        <div>
          <MapComponent
            items={currentTrip.itinerary_items || []}
            destination={currentTrip.destination}
          />
        </div>
      )}

      {/* Tab Content: Budget Analytics */}
      {activeTab === 'budget' && (
        <div>
          <BudgetSummary
            budgetBreakdown={currentTrip.budget_breakdown}
            totalBudget={currentTrip.budget}
            travelers={currentTrip.travelers}
            days={totalDays}
          />
        </div>
      )}

      {/* Tab Content: Live Weather */}
      {activeTab === 'weather' && (
        <div>
          <WeatherCard
            forecast={currentTrip.weather_forecast}
            destination={currentTrip.destination}
          />
        </div>
      )}

      {/* Floating Chat Drawer */}
      <ChatDrawer currentTrip={currentTrip} />

      {/* Add / Edit Activity Modal */}
      {modalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000,
          padding: '1rem'
        }}>
          <div className="card" style={{ maxWidth: '500px', width: '100%', padding: '2rem', animation: 'slideUp 0.2s ease' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3>{editingItem ? 'Edit Itinerary Activity' : 'Add Activity to Itinerary'}</h3>
              <button onClick={() => setModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveModal}>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Day Number</label>
                  <input
                    type="number"
                    className="form-control"
                    min="1"
                    max={totalDays}
                    value={modalForm.day}
                    onChange={(e) => setModalForm({ ...modalForm, day: Number(e.target.value) })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Time Slot</label>
                  <select
                    className="form-control"
                    value={modalForm.time}
                    onChange={(e) => setModalForm({ ...modalForm, time: e.target.value })}
                  >
                    <option value="Morning">Morning</option>
                    <option value="Afternoon">Afternoon</option>
                    <option value="Evening">Evening</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Place / Restaurant Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Fort Aguada or Riverside Cafe"
                  value={modalForm.place}
                  onChange={(e) => setModalForm({ ...modalForm, place: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description & Tips</label>
                <textarea
                  className="form-control"
                  rows="3"
                  placeholder="Describe activity, insider tips, or menu recommendations"
                  value={modalForm.description}
                  onChange={(e) => setModalForm({ ...modalForm, description: e.target.value })}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Estimated Cost (INR)</label>
                  <input
                    type="number"
                    className="form-control"
                    min="0"
                    value={modalForm.estimated_cost}
                    onChange={(e) => setModalForm({ ...modalForm, estimated_cost: Number(e.target.value) })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    className="form-control"
                    value={modalForm.activity_type}
                    onChange={(e) => setModalForm({ ...modalForm, activity_type: e.target.value })}
                  >
                    <option value="Sightseeing">Sightseeing</option>
                    <option value="Food">Food / Dining</option>
                    <option value="Adventure">Adventure</option>
                    <option value="Beaches">Beaches</option>
                    <option value="History">History</option>
                    <option value="Shopping">Shopping</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <Check size={16} />
                  <span>{editingItem ? 'Save Changes' : 'Add Activity'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
