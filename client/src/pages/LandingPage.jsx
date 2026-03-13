import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import HeroSection from '../components/landing/HeroSection';
import VibeSearchBar from '../components/landing/VibeSearchBar';
import GlassCard from '../components/ui/GlassCard';
import { getTrending } from '../api/axios';
import { Compass, MapPin, Sparkles, ArrowUpRight, Zap, Globe, Waves } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// ─── Inject mobile styles once ────────────────────────────────────────────────
const STYLE_ID = 'landing-mobile-styles';
if (typeof document !== 'undefined' && !document.getElementById(STYLE_ID)) {
  const s = document.createElement('style');
  s.id = STYLE_ID;
  s.textContent = `
    .landing-section {
      width: 100%;
      padding: 6rem 4.5rem 0;
    }
    .trending-header {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      margin-bottom: 2.5rem;
      gap: 2rem;
    }
    .trending-subtitle {
      font-size: 13px;
      line-height: 1.7;
      color: rgba(160,184,208,0.7);
      max-width: 22rem;
      text-align: right;
      margin: 0;
      flex-shrink: 0;
    }
    .trending-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.5rem;
    }
    .why-voyage-grid {
      display: grid;
      grid-template-columns: 1fr 1.4fr;
      gap: 4rem;
      align-items: center;
    }
    .landing-footer {
      width: 100%;
      padding: 5rem 4.5rem 0;
    }
    .footer-inner {
      background: rgba(11,23,38,0.5);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(56,189,248,0.08);
      border-radius: 1.25rem;
      padding: 2rem 2.5rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    @media (max-width: 768px) {
      .landing-section {
        padding: 3.5rem 1rem 0 !important;
      }
      /* Trending header: stack vertically */
      .trending-header {
        flex-direction: column !important;
        align-items: flex-start !important;
        gap: 0.75rem !important;
        margin-bottom: 1.5rem !important;
      }
      .trending-subtitle {
        text-align: left !important;
        max-width: 100% !important;
        font-size: 12.5px !important;
      }
      /* Trending: 1 col on mobile */
      .trending-grid {
        grid-template-columns: 1fr !important;
        gap: 1rem !important;
      }
      /* Trending card image: shorter on mobile */
      .trending-card-img {
        height: 180px !important;
      }
      /* Why Voyage: stack vertically */
      .why-voyage-grid {
        grid-template-columns: 1fr !important;
        gap: 2rem !important;
      }
      .why-headline {
        font-size: clamp(1.5rem, 5vw, 2rem) !important;
        margin-bottom: 0.875rem !important;
      }
      .why-body {
        font-size: 0.875rem !important;
        margin-bottom: 1.25rem !important;
      }
      .why-feature-card {
        padding: 1rem 1.125rem !important;
      }
      .why-feature-gap {
        gap: 0.75rem !important;
      }
      /* Footer */
      .landing-footer {
        padding: 3rem 1rem 0 !important;
      }
      .footer-inner {
        flex-direction: column !important;
        align-items: flex-start !important;
        gap: 0.5rem !important;
        padding: 1.25rem 1.25rem !important;
        border-radius: 1rem !important;
      }
      .footer-copy {
        font-size: 12px !important;
      }
      .footer-rights {
        font-size: 10.5px !important;
      }
    }
  `;
  document.head.appendChild(s);
}

const fadeInUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-50px' },
  transition: { duration: 0.65, delay, ease: [0.25, 0.46, 0.45, 0.94] },
});


const WHY_ITEMS = [
  {
    icon: Zap,
    color: '#38bdf8',
    title: 'Mood-first matching',
    desc: 'Describe how you feel, not where you want to go. Our AI translates energy into destinations.',
  },
  {
    icon: Globe,
    color: '#2dd4bf',
    title: 'End-to-end in one flow',
    desc: 'From vibe search to hotel checkout — no switching apps, no friction, one continuous journey.',
  },
  {
    icon: Waves,
    color: '#fb923c',
    title: 'Curated, not crowdsourced',
    desc: 'Every destination is scored for atmosphere, season fit, and your personal budget window.',
  },
];

