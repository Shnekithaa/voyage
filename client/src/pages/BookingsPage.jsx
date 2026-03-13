import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plane, Calendar, Hotel, MapPin,
  ChevronDown, ChevronUp, Search, Luggage,
  Clock, Users, CreditCard, Mail, Tag, LogIn,
  RefreshCw, Star, Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getUserBookings } from '../api/axios';
import ElectricButton from '../components/ui/ElectricButton';
import LoadingOrb from '../components/ui/LoadingOrb';
import toast from 'react-hot-toast';

// ─── Inject mobile styles once ────────────────────────────────────────────────
const STYLE_ID = 'bookings-mobile-styles';
if (typeof document !== 'undefined' && !document.getElementById(STYLE_ID)) {
  const s = document.createElement('style');
  s.id = STYLE_ID;
  s.textContent = `
    .bookings-root {
      min-height: 100vh;
      padding-top: 5.5rem;
      padding-bottom: 7rem;
    }
    /* Nuke any inline padding-top that React might set */
    main.bookings-root {
      padding-top: 5.5rem !important;
    }
    .bookings-inner {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1.25rem;
    }
    .bookings-header {
      margin-bottom: 1.75rem;
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 0.875rem;
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 0.875rem;
      margin-bottom: 1.75rem;
    }
    .stat-card {
      background: rgba(10,22,38,0.65);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(56,189,248,0.09);
      border-radius: 1rem;
      padding: 1rem 1.1rem;
      text-align: center;
    }
    .booking-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
      gap: 1.1rem;
    }
    .booking-card {
      background: rgba(10,22,38,0.75);
      backdrop-filter: blur(28px);
      -webkit-backdrop-filter: blur(28px);
      border: 1px solid rgba(56,189,248,0.1);
      border-radius: 1.25rem;
      overflow: hidden;
      box-shadow: 0 8px 32px rgba(0,0,0,0.3);
      transition: border-color 0.3s ease, box-shadow 0.3s ease;
    }
    .booking-card:hover {
      border-color: rgba(56,189,248,0.22);
      box-shadow: 0 12px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(56,189,248,0.1);
    }
    .card-hero {
      position: relative;
      height: 160px;
      overflow: hidden;
    }
    .card-body {
      padding: 1rem 1.1rem;
    }
    .date-strip {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.65rem 0.875rem;
      border-radius: 0.75rem;
      background: rgba(56,189,248,0.04);
      border: 1px solid rgba(56,189,248,0.08);
      margin-bottom: 0.75rem;
    }
    .pricing-box {
      padding: 0.8rem 0.9rem;
      margin-top: 0.25rem;
      background: rgba(56,189,248,0.03);
      border-radius: 0.75rem;
      border: 1px solid rgba(56,189,248,0.07);
    }

    /* ── Mobile: ≤ 640px ── */
    @media (max-width: 640px) {
      .bookings-root,
      main.bookings-root {
        padding-top: 0.75rem !important;
        padding-bottom: 5.5rem !important;
      }
      .bookings-inner {
        padding: 0 1rem;
      }
      .bookings-header {
        margin-bottom: 1.25rem;
        flex-direction: row;
        align-items: center;
      }
      .header-title-block h1 {
        font-size: 1.6rem !important;
      }
      .header-title-block p {
        font-size: 12px !important;
      }
      .header-icon {
        width: 40px !important;
        height: 40px !important;
        border-radius: 0.75rem !important;
      }
      .header-icon svg {
        width: 18px !important;
        height: 18px !important;
      }
      .refresh-btn span {
        display: none;
      }
      .refresh-btn {
        padding: 8px 10px !important;
        border-radius: 0.75rem !important;
      }

      /* Stats: 2×2 grid on mobile */
      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 0.625rem;
        margin-bottom: 1.25rem;
      }
      .stat-card {
        padding: 0.8rem 0.75rem;
        border-radius: 0.875rem;
      }
      .stat-value {
        font-size: 1.35rem !important;
      }
      .stat-label {
        font-size: 9.5px !important;
      }

      /* Card grid: single column */
      .booking-grid {
        grid-template-columns: 1fr;
        gap: 0.875rem;
      }
      .booking-card {
        border-radius: 1.1rem;
      }
      .card-hero {
        height: 140px;
      }
      .card-body {
        padding: 0.875rem 1rem;
      }
      .date-strip {
        padding: 0.6rem 0.75rem;
        margin-bottom: 0.625rem;
        border-radius: 0.625rem;
      }
      .date-strip-dates {
        gap: 6px !important;
      }
      .date-text {
        font-size: 12px !important;
      }
      .price-text {
        font-size: 0.95rem !important;
      }
      .nights-text {
        font-size: 11px !important;
      }
      .room-row {
        margin-bottom: 0.625rem !important;
      }
      .ref-pill {
        font-size: 9.5px !important;
        padding: 2px 7px !important;
        max-width: 130px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .hotel-name {
        font-size: 0.925rem !important;
      }
      .pricing-box {
        padding: 0.7rem 0.8rem;
        border-radius: 0.625rem;
      }
      .expand-btn {
        padding: 6px 0 !important;
        font-size: 11px !important;
      }
      .detail-row-gap {
        gap: 0.65rem !important;
      }

      /* Empty / error / login states */
      .empty-state {
        padding: 3rem 1.5rem !important;
        border-radius: 1.1rem !important;
      }
      .empty-state svg {
        width: 44px !important;
        height: 44px !important;
      }
      .empty-state h3 {
        font-size: 1.15rem !important;
      }
      .empty-state p {
        font-size: 13px !important;
      }
    }

    /* ── Small tablets: 641–768px ── */
    @media (min-width: 641px) and (max-width: 768px) {
      .bookings-root {
        padding-top: 2rem;
      }
      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
      }
      .booking-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }
  `;
  document.head.appendChild(s);
}

