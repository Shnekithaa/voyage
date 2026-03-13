import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, MapPin, SlidersHorizontal, Star, ChevronDown, X } from 'lucide-react';
import { useBooking } from '../context/BookingContext';
import { getHotelsByDestination } from '../api/axios';
import HotelCard from '../components/hotels/HotelCard';
import LoadingOrb from '../components/ui/LoadingOrb';
import toast from 'react-hot-toast';

// ─── Inject styles once ───────────────────────────────────────────────────────
const STYLE_ID = 'hotels-page-styles';
if (typeof document !== 'undefined' && !document.getElementById(STYLE_ID)) {
  const s = document.createElement('style');
  s.id = STYLE_ID;
  s.textContent = `
    .hotels-root {
      min-height: 100vh;
      padding-bottom: 5rem;
    }
    .hotels-inner {
      width: 100%;
      padding: 2.5rem 4.5rem 0;
    }
    .hotels-header {
      margin-bottom: 3rem;
    }
    .hotels-back-btn {
      display: inline-flex;
      align-items: center;
      gap: 7px;
      background: none;
      border: none;
      cursor: pointer;
      font-size: 13px;
      font-weight: 500;
      color: rgba(160,184,208,0.7);
      font-family: var(--font-sans);
      margin-bottom: 1.75rem;
      padding: 0;
      transition: color 0.2s ease;
    }
    .hotels-back-btn:hover { color: #38bdf8; }

    .hotels-title-row {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 2rem;
    }
    .hotels-filters-row {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      flex-shrink: 0;
      margin-top: 6px;
    }
    .hotels-list {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    /* ── Mobile ── */
    @media (max-width: 640px) {
      .hotels-root,
      main.hotels-root {
        padding-bottom: 6rem !important;
      }
      .hotels-inner,
      main.hotels-root .hotels-inner {
        padding: 1rem 1rem 0 !important;
      }
      .hotels-header {
        margin-bottom: 1.5rem;
      }
      .hotels-back-btn {
        display: none !important;
      }

      /* Title + filters stack vertically */
      .hotels-title-row {
        flex-direction: column;
        gap: 1rem;
      }

      /* Filters wrap into two rows naturally */
      .hotels-filters-row {
        width: 100%;
        flex-wrap: wrap;
        margin-top: 0;
        gap: 0.5rem;
      }
      .hotels-filters-row > * {
        flex: 1 1 calc(50% - 0.25rem);
        min-width: 0;
      }
      /* Clear button full-width when active */
      .hotels-clear-btn {
        flex: 1 1 100% !important;
        justify-content: center;
      }

      /* Dropdowns full width on mobile */
      .hotels-dropdown-trigger {
        width: 100% !important;
        min-width: unset !important;
      }

      .hotels-title-text {
        font-size: 1.55rem !important;
      }
      .hotels-vibe-explanation {
        font-size: 13px !important;
        -webkit-line-clamp: 3;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
      .hotels-list {
        gap: 1rem;
      }
      .hotels-divider {
        margin-top: 1rem !important;
      }
    }

    /* ── Tablet ── */
    @media (min-width: 641px) and (max-width: 1024px) {
      .hotels-inner {
        padding: 2rem 2rem 0;
      }
    }
  `;
  document.head.appendChild(s);
}

// ─── Hook: enforce mobile top padding ────────────────────────────────────────
function useMobilePaddingFix(ref) {
  useEffect(() => {
    if (!ref.current) return;
    const apply = () => {
      if (window.innerWidth <= 640) {
        ref.current.style.setProperty('padding-top', '1rem', 'important');
      } else {
        ref.current.style.removeProperty('padding-top');
      }
    };
    apply();
    window.addEventListener('resize', apply);
    return () => window.removeEventListener('resize', apply);
  }, [ref]);
}

