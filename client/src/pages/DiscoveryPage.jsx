import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { useBooking } from '../context/BookingContext';
import { searchVibe } from '../api/axios';
import DestinationCard from '../components/discovery/DestinationCard';
import LoadingOrb from '../components/ui/LoadingOrb';
import ElectricButton from '../components/ui/ElectricButton';
import toast from 'react-hot-toast';

// ─── Inject styles once ───────────────────────────────────────────────────────
const STYLE_ID = 'discovery-styles';
if (typeof document !== 'undefined' && !document.getElementById(STYLE_ID)) {
  const s = document.createElement('style');
  s.id = STYLE_ID;
  s.textContent = `
    .discovery-root {
      min-height: 100vh;
      padding-bottom: 5rem;
    }
    .discovery-inner {
      width: 100%;
      padding: 2.5rem 4.5rem 0;
    }
    .discovery-header {
      margin-bottom: 3rem;
    }
    .discovery-title-row {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      gap: 2rem;
      margin-bottom: 1.25rem;
    }
    .discovery-back-btn {
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
    .discovery-back-btn:hover { color: #38bdf8; }

    .discovery-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.5rem;
    }

    /* ── Mobile ── */
    @media (max-width: 640px) {
      .discovery-root,
      main.discovery-root {
        padding-bottom: 6rem !important;
      }
      .discovery-inner,
      main.discovery-root .discovery-inner {
        padding: 1rem 1rem 0 !important;
      }
      .discovery-header {
        margin-bottom: 1.5rem;
      }
      .discovery-back-btn {
        display: none !important;
      }
      .discovery-title-row {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.4rem;
        margin-bottom: 1rem;
      }
      .discovery-count {
        font-size: 12px !important;
      }
      .discovery-title h1 {
        font-size: 1.55rem !important;
      }
      .discovery-grid {
        grid-template-columns: 1fr !important;
        gap: 1rem;
      }
      .discovery-divider {
        margin-top: 1.25rem !important;
      }
      .discovery-pills {
        gap: 0.4rem !important;
      }
      .discovery-pill {
        font-size: 12px !important;
        padding: 5px 11px !important;
      }
      .discovery-icon-wrap {
        width: 30px !important;
        height: 30px !important;
        border-radius: 0.5rem !important;
      }
      .discovery-icon-wrap svg {
        width: 14px !important;
        height: 14px !important;
      }
    }

    /* ── Tablet ── */
    @media (min-width: 641px) and (max-width: 1024px) {
      .discovery-inner {
        padding: 2rem 2rem 0;
      }
      .discovery-grid {
        grid-template-columns: repeat(2, 1fr) !important;
        gap: 1.25rem;
      }
    }
  `;
  document.head.appendChild(s);
}

// ─── Hook: enforce mobile padding ────────────────────────────────────────────
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

export default function DiscoveryPage() {
  const navigate = useNavigate();
  const { state } = useBooking();
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const mainRef = useRef(null);
  useMobilePaddingFix(mainRef);

  useEffect(() => {
    const fetchDestinations = async () => {
      if (!state.searchParams.vibe) { navigate('/'); return; }
      setLoading(true); setError(null);
      try {
        const res = await searchVibe(state.searchParams);
        setDestinations(res.data.data);
      } catch (err) {
        const msg = err.response?.data?.error || 'Failed to find destinations';
        setError(msg); toast.error(msg);
      } finally { setLoading(false); }
    };
    fetchDestinations();
  }, [state.searchParams, navigate]);

  return (
    <main ref={mainRef} className="discovery-root">
      <div className="discovery-inner">

        {/* ── Header ── */}
        <motion.div
          className="discovery-header"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {/* Back button — hidden on mobile via CSS */}
          <button
            className="discovery-back-btn"
            onClick={() => navigate('/')}
            onMouseEnter={e => e.currentTarget.style.color = '#38bdf8'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(160,184,208,0.7)'}
          >
            <ArrowLeft style={{ width: 15, height: 15 }} />
            New Search
          </button>

          {/* Title row */}
          <div className="discovery-title-row">
            <div className="discovery-title" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span
                className="discovery-icon-wrap"
                style={{
                  width: 36, height: 36, borderRadius: '0.625rem',
                  background: 'rgba(56,189,248,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}
              >
                <Sparkles style={{ width: 16, height: 16, color: '#38bdf8' }} />
              </span>
              <h1 style={{
                fontSize: 'clamp(1.8rem, 3vw, 2.75rem)',
                fontWeight: 700, color: '#eaf2fb', margin: 0,
                letterSpacing: '-0.03em', lineHeight: 1.1,
              }}>
                Your Vibe Matches
              </h1>
            </div>
            {!loading && !error && destinations.length > 0 && (
              <p className="discovery-count" style={{ fontSize: 13, color: 'rgba(160,184,208,0.6)', margin: 0, flexShrink: 0 }}>
                {destinations.length} destination{destinations.length !== 1 ? 's' : ''} found
              </p>
            )}
          </div>

          {/* Search param pills */}
          <div className="discovery-pills" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {[
              { icon: '✨', value: state.searchParams.vibe, accent: true },
              { icon: '💰', value: state.searchParams.budget },
              { icon: '📅', value: `${state.searchParams.duration} days` },
            ].map(({ icon, value, accent }) => (
              <span
                key={value}
                className="discovery-pill"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '6px 14px', borderRadius: '0.625rem',
                  background: accent ? 'rgba(56,189,248,0.08)' : 'rgba(11,23,38,0.6)',
                  border: `1px solid ${accent ? 'rgba(56,189,248,0.22)' : 'rgba(56,189,248,0.1)'}`,
                  fontSize: 12.5, fontWeight: 500,
                  color: accent ? '#38bdf8' : 'rgba(160,184,208,0.85)',
                }}
              >
                <span>{icon}</span> {value}
              </span>
            ))}
          </div>

          {/* Divider */}
          <div
            className="discovery-divider"
            style={{
              height: 1, marginTop: '2rem',
              background: 'linear-gradient(90deg, rgba(56,189,248,0.18), rgba(45,212,191,0.08), transparent)',
            }}
          />
        </motion.div>

        {/* ── Loading ── */}
        {loading && <LoadingOrb message="Our AI is finding your perfect vibe match…" />}

        {/* ── Error ── */}
        {error && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ textAlign: 'center', padding: '6rem 0' }}
          >
            <p style={{ fontSize: 52, marginBottom: '1rem' }}>😔</p>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#eaf2fb', marginBottom: '0.75rem' }}>
              No Vibe Match Found
            </h2>
            <p style={{ fontSize: 14, color: 'rgba(160,184,208,0.7)', marginBottom: '2rem', maxWidth: 400, margin: '0 auto 2rem' }}>
              {error}
            </p>
            <ElectricButton onClick={() => navigate('/')}>Try a Different Vibe</ElectricButton>
          </motion.div>
        )}

        {/* ── Results grid ── */}
        {!loading && !error && destinations.length > 0 && (
          <div className="discovery-grid">
            {destinations.map((dest, i) => (
              <DestinationCard key={dest._id} destination={dest} index={i} />
            ))}
          </div>
        )}

      </div>
    </main>
  );
}