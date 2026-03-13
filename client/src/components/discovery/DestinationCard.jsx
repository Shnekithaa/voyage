import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, ArrowRight } from 'lucide-react';
import { useBooking } from '../../context/BookingContext';
import VibeMatchBadge from './VibeMatchBadge';

export default function DestinationCard({ destination, index }) {
  const navigate = useNavigate();
  const { dispatch } = useBooking();

  const handleSelect = () => {
    dispatch({
      type: 'SET_DESTINATION',
      payload: {
        destination,
        vibeMatchPercent: destination.vibeMatchPercent,
        vibeExplanation: destination.vibeExplanation,
      },
    });
    navigate(`/hotels/${destination._id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 36 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.12, duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ y: -6 }}
      onClick={handleSelect}
      style={{ cursor: 'pointer', borderRadius: '1.25rem', overflow: 'hidden' }}
    >
      <div
        style={{
          background: 'rgba(13,31,51,0.7)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(56,189,248,0.1)',
          borderRadius: '1.25rem',
          overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(0,0,0,0.22)',
          transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.borderColor = 'rgba(45,212,191,0.28)';
          e.currentTarget.style.boxShadow = '0 16px 48px rgba(14,116,144,0.18)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = 'rgba(56,189,248,0.1)';
          e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.22)';
        }}
      >
        {/* ── Image ── */}
        <div style={{ position: 'relative', height: 230, overflow: 'hidden', flexShrink: 0 }}>
          <motion.img
            src={destination.heroImage}
            alt={destination.city}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            whileHover={{ scale: 1.07 }}
            transition={{ duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94] }}
          />

          {/* Bottom gradient — inside image container only */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: '55%',
            background: 'linear-gradient(to top, rgba(13,31,51,0.95) 0%, rgba(13,31,51,0.35) 60%, transparent 100%)',
            pointerEvents: 'none',
          }} />

          {/* Top fade */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: '30%',
            background: 'linear-gradient(to bottom, rgba(6,14,24,0.45), transparent)',
            pointerEvents: 'none',
          }} />

          {/* Vibe emoji — top left */}
          <div style={{
            position: 'absolute', top: 13, left: 13,
            fontSize: 22, lineHeight: 1,
            filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.5))',
          }}>
            {destination.vibeEmoji}
          </div>

          {/* Match badge — top right */}
          <div style={{ position: 'absolute', top: 13, right: 13 }}>
            <VibeMatchBadge percent={destination.vibeMatchPercent} />
          </div>

          {/* Country badge — bottom left inside image */}
          <div style={{ position: 'absolute', bottom: 13, left: 13, display: 'flex', alignItems: 'center', gap: 5 }}>
            <MapPin style={{ width: 11, height: 11, color: '#38bdf8', flexShrink: 0 }} />
            <span style={{ fontSize: 11, fontWeight: 600, color: 'rgba(160,184,208,0.9)', letterSpacing: '0.03em' }}>
              {destination.country}
            </span>
          </div>
        </div>

        {/* ── Card body ── */}
        <div style={{ padding: '1.25rem 1.375rem 1.375rem' }}>

          {/* City name */}
          <h3 style={{
            fontSize: '1.25rem', fontWeight: 700,
            fontFamily: 'var(--font-display)',
            color: '#eaf2fb', margin: '0 0 0.5rem',
            letterSpacing: '-0.02em', lineHeight: 1.2,
          }}>
            {destination.city}
          </h3>

          {/* Vibe explanation */}
          <p style={{
            fontSize: 12.5, lineHeight: 1.7,
            color: 'rgba(160,184,208,0.7)',
            margin: '0 0 0.875rem',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}>
            {destination.vibeExplanation}
          </p>

          {/* Vibe tags */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem', marginBottom: '1.125rem' }}>
            {destination.vibeCategories?.slice(0, 3).map(cat => (
              <span key={cat} style={{
                fontSize: 10, fontWeight: 600, padding: '3px 9px', borderRadius: '0.375rem',
                background: 'rgba(56,189,248,0.07)',
                border: '1px solid rgba(56,189,248,0.15)',
                color: 'rgba(56,189,248,0.9)',
                letterSpacing: '0.02em',
              }}>
                {cat}
              </span>
            ))}
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: 'rgba(56,189,248,0.08)', marginBottom: '1rem' }} />

          {/* Price + CTA row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <span style={{ fontSize: 10.5, color: 'rgba(107,135,163,0.8)', display: 'block', marginBottom: 2 }}>From</span>
              <p style={{ margin: 0, lineHeight: 1 }}>
                <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#38bdf8', letterSpacing: '-0.02em' }}>
                  ${destination.averageCostPerDay?.budget}
                </span>
                <span style={{ fontSize: 10.5, color: 'rgba(107,135,163,0.7)', fontWeight: 400 }}>/day</span>
              </p>
            </div>

            <motion.div
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 7,
                background: 'rgba(56,189,248,0.08)',
                border: '1px solid rgba(56,189,248,0.18)',
                borderRadius: '0.625rem', padding: '7px 14px',
                fontSize: 12.5, fontWeight: 600, color: '#38bdf8',
                transition: 'all 0.22s ease',
              }}
              whileHover={{ background: 'rgba(56,189,248,0.14)', gap: 10 }}
            >
              Explore
              <ArrowRight style={{ width: 13, height: 13 }} />
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}