// ─── Hook: enforce mobile top padding regardless of other styles ──────────────
function useMobilePaddingFix(ref) {
  useEffect(() => {
    if (!ref.current) return;
    const apply = () => {
      if (window.innerWidth <= 640) {
        ref.current.style.setProperty('padding-top', '0.75rem', 'important');
      } else {
        ref.current.style.removeProperty('padding-top');
      }
    };
    apply();
    window.addEventListener('resize', apply);
    return () => window.removeEventListener('resize', apply);
  }, [ref]);
}

// ─── Status config ────────────────────────────────────────────────────────────
const statusConfig = {
  confirmed: { bg: 'rgba(74,222,128,0.08)',  border: 'rgba(74,222,128,0.28)',  text: '#4ade80',  glow: 'rgba(74,222,128,0.15)' },
  pending:   { bg: 'rgba(251,191,36,0.08)',  border: 'rgba(251,191,36,0.28)',  text: '#fbbf24',  glow: 'rgba(251,191,36,0.15)' },
  cancelled: { bg: 'rgba(248,113,113,0.08)', border: 'rgba(248,113,113,0.28)', text: '#f87171',  glow: 'rgba(248,113,113,0.15)' },
  completed: { bg: 'rgba(56,189,248,0.08)',  border: 'rgba(56,189,248,0.28)',  text: '#38bdf8',  glow: 'rgba(56,189,248,0.15)' },
  'no-show': { bg: 'rgba(160,184,208,0.08)', border: 'rgba(160,184,208,0.28)', text: '#a0b8d0',  glow: 'rgba(160,184,208,0.1)' },
};

function formatDate(iso) {
  if (!iso) return 'N/A';
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
function formatDateShort(iso) {
  if (!iso) return 'N/A';
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// ─── Status badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const c = statusConfig[status] || statusConfig.pending;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '4px 10px', borderRadius: 999,
      background: c.bg, border: `1px solid ${c.border}`,
      fontSize: 10, fontWeight: 700, color: c.text,
      textTransform: 'uppercase', letterSpacing: '0.1em',
      boxShadow: `0 0 12px ${c.glow}`,
      flexShrink: 0,
    }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: c.text, flexShrink: 0 }} />
      {status}
    </span>
  );
}