/* ─────────────────────────────────────────
   Fully custom dropdown — no native select
───────────────────────────────────────── */
function CustomDropdown({ icon: Icon, iconColor = '#38bdf8', value, onChange, options, placeholder }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const selected = options.find(o => o.value === value);

  return (
    <div ref={ref} style={{ position: 'relative', userSelect: 'none' }}>
      <button
        className="hotels-dropdown-trigger"
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: open ? 'rgba(56,189,248,0.08)' : 'rgba(11,23,38,0.75)',
          backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
          border: `1px solid ${open ? 'rgba(56,189,248,0.35)' : 'rgba(56,189,248,0.14)'}`,
          borderRadius: '0.75rem', padding: '9px 14px',
          cursor: 'pointer', fontFamily: 'var(--font-sans)',
          transition: 'all 0.2s ease',
          boxShadow: open ? '0 0 0 3px rgba(56,189,248,0.07)' : 'none',
          minWidth: 148, width: '100%',
        }}
        onMouseEnter={e => { if (!open) e.currentTarget.style.borderColor = 'rgba(56,189,248,0.28)'; }}
        onMouseLeave={e => { if (!open) e.currentTarget.style.borderColor = 'rgba(56,189,248,0.14)'; }}
      >
        <Icon style={{ width: 14, height: 14, color: iconColor, flexShrink: 0 }} />
        <span style={{ flex: 1, fontSize: 13, fontWeight: 500, color: '#eaf2fb', textAlign: 'left', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {selected?.label || placeholder}
        </span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown style={{ width: 13, height: 13, color: 'rgba(160,184,208,0.55)', flexShrink: 0 }} />
        </motion.div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.18, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{
              position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0, zIndex: 100,
              background: 'rgba(8,18,30,0.97)', backdropFilter: 'blur(28px)', WebkitBackdropFilter: 'blur(28px)',
              border: '1px solid rgba(56,189,248,0.18)', borderRadius: '0.875rem',
              padding: '6px', overflow: 'hidden',
              boxShadow: '0 16px 48px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.03) inset',
            }}
          >
            {options.map((opt, i) => {
              const isActive = opt.value === value;
              return (
                <motion.button
                  key={opt.value}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  onClick={() => { onChange(opt.value); setOpen(false); }}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    width: '100%', padding: '9px 12px', borderRadius: '0.625rem',
                    background: isActive ? 'rgba(56,189,248,0.1)' : 'transparent',
                    border: 'none', cursor: 'pointer',
                    fontSize: 13, fontWeight: isActive ? 600 : 500,
                    color: isActive ? '#38bdf8' : '#a0b8d0',
                    fontFamily: 'var(--font-sans)',
                    textAlign: 'left', transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = 'rgba(56,189,248,0.06)'; e.currentTarget.style.color = '#eaf2fb'; }}}
                  onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#a0b8d0'; }}}
                >
                  {opt.label}
                  {isActive && (
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#38bdf8', flexShrink: 0 }} />
                  )}
                </motion.button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const STAR_OPTIONS = [
  { value: 0, label: 'All Stars' },
  { value: 3, label: '3+ Stars' },
  { value: 4, label: '4+ Stars' },
  { value: 5, label: '5 Stars Only' },
];

const SORT_OPTIONS = [
  { value: 'rating',     label: 'Top Rated'         },
  { value: 'price_low',  label: 'Price: Low → High'  },
  { value: 'price_high', label: 'Price: High → Low'  },
];

const DEFAULT_SORT  = 'rating';
const DEFAULT_STARS = 0;

export default function HotelsPage() {
  const { destinationId } = useParams();
  const navigate = useNavigate();
  const { state } = useBooking();
  const [hotels, setHotels] = useState([]);
  const [destinationInfo, setDestinationInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState(DEFAULT_SORT);
  const [filterStars, setFilterStars] = useState(DEFAULT_STARS);
  const mainRef = useRef(null);
  useMobilePaddingFix(mainRef);

  const hasActiveFilters = sortBy !== DEFAULT_SORT || filterStars !== DEFAULT_STARS;
  const clearFilters = () => { setSortBy(DEFAULT_SORT); setFilterStars(DEFAULT_STARS); };

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const params = {};
        if (sortBy) params.sortBy = sortBy;
        if (filterStars > 0) params.minStars = filterStars;
        const res = await getHotelsByDestination(destinationId, params);
        setHotels(res.data.data);
        setDestinationInfo(res.data.destination);
      } catch (err) {
        toast.error('Failed to load hotels');
      } finally { setLoading(false); }
    };
    fetch();
  }, [destinationId, sortBy, filterStars]);

  return (
    <main ref={mainRef} className="hotels-root">
      <div className="hotels-inner">

        {/* ── Header ── */}
        <motion.div
          className="hotels-header"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {/* Back — hidden on mobile */}
          <button
            className="hotels-back-btn"
            onClick={() => navigate('/discover')}
            onMouseEnter={e => e.currentTarget.style.color = '#38bdf8'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(160,184,208,0.7)'}
          >
            <ArrowLeft style={{ width: 15, height: 15 }} /> Back to Destinations
          </button>

          {/* Title row */}
          <div className="hotels-title-row">
            {/* Left: title + meta */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '0.625rem', flexWrap: 'wrap' }}>
                <MapPin style={{ width: 13, height: 13, color: '#38bdf8', flexShrink: 0 }} />
                <span style={{ fontSize: 13, color: 'rgba(160,184,208,0.7)', fontWeight: 500 }}>
                  {destinationInfo?.country}
                </span>
                {state.vibeMatchPercent && (
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: 5,
                    padding: '3px 10px', borderRadius: 999,
                    background: 'rgba(56,189,248,0.1)', border: '1px solid rgba(56,189,248,0.22)',
                    fontSize: 11, fontWeight: 700, color: '#38bdf8',
                  }}>
                    <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#38bdf8', display: 'inline-block' }} />
                    {state.vibeMatchPercent}% Match
                  </span>
                )}
              </div>

              <h1
                className="hotels-title-text"
                style={{
                  fontSize: 'clamp(1.8rem, 3vw, 2.75rem)',
                  fontWeight: 700, color: '#eaf2fb',
                  margin: '0 0 0.75rem', letterSpacing: '-0.03em', lineHeight: 1.1,
                }}
              >
                Hotels in {destinationInfo?.city || '…'}
              </h1>

              {state.vibeExplanation && (
                <p
                  className="hotels-vibe-explanation"
                  style={{
                    fontSize: 13.5, lineHeight: 1.75,
                    color: 'rgba(160,184,208,0.7)', margin: 0, maxWidth: '42rem',
                  }}
                >
                  {state.vibeExplanation}
                </p>
              )}
            </div>

            {/* Right: filters */}
            <div className="hotels-filters-row">
              <CustomDropdown
                icon={Star} iconColor="#fbbf24"
                value={filterStars}
                onChange={v => setFilterStars(v)}
                options={STAR_OPTIONS}
                placeholder="All Stars"
              />
              <CustomDropdown
                icon={SlidersHorizontal}
                value={sortBy}
                onChange={v => setSortBy(v)}
                options={SORT_OPTIONS}
                placeholder="Sort by"
              />

              <AnimatePresence>
                {hasActiveFilters && (
                  <motion.button
                    className="hotels-clear-btn"
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.85 }}
                    transition={{ duration: 0.22 }}
                    onClick={clearFilters}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 6,
                      background: 'rgba(251,146,60,0.08)', backdropFilter: 'blur(16px)',
                      border: '1px solid rgba(251,146,60,0.25)', borderRadius: '0.75rem',
                      padding: '9px 13px', cursor: 'pointer', whiteSpace: 'nowrap',
                      fontSize: 12.5, fontWeight: 600, color: '#fb923c',
                      fontFamily: 'var(--font-sans)', transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(251,146,60,0.15)'; e.currentTarget.style.borderColor = 'rgba(251,146,60,0.4)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(251,146,60,0.08)'; e.currentTarget.style.borderColor = 'rgba(251,146,60,0.25)'; }}
                  >
                    <X style={{ width: 13, height: 13 }} />
                    Clear filters
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Active filter pills */}
          <AnimatePresence>
            {hasActiveFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                style={{ overflow: 'hidden', marginTop: '1rem' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', paddingTop: 2 }}>
                  <span style={{ fontSize: 11, color: 'rgba(107,135,163,0.7)', fontWeight: 500 }}>Active filters:</span>
                  {filterStars !== DEFAULT_STARS && (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: 999, background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.2)', fontSize: 11, fontWeight: 600, color: '#fbbf24' }}>
                      <Star style={{ width: 10, height: 10, fill: '#fbbf24' }} />
                      {STAR_OPTIONS.find(o => o.value === filterStars)?.label}
                    </span>
                  )}
                  {sortBy !== DEFAULT_SORT && (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: 999, background: 'rgba(56,189,248,0.08)', border: '1px solid rgba(56,189,248,0.2)', fontSize: 11, fontWeight: 600, color: '#38bdf8' }}>
                      <SlidersHorizontal style={{ width: 10, height: 10 }} />
                      {SORT_OPTIONS.find(o => o.value === sortBy)?.label}
                    </span>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Divider */}
          <div
            className="hotels-divider"
            style={{
              height: 1, marginTop: '1.5rem',
              background: 'linear-gradient(90deg, rgba(56,189,248,0.18), rgba(45,212,191,0.08), transparent)',
            }}
          />
        </motion.div>

        {/* ── Loading ── */}
        {loading && <LoadingOrb message="Finding the best hotels…" />}

        {/* ── Hotels ── */}
        {!loading && (
          <AnimatePresence>
            {hotels.length > 0 ? (
              <div className="hotels-list">
                {hotels.map((hotel, i) => (
                  <HotelCard key={hotel._id} hotel={hotel} index={i} />
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                style={{ textAlign: 'center', padding: '6rem 0' }}
              >
                <p style={{ fontSize: 52, marginBottom: '1rem' }}>🏨</p>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#eaf2fb', marginBottom: '0.5rem' }}>
                  No Hotels Found
                </h2>
                <p style={{ fontSize: 14, color: 'rgba(160,184,208,0.65)', marginBottom: '1.5rem' }}>
                  Try adjusting your filters
                </p>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 6,
                      background: 'rgba(251,146,60,0.08)', border: '1px solid rgba(251,146,60,0.25)',
                      borderRadius: '0.75rem', padding: '10px 18px', cursor: 'pointer',
                      fontSize: 13, fontWeight: 600, color: '#fb923c', fontFamily: 'var(--font-sans)',
                    }}
                  >
                    <X style={{ width: 13, height: 13 }} /> Clear filters
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        )}

      </div>
    </main>
  );
}