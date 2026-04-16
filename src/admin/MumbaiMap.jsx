import { MapContainer, TileLayer, Circle, Tooltip } from 'react-leaflet';

export const HOTSPOTS = [
  { name: 'Dharavi',   lat: 19.0390, lng: 72.8542, issues: 41, top: 'Sewage',      resolved: 9  },
  { name: 'Kurla',     lat: 19.0726, lng: 72.8845, issues: 37, top: 'Road',        resolved: 11 },
  { name: 'Andheri',   lat: 19.1364, lng: 72.8296, issues: 28, top: 'Streetlight', resolved: 14 },
  { name: 'Goregaon',  lat: 19.1666, lng: 72.8506, issues: 26, top: 'Road',        resolved: 12 },
  { name: 'Bandra',    lat: 19.0607, lng: 72.8362, issues: 19, top: 'Garbage',     resolved: 10 },
  { name: 'Chembur',   lat: 19.0600, lng: 72.8970, issues: 17, top: 'Sewage',      resolved: 8  },
  { name: 'Dadar',     lat: 19.0270, lng: 72.8381, issues: 15, top: 'Road',        resolved: 7  },
  { name: 'Powai',     lat: 19.1187, lng: 72.9053, issues: 12, top: 'Electricity', resolved: 8  },
  { name: 'Juhu',      lat: 19.1075, lng: 72.8263, issues: 10, top: 'Noise',       resolved: 7  },
  { name: 'Malad',     lat: 19.1872, lng: 72.8483, issues: 9,  top: 'Water',       resolved: 6  },
  { name: 'Borivali',  lat: 19.2290, lng: 72.8560, issues: 8,  top: 'Garbage',     resolved: 5  },
  { name: 'Vashi',     lat: 19.0696, lng: 72.9987, issues: 7,  top: 'Water',       resolved: 4  },
  { name: 'Thane',     lat: 19.2183, lng: 72.9781, issues: 11, top: 'Road',        resolved: 6  },
  { name: 'Vikhroli',  lat: 19.1100, lng: 72.9200, issues: 9,  top: 'Garbage',     resolved: 5  },
  { name: 'Sion',      lat: 19.0388, lng: 72.8610, issues: 14, top: 'Water',       resolved: 7  },
  { name: 'Kandivali', lat: 19.2074, lng: 72.8520, issues: 8,  top: 'Park',        resolved: 4  },
  { name: 'Ghatkopar', lat: 19.0862, lng: 72.9088, issues: 13, top: 'Electricity', resolved: 6  },
  { name: 'Mulund',    lat: 19.1746, lng: 72.9560, issues: 7,  top: 'Road',        resolved: 3  },
  { name: 'Mankhurd',  lat: 19.0470, lng: 72.9280, issues: 16, top: 'Sewage',      resolved: 5  },
  { name: 'Colaba',    lat: 18.9068, lng: 72.8147, issues: 6,  top: 'Noise',       resolved: 4  },
];

export function getColor(issues) {
  if (issues >= 35) return '#ef4444';
  if (issues >= 25) return '#f97316';
  if (issues >= 15) return '#f59e0b';
  return '#22c55e';
}

export function getLabel(issues) {
  if (issues >= 35) return 'Critical';
  if (issues >= 25) return 'High';
  if (issues >= 15) return 'Moderate';
  return 'Low';
}

export default function MumbaiMap({ hotspots = HOTSPOTS, fullscreen = false, onFullscreen, onExitFullscreen }) {
  const height = fullscreen ? '100%' : '420px';

  return (
    <div style={{ height, width: '100%', borderRadius: fullscreen ? 0 : '16px', overflow: 'hidden', position: 'relative', zIndex: 0 }}>
      <MapContainer
        center={[19.0760, 72.8777]}
        zoom={fullscreen ? 13 : 12}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
        attributionControl={false}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {hotspots.map((spot) => {
          const color = getColor(spot.issues);
          const isCritical = spot.issues >= 35;
          return (
            <Circle
              key={spot.name}
              center={[spot.lat, spot.lng]}
              radius={1200 + spot.issues * 380}
              pathOptions={{ color, fillColor: color, fillOpacity: isCritical ? 0.48 : 0.35, weight: isCritical ? 3 : 2 }}
            >
              <Tooltip permanent={isCritical} direction="top" offset={[0, -8]}>
                <div style={{ fontSize: 12, fontWeight: 700, lineHeight: 1.6 }}>
                  <div style={{ color, display: 'flex', alignItems: 'center', gap: 4 }}>
                    {isCritical && <span style={{ fontSize: 10 }}>⚠</span>}
                    {spot.name}
                  </div>
                  <div style={{ color: '#64748b', fontWeight: 600 }}>{spot.issues} issues · {getLabel(spot.issues)}</div>
                  <div style={{ color: '#94a3b8', fontSize: 11 }}>Top: {spot.top}</div>
                </div>
              </Tooltip>
            </Circle>
          );
        })}
      </MapContainer>

      {/* Legend */}
      <div style={{
        position: 'absolute', bottom: 12, left: 12, zIndex: 999,
        background: 'rgba(255,255,255,0.93)', backdropFilter: 'blur(10px)',
        borderRadius: 12, padding: '8px 12px', boxShadow: '0 2px 12px rgba(0,0,0,0.13)',
        display: 'flex', flexDirection: 'column', gap: 4,
      }}>
        {[
          { label: 'Critical  (35+)', color: '#ef4444' },
          { label: 'High  (25–34)',   color: '#f97316' },
          { label: 'Moderate  (15–24)', color: '#f59e0b' },
          { label: 'Low  (<15)',      color: '#22c55e' },
        ].map(l => (
          <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 600, color: '#334155' }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: l.color, display: 'inline-block', flexShrink: 0 }} />
            {l.label}
          </div>
        ))}
      </div>

      {/* Fullscreen toggle button */}
      {fullscreen ? (
        <button
          onClick={onExitFullscreen}
          style={{
            position: 'absolute', top: 12, right: 12, zIndex: 999,
            background: 'rgba(255,255,255,0.93)', backdropFilter: 'blur(10px)',
            border: 'none', borderRadius: 10, padding: '8px 14px',
            display: 'flex', alignItems: 'center', gap: 7,
            fontSize: 12, fontWeight: 700, color: '#1e293b',
            cursor: 'pointer', boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
          }}
        >
          <i className="fas fa-compress" style={{ fontSize: 13 }} />
          Exit Fullscreen
        </button>
      ) : (
        <button
          onClick={onFullscreen}
          style={{
            position: 'absolute', top: 12, right: 12, zIndex: 999,
            background: 'rgba(255,255,255,0.93)', backdropFilter: 'blur(10px)',
            border: 'none', borderRadius: 10, padding: '8px 14px',
            display: 'flex', alignItems: 'center', gap: 7,
            fontSize: 12, fontWeight: 700, color: '#1e293b',
            cursor: 'pointer', boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
          }}
        >
          <i className="fas fa-expand" style={{ fontSize: 13 }} />
          Full Screen
        </button>
      )}
    </div>
  );
}