// ─── Detail row ───────────────────────────────────────────────────────────────
function DetailRow({ icon: Icon, label, value }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
      <span style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        width: 28, height: 28, borderRadius: '0.5rem', flexShrink: 0,
        background: 'rgba(56,189,248,0.06)', border: '1px solid rgba(56,189,248,0.1)',
      }}>
        <Icon style={{ width: 12, height: 12, color: '#38bdf8' }} />
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 9.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(160,184,208,0.4)', margin: '0 0 2px' }}>{label}</p>
        <p style={{ fontSize: 13, color: '#eaf2fb', margin: 0, fontWeight: 500, wordBreak: 'break-word' }}>{value}</p>
      </div>
    </div>
  );
}

// ─── Booking card ─────────────────────────────────────────────────────────────
function BookingCard({ booking, index }) {
  const [expanded, setExpanded] = useState(false);
  const [imgHovered, setImgHovered] = useState(false);

  const dest      = booking.destination;
  const hotel     = booking.hotel;
  const city      = dest?.city || 'Unknown';
  const country   = dest?.country || '';
  const heroImage = hotel?.heroImage || dest?.heroImage;

  return (
    <motion.div
      className="booking-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {/* ── Hero image ── */}
      <div
        className="card-hero"
        onMouseEnter={() => setImgHovered(true)}
        onMouseLeave={() => setImgHovered(false)}
      >
        {heroImage ? (
          <motion.img
            src={heroImage}
            alt={city}
            animate={{ scale: imgHovered ? 1.06 : 1 }}
            transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        ) : (
          <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #0891b2 0%, #0d1f33 100%)' }} />
        )}

        {/* Gradient overlay */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(6,14,24,0.15) 0%, rgba(6,14,24,0.88) 100%)' }} />

        {/* Top row: status + ref */}
        <div style={{ position: 'absolute', top: 10, left: 10, right: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 6 }}>
          <StatusBadge status={booking.status} />
          <span
            className="ref-pill"
            style={{
              fontSize: 10.5, fontWeight: 700,
              fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
              color: 'rgba(56,189,248,0.85)', letterSpacing: '0.06em',
              background: 'rgba(4,13,24,0.7)', backdropFilter: 'blur(12px)',
              padding: '3px 9px', borderRadius: 999,
              border: '1px solid rgba(56,189,248,0.14)',
              flexShrink: 0,
            }}
          >
            {booking.bookingReference}
          </span>
        </div>

        {/* Bottom: hotel + location */}
        <div style={{ position: 'absolute', bottom: 10, left: 12, right: 12 }}>
          <h3
            className="hotel-name"
            style={{ fontSize: '1rem', fontWeight: 700, color: '#eaf2fb', margin: '0 0 3px', letterSpacing: '-0.015em', lineHeight: 1.2 }}
          >
            {hotel?.name || 'Hotel'}
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <MapPin style={{ width: 11, height: 11, color: '#2dd4bf', flexShrink: 0 }} />
            <span style={{ fontSize: 12, color: 'rgba(160,184,208,0.75)' }}>
              {city}{country ? `, ${country}` : ''}
            </span>
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="card-body">

        {/* Date strip */}
        <div className="date-strip">
          <div className="date-strip-dates" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Calendar style={{ width: 13, height: 13, color: '#38bdf8', flexShrink: 0 }} />
            <span className="date-text" style={{ fontSize: 13, color: '#eaf2fb', fontWeight: 600 }}>
              {formatDateShort(booking.checkIn)}
            </span>
            <span style={{ fontSize: 11, color: 'rgba(56,189,248,0.45)' }}>→</span>
            <span className="date-text" style={{ fontSize: 13, color: '#eaf2fb', fontWeight: 600 }}>
              {formatDateShort(booking.checkOut)}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className="nights-text" style={{ fontSize: 12, color: 'rgba(160,184,208,0.45)', fontWeight: 500 }}>
              {booking.nights}n
            </span>
            <span className="price-text" style={{ fontSize: '1.05rem', fontWeight: 700, color: '#38bdf8', letterSpacing: '-0.02em' }}>
              ${booking.pricing?.totalAmount?.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Room type + vibe */}
        <div className="room-row" style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: '0.875rem', flexWrap: 'wrap' }}>
          <Hotel style={{ width: 12, height: 12, color: 'rgba(160,184,208,0.4)', flexShrink: 0 }} />
          <span style={{ fontSize: 12, color: 'rgba(160,184,208,0.55)', fontWeight: 500 }}>
            {booking.roomType?.name || 'Room'}
          </span>
          {booking.vibeSearch?.vibe && (
            <>
              <span style={{ color: 'rgba(56,189,248,0.2)', fontSize: 11 }}>·</span>
              <Sparkles style={{ width: 11, height: 11, color: 'rgba(45,212,191,0.5)', flexShrink: 0 }} />
              <span style={{ fontSize: 12, color: 'rgba(45,212,191,0.6)', fontWeight: 500 }}>
                {booking.vibeSearch.vibe}
              </span>
            </>
          )}
        </div>

        {/* Expand toggle */}
        <button
          type="button"
          className="expand-btn"
          onClick={() => setExpanded(v => !v)}
          style={{
            width: '100%', padding: '7px 0',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
            background: expanded ? 'rgba(56,189,248,0.05)' : 'none',
            border: `1px solid ${expanded ? 'rgba(56,189,248,0.12)' : 'transparent'}`,
            borderRadius: '0.625rem',
            cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s',
            color: 'rgba(160,184,208,0.4)', fontSize: 11.5, fontWeight: 600,
            letterSpacing: '0.04em',
          }}
          onMouseEnter={e => { e.currentTarget.style.color = '#38bdf8'; e.currentTarget.style.borderColor = 'rgba(56,189,248,0.18)'; e.currentTarget.style.background = 'rgba(56,189,248,0.05)'; }}
          onMouseLeave={e => {
            e.currentTarget.style.color = 'rgba(160,184,208,0.4)';
            if (!expanded) { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.background = 'none'; }
          }}
        >
          {expanded ? 'Hide Details' : 'View Details'}
          {expanded
            ? <ChevronUp  style={{ width: 13, height: 13 }} />
            : <ChevronDown style={{ width: 13, height: 13 }} />
          }
        </button>

        {/* ── Expanded panel ── */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              style={{ overflow: 'hidden' }}
            >
              <div className="detail-row-gap" style={{ paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>

                <div style={{ height: 1, background: 'linear-gradient(to right, transparent, rgba(56,189,248,0.1), transparent)' }} />

                <DetailRow icon={Users}      label="Guests"  value={`${booking.guests?.adults || 1} Adult${(booking.guests?.adults || 1) > 1 ? 's' : ''}${booking.guests?.children ? `, ${booking.guests.children} Child${booking.guests.children > 1 ? 'ren' : ''}` : ''}`} />
                <DetailRow icon={CreditCard} label="Payment" value={`${booking.payment?.status === 'completed' ? 'Paid' : booking.payment?.status || 'N/A'} · ${booking.pricing?.currency || 'USD'}`} />
                <DetailRow icon={Mail}       label="Email"   value={booking.guestInfo?.email || 'N/A'} />

                {/* Pricing breakdown */}
                <div className="pricing-box">
                  {[
                    { label: `$${booking.roomType?.pricePerNight}/night × ${booking.nights}`, value: `$${booking.pricing?.totalBeforeTax?.toFixed(2)}` },
                    { label: 'Taxes & fees (12%)', value: `$${booking.pricing?.taxAmount?.toFixed(2)}` },
                  ].map(({ label, value }) => (
                    <div key={label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontSize: 12, color: 'rgba(160,184,208,0.45)' }}>{label}</span>
                      <span style={{ fontSize: 12, color: '#eaf2fb' }}>{value}</span>
                    </div>
                  ))}
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 8, borderTop: '1px solid rgba(56,189,248,0.08)' }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#eaf2fb' }}>Total</span>
                    <span style={{ fontSize: 14, fontWeight: 700, color: '#38bdf8' }}>${booking.pricing?.totalAmount?.toFixed(2)}</span>
                  </div>
                </div>

                {/* Booked on */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, paddingBottom: '0.25rem' }}>
                  <Clock style={{ width: 10, height: 10, color: 'rgba(160,184,208,0.25)' }} />
                  <span style={{ fontSize: 11, color: 'rgba(160,184,208,0.25)' }}>
                    Booked {formatDate(booking.createdAt)}
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ─── Stats bar ────────────────────────────────────────────────────────────────
function StatsBar({ bookings }) {
  const total     = bookings.length;
  const confirmed = bookings.filter(b => b.status === 'confirmed').length;
  const nights    = bookings.reduce((s, b) => s + (b.nights || 0), 0);
  const spent     = bookings.reduce((s, b) => s + (b.pricing?.totalAmount || 0), 0);

  const stats = [
    { label: 'Total Bookings', value: total },
    { label: 'Confirmed',      value: confirmed },
    { label: 'Nights Stayed',  value: nights },
    { label: 'Total Spent',    value: `$${spent.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}` },
  ];

  return (
    <motion.div
      className="stats-grid"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15, duration: 0.5 }}
    >
      {stats.map(({ label, value }, i) => (
        <motion.div
          key={label}
          className="stat-card"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 + i * 0.06 }}
        >
          <p className="stat-value" style={{ fontSize: 'clamp(1.3rem, 2.5vw, 1.7rem)', fontWeight: 800, color: '#38bdf8', margin: '0 0 4px', letterSpacing: '-0.04em' }}>
            {value}
          </p>
          <p className="stat-label" style={{ fontSize: 11, fontWeight: 600, color: 'rgba(160,184,208,0.4)', margin: 0, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            {label}
          </p>
        </motion.div>
      ))}
    </motion.div>
  );
}

