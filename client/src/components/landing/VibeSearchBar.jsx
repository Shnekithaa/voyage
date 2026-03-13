import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, DollarSign, Clock, Sparkles, ArrowRight } from 'lucide-react';
import { useBooking } from '../../context/BookingContext';
import toast from 'react-hot-toast';

// ─── Inject mobile styles once ────────────────────────────────────────────────
const STYLE_ID = 'vibe-search-mobile-styles';
if (typeof document !== 'undefined' && !document.getElementById(STYLE_ID)) {
  const s = document.createElement('style');
  s.id = STYLE_ID;
  s.textContent = `
    .vibe-section {
      width: 100%;
      padding: 0 4.5rem;
      margin-top: 5rem;
      scroll-margin-top: 2rem;
    }
    .vibe-card {
      position: relative;
      background: rgba(11,23,38,0.75);
      backdrop-filter: blur(32px);
      -webkit-backdrop-filter: blur(32px);
      border-radius: 1.75rem;
      padding: 2.75rem 3rem;
      transition: border-color 0.3s ease, box-shadow 0.3s ease;
    }
    /* Desktop top row: vibe | duration | button */
    .vibe-top-row {
      display: grid;
      grid-template-columns: 1fr auto auto;
      gap: 1.25rem;
      align-items: start;
      margin-bottom: 1.5rem;
      position: relative;
      z-index: 20;
    }
    .vibe-duration-col {
      min-width: 180px;
    }
    .vibe-budget-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 0.875rem;
    }
    .vibe-duration-picks {
      display: flex;
      gap: 0.5rem;
      margin-top: 0.625rem;
    }

    /* ── Mobile ── */
    @media (max-width: 768px) {
      .vibe-section {
        padding: 0 1rem !important;
        margin-top: 2rem !important;
      }
      .vibe-card {
        padding: 1.5rem 1.25rem !important;
        border-radius: 1.25rem !important;
      }
      /* Section label */
      .vibe-section-label {
        margin-bottom: 1rem !important;
      }
      /* Stack: vibe full-width, then duration, then button */
      .vibe-top-row {
        grid-template-columns: 1fr !important;
        gap: 1rem !important;
        margin-bottom: 1.25rem !important;
      }
      .vibe-duration-col {
        min-width: unset !important;
      }
      /* Duration picks: spread */
      .vibe-duration-picks button {
        padding: 6px 0 !important;
      }
      /* Budget grid: 2x2 on mobile */
      .vibe-budget-grid {
        grid-template-columns: repeat(2, 1fr) !important;
        gap: 0.625rem !important;
      }
      .vibe-budget-card {
        padding: 0.875rem 1rem !important;
      }
      /* CTA button full width */
      .vibe-submit-col {
        width: 100% !important;
      }
      .vibe-submit-btn {
        width: 100% !important;
        padding: 13px 20px !important;
      }
      /* Ghost label for alignment — hide on mobile */
      .vibe-ghost-label {
        display: none !important;
      }
      /* Completion hints smaller */
      .vibe-hint-text {
        font-size: 11px !important;
      }
      .vibe-hint-badge {
        display: none !important;
      }
    }
  `;
  document.head.appendChild(s);
}

const budgetOptions = [
  { value: 'budget',       label: 'Budget',    icon: '💰', desc: '<$100/day'  },
  { value: 'moderate',     label: 'Moderate',  icon: '💎', desc: '$100–250'   },
  { value: 'luxury',       label: 'Luxury',    icon: '👑', desc: '$250–500'   },
  { value: 'ultra-luxury', label: 'Ultra',     icon: '🏆', desc: '$500+'      },
];

const vibePresets = [
  { label: 'Dark Academia',    emoji: '📚' },
  { label: 'Tropical Luxury',  emoji: '🌴' },
  { label: 'Zen Retreat',      emoji: '🧘' },
  { label: 'Urban Explorer',   emoji: '🏙️' },
  { label: 'Romantic Escape',  emoji: '💕' },
  { label: 'Adventure Seeker', emoji: '⛰️' },
  { label: 'Digital Nomad',    emoji: '💻' },
  { label: 'Foodie Paradise',  emoji: '🍜' },
  { label: 'Coastal Chill',    emoji: '🌊' },
];

const DURATION_PICKS = ['3', '5', '7', '14'];