export default function LandingPage() {
  const [trending, setTrending] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getTrending()
      .then(res => setTrending(res.data.data))
      .catch(err => console.error('Failed to fetch trending:', err));
  }, []);

  return (
    <main style={{ position: 'relative', minHeight: '100vh', paddingBottom: '5rem' }}>
      <HeroSection />
      <VibeSearchBar />

      {/* ── Trending Destinations ── */}
      {trending.length > 0 && (
        <section id="trending" className="landing-section" style={{ scrollMarginTop: '2rem' }}>

          {/* Header */}
          <motion.div className="trending-header" {...fadeInUp()}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '0.625rem' }}>
                <span style={{ width: 24, height: 24, borderRadius: 6, background: 'rgba(56,189,248,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Compass style={{ width: 12, height: 12, color: '#38bdf8' }} />
                </span>
                <p style={{ fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.18em', color: '#2dd4bf', margin: 0 }}>
                  Trending now
                </p>
              </div>
              <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', fontWeight: 700, color: '#eaf2fb', margin: 0, letterSpacing: '-0.025em', lineHeight: 1.1 }}>
                Where the world is vibing
              </h2>
            </div>
            <p className="trending-subtitle">
              Places where weather, local energy, and demand are peaking this week.
            </p>
          </motion.div>

          {/* Cards */}
          <div className="trending-grid">
            {trending.map((dest, i) => (
              <motion.div
                key={dest._id}
                {...fadeInUp(i * 0.08)}
                style={{
                  borderRadius: '1.25rem',
                  overflow: 'hidden',
                  background: 'rgba(13,31,51,0.65)',
                  border: '1px solid rgba(56,189,248,0.1)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                  cursor: 'pointer',
                  transition: 'border-color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease',
                }}
                whileHover={{ y: -4 }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'rgba(45,212,191,0.25)';
                  e.currentTarget.style.boxShadow = '0 16px 48px rgba(14,116,144,0.15)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'rgba(56,189,248,0.1)';
                  e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.2)';
                }}
                onClick={() => navigate(`/destination/${dest._id}`)}
              >
                {/* Image */}
                <div className="trending-card-img" style={{ position: 'relative', height: 220, overflow: 'hidden', flexShrink: 0 }}>
                  <motion.img
                    src={dest.heroImage}
                    alt={dest.city}
                    loading="lazy"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    whileHover={{ scale: 1.08 }}
                    transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                  />
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '60%', background: 'linear-gradient(to top, rgba(13,31,51,0.95) 0%, rgba(13,31,51,0.4) 55%, transparent 100%)', pointerEvents: 'none' }} />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileHover={{ opacity: 1, scale: 1 }}
                    style={{ position: 'absolute', top: 14, right: 14, width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <ArrowUpRight style={{ width: 14, height: 14, color: 'white' }} />
                  </motion.div>
                  <div style={{ position: 'absolute', bottom: 12, left: 14, display: 'flex', alignItems: 'center', gap: 5 }}>
                    <MapPin style={{ width: 11, height: 11, color: '#38bdf8', flexShrink: 0 }} />
                    <span style={{ fontSize: 11, fontWeight: 600, color: 'rgba(160,184,208,0.9)', letterSpacing: '0.03em' }}>{dest.country}</span>
                  </div>
                </div>
                {/* Body */}
                <div style={{ padding: '1.125rem 1.25rem 1.25rem' }}>
                  <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, color: '#eaf2fb', margin: '0 0 0.625rem', letterSpacing: '-0.015em', lineHeight: 1.2, transition: 'color 0.25s ease' }}>
                    {dest.city}
                  </h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
                    {dest.vibeCategories?.slice(0, 2).map(cat => (
                      <span key={cat} style={{ fontSize: 10, fontWeight: 600, padding: '3px 9px', borderRadius: '0.375rem', background: 'rgba(56,189,248,0.06)', border: '1px solid rgba(56,189,248,0.12)', color: 'rgba(56,189,248,0.85)', letterSpacing: '0.02em' }}>
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* ── Why Voyage ── */}
      <section className="landing-section">
        <motion.div {...fadeInUp(0.1)}>

          {/* Section label */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '2.5rem' }}>
            <div style={{ height: 1, width: 32, background: 'linear-gradient(90deg, transparent, rgba(45,212,191,0.5))' }} />
            <span style={{ fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.18em', color: 'rgba(45,212,191,0.8)', flexShrink: 0 }}>
              Why Voyage
            </span>
            <div style={{ height: 1, flex: 1, background: 'linear-gradient(90deg, rgba(45,212,191,0.2), transparent)' }} />
          </div>

          <div className="why-voyage-grid">

            {/* Left: headline */}
            <div>
              <h3
                className="why-headline"
                style={{ fontSize: 'clamp(1.8rem, 2.8vw, 2.75rem)', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.12, color: '#eaf2fb', margin: '0 0 1.5rem' }}
              >
                A planner that starts with your{' '}
                <span style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', background: 'linear-gradient(130deg, #67e8f9, #2dd4bf, #fb923c)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  energy
                </span>
              </h3>
              <p
                className="why-body"
                style={{ fontSize: '0.9375rem', lineHeight: 1.8, color: 'rgba(160,184,208,0.75)', margin: '0 0 2rem', maxWidth: '22rem' }}
              >
                Not keywords. Not filters. Just how you feel — and where in the world that feeling lives.
              </p>
              <div style={{ height: 2, width: 80, borderRadius: 999, background: 'linear-gradient(90deg, rgba(56,189,248,0.45), transparent)' }} />
            </div>

            {/* Right: feature cards */}
            <div className="why-feature-gap" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {WHY_ITEMS.map(({ icon: Icon, color, title, desc }, i) => (
                <motion.div
                  key={title}
                  {...fadeInUp(0.1 + i * 0.1)}
                  className="why-feature-card"
                  style={{
                    display: 'flex', alignItems: 'flex-start', gap: '1rem',
                    background: 'rgba(11,23,38,0.6)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(56,189,248,0.08)',
                    borderRadius: '1rem', padding: '1.25rem 1.5rem',
                    transition: 'border-color 0.25s ease',
                  }}
                  whileHover={{ borderColor: `${color}30` }}
                >
                  <span style={{ width: 38, height: 38, borderRadius: '0.625rem', flexShrink: 0, background: `${color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 1 }}>
                    <Icon style={{ width: 16, height: 16, color }} />
                  </span>
                  <div>
                    <p style={{ fontSize: 13.5, fontWeight: 700, color: '#eaf2fb', margin: '0 0 0.3rem', letterSpacing: '-0.01em' }}>{title}</p>
                    <p style={{ fontSize: 12.5, lineHeight: 1.65, color: 'rgba(160,184,208,0.7)', margin: 0 }}>{desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── Footer ── */}
      <footer className="landing-footer">
        <div className="footer-inner">
          <p className="footer-copy" style={{ fontSize: 13, fontWeight: 500, color: 'rgba(107,135,163,0.8)', margin: 0 }}>
            ✈️ Voyage — Curated by AI, crafted for you
          </p>
          <p className="footer-rights" style={{ fontSize: 11, color: 'rgba(107,135,163,0.5)', margin: 0 }}>
            © 2025 Voyage. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}