// ─── Empty / login / error shared wrapper ─────────────────────────────────────
function StateCard({ children, borderColor = 'rgba(56,189,248,0.09)' }) {
  return (
    <motion.div
      className="empty-state"
      initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      style={{
        background: 'rgba(10,22,38,0.72)', backdropFilter: 'blur(28px)',
        border: `1px solid ${borderColor}`, borderRadius: '1.25rem',
        textAlign: 'center',
        padding: 'clamp(3rem, 6vw, 5rem) clamp(1.5rem, 5vw, 4rem)',
      }}
    >
      {children}
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function BookingsPage() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState(null);
  const mainRef = useRef(null);
  useMobilePaddingFix(mainRef);

  useEffect(() => {
    if (authLoading) return;
    if (!user) return;
    fetchBookings();
  }, [user, authLoading]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getUserBookings();
      setBookings(response.data.data || []);
    } catch (err) {
      const status  = err.response?.status;
      const message = err.response?.data?.error || err.message || 'Failed to load bookings';
      console.error('❌ Bookings fetch error:', status, message);
      if (status === 401) {
        setError('Your session has expired. Please sign in again.');
      } else {
        setError(message);
        toast.error(message);
      }
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <main ref={mainRef} className="bookings-root" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <LoadingOrb />
      </main>
    );
  }

  if (!user) {
    return (
      <main ref={mainRef} className="bookings-root">
        <div className="bookings-inner">
          <StateCard>
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              style={{ marginBottom: '1.5rem', display: 'inline-block' }}
            >
              <LogIn style={{ width: 52, height: 52, color: 'rgba(56,189,248,0.3)' }} />
            </motion.div>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#eaf2fb', margin: '0 0 0.6rem' }}>
              Sign in to view your trips
            </h3>
            <p style={{ fontSize: 14, color: 'rgba(160,184,208,0.45)', margin: '0 0 2rem', maxWidth: 340, marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.7 }}>
              Your booking history is tied to your account. Sign in to see all your trips in one place.
            </p>
            <ElectricButton onClick={() => navigate('/login', { state: { from: '/bookings' } })}>
              <LogIn style={{ width: 16, height: 16 }} />
              Sign In
            </ElectricButton>
          </StateCard>
        </div>
      </main>
    );
  }

  if (loading) {
    return (
      <main ref={mainRef} className="bookings-root" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <LoadingOrb />
      </main>
    );
  }

  return (
    <main ref={mainRef} className="bookings-root">
      <div className="bookings-inner">

        {/* ── Page header ── */}
        <motion.div
          className="bookings-header"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span
              className="header-icon"
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: 48, height: 48, borderRadius: '0.875rem',
                background: 'rgba(56,189,248,0.07)', border: '1px solid rgba(56,189,248,0.14)',
                flexShrink: 0,
              }}
            >
              <Luggage style={{ width: 22, height: 22, color: '#38bdf8' }} />
            </span>
            <div className="header-title-block">
              <h1 style={{
                fontSize: 'clamp(1.75rem, 3vw, 2.4rem)',
                fontWeight: 800, color: '#eaf2fb', margin: 0,
                letterSpacing: '-0.045em', lineHeight: 1,
              }}>
                My Trips
              </h1>
              <p style={{ fontSize: 13.5, color: 'rgba(160,184,208,0.45)', margin: '4px 0 0' }}>
                {bookings.length > 0
                  ? `${bookings.length} booking${bookings.length > 1 ? 's' : ''} found`
                  : 'Your travel history'}
              </p>
            </div>
          </div>

          {/* Refresh — icon-only on mobile */}
          <button
            type="button"
            className="refresh-btn"
            onClick={fetchBookings}
            style={{
              display: 'flex', alignItems: 'center', gap: 7,
              padding: '8px 16px', borderRadius: '0.75rem',
              background: 'rgba(56,189,248,0.06)', border: '1px solid rgba(56,189,248,0.12)',
              color: 'rgba(160,184,208,0.5)', fontSize: 12.5, fontWeight: 600,
              cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s',
              flexShrink: 0,
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(56,189,248,0.12)'; e.currentTarget.style.color = '#38bdf8'; e.currentTarget.style.borderColor = 'rgba(56,189,248,0.25)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(56,189,248,0.06)'; e.currentTarget.style.color = 'rgba(160,184,208,0.5)'; e.currentTarget.style.borderColor = 'rgba(56,189,248,0.12)'; }}
          >
            <RefreshCw style={{ width: 13, height: 13 }} />
            <span>Refresh</span>
          </button>
        </motion.div>

        {/* ── Error ── */}
        {error ? (
          <StateCard borderColor="rgba(248,113,113,0.15)">
            <p style={{ fontSize: 14, color: '#f87171', margin: '0 0 1.25rem', lineHeight: 1.6 }}>{error}</p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <ElectricButton onClick={fetchBookings}>
                <RefreshCw style={{ width: 15, height: 15 }} /> Try Again
              </ElectricButton>
              {(error.includes('session') || error.includes('sign in')) && (
                <ElectricButton variant="secondary" onClick={() => navigate('/login', { state: { from: '/bookings' } })}>
                  <LogIn style={{ width: 15, height: 15 }} /> Sign In
                </ElectricButton>
              )}
            </div>
          </StateCard>

        /* ── Empty ── */
        ) : bookings.length === 0 ? (
          <StateCard>
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
              style={{ marginBottom: '1.5rem', display: 'inline-block' }}
            >
              <Plane style={{ width: 52, height: 52, color: 'rgba(56,189,248,0.22)' }} />
            </motion.div>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#eaf2fb', margin: '0 0 0.6rem' }}>No trips yet</h3>
            <p style={{ fontSize: 14, color: 'rgba(160,184,208,0.45)', margin: '0 0 2rem', maxWidth: 320, marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.7 }}>
              Start exploring destinations and your bookings will show up here.
            </p>
            <ElectricButton onClick={() => navigate('/discover')}>
              <Search style={{ width: 16, height: 16 }} /> Explore Destinations
            </ElectricButton>
          </StateCard>

        /* ── Bookings ── */
        ) : (
          <>
            <StatsBar bookings={bookings} />
            <div className="booking-grid">
              {bookings.map((booking, i) => (
                <BookingCard key={booking._id} booking={booking} index={i} />
              ))}
            </div>
          </>
        )}

      </div>
    </main>
  );
}