export default function VibeSearchBar() {
  const navigate     = useNavigate();
  const { dispatch } = useBooking();
  const [budget,      setBudget]      = useState('');
  const [duration,    setDuration]    = useState('');
  const [vibe,        setVibe]        = useState('');
  const [showPresets, setShowPresets] = useState(false);
  const [focused,     setFocused]     = useState(false);

  const handleSearch = () => {
    if (!budget)                             return toast.error('Select your budget level');
    if (!duration || parseInt(duration) < 1) return toast.error('How many days are you escaping?');
    if (!vibe.trim())                        return toast.error('Describe your travel vibe!');
    dispatch({ type: 'SET_SEARCH_PARAMS', payload: { budget, duration, vibe } });
    navigate('/discover');
  };

  const isReady = budget && duration && vibe.trim();

  return (
    <motion.section
      id="build-route"
      className="vibe-section"
      initial={{ opacity: 0, y: 36 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.55, duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {/* Section label */}
      <motion.div
        className="vibe-section-label"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1.5rem' }}
      >
        <div style={{ height: 1, width: 32, background: 'linear-gradient(90deg, transparent, rgba(45,212,191,0.5))' }} />
        <span style={{ fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.18em', color: 'rgba(45,212,191,0.8)' }}>
          Build your route
        </span>
        <div style={{ height: 1, flex: 1, background: 'linear-gradient(90deg, rgba(45,212,191,0.2), transparent)' }} />
      </motion.div>

      {/* Main card */}
      <div
        className="vibe-card"
        style={{
          border: `1px solid ${focused ? 'rgba(56,189,248,0.28)' : 'rgba(56,189,248,0.1)'}`,
          boxShadow: focused
            ? '0 0 0 4px rgba(56,189,248,0.05), 0 20px 60px rgba(0,0,0,0.35)'
            : '0 20px 60px rgba(0,0,0,0.25)',
        }}
      >
        {/* Decorative glows */}
        <div style={{ position: 'absolute', top: '-3rem', right: '-3rem', width: '18rem', height: '18rem', borderRadius: '50%', background: 'radial-gradient(circle, rgba(45,212,191,0.06) 0%, transparent 65%)', filter: 'blur(40px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-2rem', left: '-2rem', width: '14rem', height: '14rem', borderRadius: '50%', background: 'radial-gradient(circle, rgba(56,189,248,0.05) 0%, transparent 65%)', filter: 'blur(35px)', pointerEvents: 'none' }} />

        {/* ── Top row: Vibe | Duration | Button ── */}
        <div className="vibe-top-row">

          {/* Vibe input */}
          <div style={{ position: 'relative' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.14em', color: 'rgba(160,184,208,0.7)', marginBottom: '0.625rem' }}>
              <Sparkles style={{ width: 11, height: 11, color: '#2dd4bf' }} />
              Your travel vibe
            </label>
            <div style={{ position: 'relative' }}>
              <Sparkles style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', width: 17, height: 17, color: 'rgba(56,189,248,0.45)' }} />
              <input
                type="text"
                value={vibe}
                onChange={e => setVibe(e.target.value)}
                onFocus={() => { setShowPresets(true); setFocused(true); }}
                onBlur={() => { setTimeout(() => { setShowPresets(false); setFocused(false); }, 300); }}
                onKeyDown={e => e.key === 'Enter' && handleSearch()}
                placeholder="e.g. 'Dark Academia in the rain'…"
                style={{
                  width: '100%', boxSizing: 'border-box',
                  background: 'rgba(6,14,24,0.65)',
                  border: `1px solid ${focused ? 'rgba(56,189,248,0.35)' : 'rgba(56,189,248,0.12)'}`,
                  borderRadius: '0.875rem',
                  padding: '13px 16px 13px 46px',
                  fontSize: 15, color: '#eaf2fb',
                  outline: 'none',
                  transition: 'border-color 0.25s ease',
                  fontFamily: 'var(--font-sans)',
                }}
              />
            </div>

            {/* Presets dropdown */}
            <AnimatePresence>
              {showPresets && (
                <motion.div
                  initial={{ opacity: 0, y: -6, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.98 }}
                  transition={{ duration: 0.18 }}
                  style={{
                    position: 'absolute', top: 'calc(100% + 8px)', left: 0, right: 0, zIndex: 100,
                    background: 'rgba(11,23,38,0.97)', backdropFilter: 'blur(28px)',
                    border: '1px solid rgba(56,189,248,0.15)',
                    borderRadius: '1rem', padding: '1rem',
                    boxShadow: '0 16px 48px rgba(0,0,0,0.45)',
                  }}
                >
                  <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.16em', color: 'rgba(160,184,208,0.55)', marginBottom: '0.625rem', paddingLeft: 2 }}>
                    Popular Vibes
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {vibePresets.map(p => (
                      <button
                        key={p.label}
                        onMouseDown={e => { e.preventDefault(); setVibe(p.label); setShowPresets(false); }}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 6,
                          background: 'rgba(6,14,24,0.5)',
                          border: '1px solid rgba(56,189,248,0.1)',
                          borderRadius: '0.625rem', padding: '6px 12px',
                          fontSize: 12.5, fontWeight: 500, color: 'rgba(160,184,208,0.85)',
                          cursor: 'pointer', fontFamily: 'var(--font-sans)',
                          transition: 'all 0.18s ease',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(56,189,248,0.28)'; e.currentTarget.style.color = '#eaf2fb'; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(56,189,248,0.1)'; e.currentTarget.style.color = 'rgba(160,184,208,0.85)'; }}
                      >
                        <span style={{ fontSize: 14 }}>{p.emoji}</span>
                        {p.label}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Duration */}
          <div className="vibe-duration-col">
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.14em', color: 'rgba(160,184,208,0.7)', marginBottom: '0.625rem' }}>
              <Clock style={{ width: 11, height: 11, color: '#38bdf8' }} />
              Duration
            </label>
            <style>{`
              .voyage-duration::-webkit-outer-spin-button,
              .voyage-duration::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
              .voyage-duration { -moz-appearance: textfield; }
            `}</style>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                className="voyage-duration"
                value={duration}
                onChange={e => {
                  const val = e.target.value.replace(/\D/g, '');
                  if (val === '' || (parseInt(val) >= 1 && parseInt(val) <= 30)) setDuration(val);
                }}
                onKeyDown={e => e.key === 'Enter' && handleSearch()}
                placeholder="Days away?"
                style={{
                  width: '100%', boxSizing: 'border-box',
                  background: 'rgba(6,14,24,0.65)',
                  border: '1px solid rgba(56,189,248,0.12)',
                  borderRadius: '0.875rem',
                  padding: '13px 48px 13px 16px',
                  fontSize: 15, color: '#eaf2fb',
                  outline: 'none', fontFamily: 'var(--font-sans)',
                  appearance: 'none',
                }}
              />
              {duration && (
                <span style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 11.5, fontWeight: 600, color: 'rgba(56,189,248,0.6)' }}>
                  {duration === '1' ? 'day' : 'days'}
                </span>
              )}
            </div>
            <div className="vibe-duration-picks">
              {DURATION_PICKS.map(d => (
                <button
                  key={d}
                  onClick={() => setDuration(d)}
                  style={{
                    flex: 1, padding: '5px 0', borderRadius: '0.5rem',
                    background: duration === d ? 'rgba(56,189,248,0.1)' : 'rgba(6,14,24,0.4)',
                    border: `1px solid ${duration === d ? 'rgba(56,189,248,0.35)' : 'rgba(56,189,248,0.08)'}`,
                    fontSize: 11.5, fontWeight: 600,
                    color: duration === d ? '#38bdf8' : 'rgba(160,184,208,0.6)',
                    cursor: 'pointer', fontFamily: 'var(--font-sans)',
                    transition: 'all 0.18s ease',
                  }}
                >
                  {d}d
                </button>
              ))}
            </div>
          </div>

          {/* Search CTA */}
          <div className="vibe-submit-col" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', paddingBottom: 2 }}>
            <label className="vibe-ghost-label" style={{ fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.14em', color: 'transparent', marginBottom: '0.625rem', userSelect: 'none' }}>
              &nbsp;
            </label>
            <motion.button
              className="vibe-submit-btn"
              onClick={handleSearch}
              whileHover={{ scale: isReady ? 1.02 : 1 }}
              whileTap={{ scale: isReady ? 0.97 : 1 }}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9,
                background: isReady ? 'linear-gradient(135deg, #0891b2, #2dd4bf)' : 'rgba(56,189,248,0.06)',
                border: isReady ? 'none' : '1px solid rgba(56,189,248,0.15)',
                borderRadius: '0.875rem',
                padding: '13px 24px',
                cursor: isReady ? 'pointer' : 'default',
                boxShadow: isReady ? '0 8px 28px rgba(8,145,178,0.35)' : 'none',
                fontSize: 14, fontWeight: 600,
                color: isReady ? '#fff' : 'rgba(56,189,248,0.4)',
                fontFamily: 'var(--font-sans)',
                transition: 'all 0.3s ease',
                whiteSpace: 'nowrap',
              }}
            >
              {isReady
                ? <Search style={{ width: 15, height: 15 }} />
                : <Search style={{ width: 15, height: 15, opacity: 0.4 }} />}
              Find My Voyage
              {isReady && <ArrowRight style={{ width: 14, height: 14 }} />}
            </motion.button>
          </div>
        </div>

        {/* ── Budget row ── */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.14em', color: 'rgba(160,184,208,0.7)', marginBottom: '0.75rem' }}>
            <DollarSign style={{ width: 11, height: 11, color: '#38bdf8' }} />
            Budget Level
          </label>
          <div className="vibe-budget-grid">
            {budgetOptions.map(opt => {
              const isActive = budget === opt.value;
              return (
                <motion.button
                  key={opt.value}
                  className="vibe-budget-card"
                  onClick={() => setBudget(opt.value)}
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    position: 'relative', overflow: 'hidden',
                    background: isActive ? 'rgba(56,189,248,0.07)' : 'rgba(6,14,24,0.45)',
                    border: `1px solid ${isActive ? 'rgba(56,189,248,0.32)' : 'rgba(56,189,248,0.08)'}`,
                    borderRadius: '0.875rem', padding: '1rem 1.25rem',
                    cursor: 'pointer', textAlign: 'left',
                    fontFamily: 'var(--font-sans)',
                    transition: 'all 0.22s ease',
                    boxShadow: isActive ? '0 4px 20px rgba(8,145,178,0.12)' : 'none',
                  }}
                  onMouseEnter={e => { if (!isActive) { e.currentTarget.style.borderColor = 'rgba(56,189,248,0.2)'; e.currentTarget.style.background = 'rgba(6,14,24,0.6)'; } }}
                  onMouseLeave={e => { if (!isActive) { e.currentTarget.style.borderColor = 'rgba(56,189,248,0.08)'; e.currentTarget.style.background = 'rgba(6,14,24,0.45)'; } }}
                >
                  {isActive && (
                    <motion.div
                      layoutId="budget-active"
                      style={{ position: 'absolute', top: 10, right: 10, width: 7, height: 7, borderRadius: '50%', background: '#38bdf8' }}
                      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    />
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 20 }}>{opt.icon}</span>
                    <div>
                      <p style={{ fontSize: 13.5, fontWeight: 600, color: isActive ? '#38bdf8' : '#a0b8d0', margin: 0, lineHeight: 1.2 }}>{opt.label}</p>
                      <p style={{ fontSize: 10.5, color: 'rgba(107,135,163,0.8)', margin: '3px 0 0', lineHeight: 1 }}>{opt.desc}</p>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* ── Completion hint ── */}
        <AnimatePresence>
          {!isReady && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              style={{ marginTop: '1.25rem', overflow: 'hidden' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingTop: '1rem', borderTop: '1px solid rgba(56,189,248,0.07)' }}>
                <div style={{ display: 'flex', gap: '0.375rem', flexShrink: 0 }}>
                  {[!!vibe.trim(), !!budget, !!duration].map((done, i) => (
                    <div key={i} style={{ width: 20, height: 4, borderRadius: 999, background: done ? '#2dd4bf' : 'rgba(56,189,248,0.1)', transition: 'background 0.3s ease' }} />
                  ))}
                </div>
                <span className="vibe-hint-text" style={{ fontSize: 11.5, color: 'rgba(107,135,163,0.75)', fontWeight: 500 }}>
                  {!vibe.trim() ? 'Describe your vibe to start' : !budget ? 'Pick a budget level' : 'Set how many days'}
                </span>
                <span className="vibe-hint-badge" style={{ marginLeft: 'auto', fontSize: 11, color: 'rgba(107,135,163,0.5)', flexShrink: 0 }}>⚡ ~4 second match</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </motion.section>
  );
}