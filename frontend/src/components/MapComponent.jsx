import React, { useEffect, useRef } from 'react';
import L from 'leaflet';

export default function MapComponent({ items = [], destination = '', centerLat = 15.2993, centerLng = 74.1240 }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Filter items with valid coordinates
    const validItems = items.filter(
      (item) => item.latitude && item.longitude && !isNaN(item.latitude) && !isNaN(item.longitude)
    );

    const initialCenter = validItems.length > 0
      ? [validItems[0].latitude, validItems[0].longitude]
      : [centerLat, centerLng];

    // Initialize Leaflet map if not already created
    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: initialCenter,
        zoom: 11,
        scrollWheelZoom: false,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Clear existing markers and layers
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker || layer instanceof L.Polyline) {
        map.removeLayer(layer);
      }
    });

    if (validItems.length > 0) {
      const latLngs = [];
      const colors = ['#0d9488', '#d97706', '#0284c7', '#7c3aed', '#e11d48', '#059669'];

      validItems.forEach((item, index) => {
        const pos = [item.latitude, item.longitude];
        latLngs.push(pos);

        const dayColor = colors[(item.day - 1) % colors.length];

        // Create Custom HTML Marker Icon
        const customIcon = L.divIcon({
          className: 'custom-map-pin',
          html: `
            <div style="
              background: ${dayColor};
              color: white;
              width: 28px;
              height: 28px;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              font-weight: 800;
              font-size: 12px;
              border: 2px solid white;
              box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            ">
              D${item.day}
            </div>
          `,
          iconSize: [28, 28],
          iconAnchor: [14, 14],
          popupAnchor: [0, -14],
        });

        const marker = L.marker(pos, { icon: customIcon }).addTo(map);

        const popupContent = `
          <div style="font-family: sans-serif; padding: 4px; max-width: 200px;">
            <div style="font-size: 11px; font-weight: 700; color: ${dayColor}; text-transform: uppercase;">
              Day ${item.day} • ${item.time}
            </div>
            <div style="font-weight: 700; font-size: 14px; margin: 2px 0 4px; color: #0f172a;">
              ${item.place}
            </div>
            <div style="font-size: 12px; color: #475569; margin-bottom: 6px;">
              ${item.description ? item.description.slice(0, 100) + '...' : ''}
            </div>
            <div style="font-size: 12px; font-weight: 700; color: #059669;">
              Est. Cost: ₹${(item.estimated_cost || 0).toLocaleString('en-IN')}
            </div>
          </div>
        `;
        marker.bindPopup(popupContent);
      });

      // Draw polyline route connecting sequential spots
      if (latLngs.length > 1) {
        L.polyline(latLngs, {
          color: '#0d9488',
          weight: 3,
          opacity: 0.7,
          dashArray: '6, 8',
        }).addTo(map);
      }

      // Fit bounds so all markers are nicely visible
      const bounds = L.latLngBounds(latLngs);
      map.fitBounds(bounds, { padding: [40, 40] });
    }

    return () => {
      // Cleanup if component unmounts
    };
  }, [items, centerLat, centerLng]);

  return (
    <div className="card" style={{ padding: '0.75rem', marginBottom: '1.5rem', overflow: 'hidden' }}>
      <div style={{ padding: '0.5rem 0.75rem 0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontSize: '1.1rem' }}>Interactive Travel Route Map</h3>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          {items.length} pinpointed destinations & activities
        </span>
      </div>
      <div
        ref={mapContainerRef}
        style={{
          width: '100%',
          height: '420px',
          borderRadius: 'var(--radius-md)',
          zIndex: 1,
        }}
      />
    </div>
  );
}
