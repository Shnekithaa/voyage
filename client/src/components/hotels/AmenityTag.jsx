import {
  Utensils, Waves, Sun, Sparkles, Dumbbell, Wifi,
  Car, ConciergeBell, Wine, UtensilsCrossed, PlaneTakeoff,
  Dog, Briefcase, BellRing,
} from 'lucide-react';

const AMENITY_MAP = {
  'Breakfast Included':  { icon: Utensils,       color: '#2dd4bf' },
  'Swimming Pool':       { icon: Waves,           color: '#38bdf8' },
  'Private Balcony':     { icon: Sun,             color: '#fb923c' },
  'Spa & Wellness':      { icon: Sparkles,        color: '#a78bfa' },
  'Fitness Center':      { icon: Dumbbell,        color: '#38bdf8' },
  'Free Wi-Fi':          { icon: Wifi,            color: '#2dd4bf' },
  'Free Parking':        { icon: Car,             color: '#38bdf8' },
  '24/7 Room Service':   { icon: BellRing,        color: '#fb923c' },
  'Bar & Lounge':        { icon: Wine,            color: '#f472b6' },
  'On-site Restaurant':  { icon: UtensilsCrossed, color: '#fbbf24' },
  'Concierge Service':   { icon: ConciergeBell,   color: '#2dd4bf' },
  'Airport Shuttle':     { icon: PlaneTakeoff,    color: '#38bdf8' },
  'Pet Friendly':        { icon: Dog,             color: '#fb923c' },
  'Business Center':     { icon: Briefcase,       color: '#38bdf8' },
};

export default function AmenityTag({ name, size = 'sm' }) {
  const entry = AMENITY_MAP[name] || { icon: Sparkles, color: '#38bdf8' };
  const Icon  = entry.icon;
  const color = entry.color;

  if (size === 'lg') {
    return (
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        padding: '8px 14px', borderRadius: '0.75rem',
        background: `${color}0d`,
        border: `1px solid ${color}22`,
        transition: 'border-color 0.2s ease',
      }}
        onMouseEnter={e => e.currentTarget.style.borderColor = `${color}44`}
        onMouseLeave={e => e.currentTarget.style.borderColor = `${color}22`}
      >
        <Icon style={{ width: 15, height: 15, color, flexShrink: 0 }} />
        <span style={{ fontSize: 12.5, fontWeight: 500, color: 'rgba(160,184,208,0.85)' }}>{name}</span>
      </div>
    );
  }

  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '4px 9px', borderRadius: '0.5rem',
      background: 'rgba(6,14,24,0.5)',
      border: '1px solid rgba(56,189,248,0.1)',
      transition: 'border-color 0.2s ease',
    }}
      onMouseEnter={e => e.currentTarget.style.borderColor = `${color}30`}
      onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(56,189,248,0.1)'}
    >
      <Icon style={{ width: 11, height: 11, color, flexShrink: 0 }} />
      <span style={{ fontSize: 11, fontWeight: 500, color: 'rgba(107,135,163,0.9)' }}>{name}</span>
    </div>
  );
}