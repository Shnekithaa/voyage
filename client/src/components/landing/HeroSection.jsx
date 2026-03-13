import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState, useCallback } from 'react';
import { Compass, ArrowRight, MapPin, Star, Zap, ChevronLeft, ChevronRight } from 'lucide-react';

// ─── Inject mobile styles once ────────────────────────────────────────────────
const STYLE_ID = 'hero-mobile-styles';
if (typeof document !== 'undefined' && !document.getElementById(STYLE_ID)) {
  const s = document.createElement('style');
  s.id = STYLE_ID;
  s.textContent = `
    .hero-split {
      position: relative;
      width: 100%;
      min-height: 100vh;
      display: grid;
      grid-template-columns: 52% 48%;
      overflow: hidden;
    }
    .hero-photo-col {
      position: relative;
      overflow: hidden;
      min-height: 100vh;
    }
    .hero-text-col {
      background: var(--color-dark-primary);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 4rem 6rem 4rem 8rem;
      position: relative;
      overflow: hidden;
    }
    .hero-text-inner {
      position: relative;
      z-index: 1;
      width: 100%;
    }
    .hero-cta-row {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 2.75rem;
    }
    .hero-divider {
      height: 1px;
      margin-bottom: 2.25rem;
      background: linear-gradient(90deg, rgba(56,189,248,0.2), rgba(45,212,191,0.1), transparent);
      transform-origin: left;
    }
    .hero-stats-row {
      display: flex;
      gap: 0;
      width: 100%;
    }

    /* ── Mobile: full-bleed image behind overlay text ── */
    @media (max-width: 768px) {
      .hero-split {
        grid-template-columns: 1fr !important;
        min-height: 100svh;
        position: relative;
      }
      /* Photo stacks to fill the full height */
      .hero-photo-col {
        position: absolute !important;
        inset: 0 !important;
        min-height: unset !important;
        z-index: 0;
      }
      /* Text col floats over with gradient scrim */
      .hero-text-col {
        position: relative;
        z-index: 2;
        grid-row: 1;
        min-height: 100svh;
        padding: 0 !important;
        align-items: flex-end !important;
        justify-content: flex-start !important;
        background: linear-gradient(
          to top,
          rgba(6,14,24,0.97) 0%,
          rgba(6,14,24,0.85) 40%,
          rgba(6,14,24,0.4) 68%,
          transparent 100%
        ) !important;
      }
      .hero-text-inner {
        padding: 0 1.25rem 1.75rem !important;
        width: 100% !important;
      }
      /* Right-fade gradient not needed on mobile */
      .hero-right-fade {
        display: none !important;
      }
      /* Eyebrow */
      .hero-eyebrow {
        margin-bottom: 0.9rem !important;
      }
      .hero-eyebrow-pill {
        padding: 5px 12px !important;
      }
      .hero-eyebrow-label {
        font-size: 9.5px !important;
        letter-spacing: 0.12em !important;
      }
      /* Headline */
      .hero-headline {
        margin-bottom: 0.875rem !important;
      }
      .hero-h1 {
        font-size: clamp(2.1rem, 7.5vw, 2.85rem) !important;
        line-height: 1.06 !important;
      }
      /* Body copy */
      .hero-body {
        font-size: 0.85rem !important;
        line-height: 1.7 !important;
        margin-bottom: 1.25rem !important;
        color: rgba(160,184,208,0.88) !important;
      }
      /* CTAs: side-by-side, full width */
      .hero-cta-row {
        gap: 0.625rem !important;
        margin-bottom: 1.5rem !important;
      }
      .hero-cta-primary,
      .hero-cta-secondary {
        flex: 1 !important;
        padding: 12px 14px !important;
        font-size: 13px !important;
        white-space: nowrap;
      }
      /* Divider: hide on mobile */
      .hero-divider {
        display: none !important;
      }
      /* Stats: tighter */
      .hero-stat-value {
        font-size: 1.2rem !important;
      }
      .hero-stat-label {
        font-size: 9.5px !important;
        margin-top: 3px !important;
      }
      /* Slide controls */
      .hero-controls-inner {
        padding: 1.25rem 1.25rem 1.5rem !important;
      }
      .hero-slide-headline {
        font-size: clamp(1.25rem, 5vw, 1.7rem) !important;
        margin-bottom: 1rem !important;
      }
    }

    @media (min-width: 769px) and (max-width: 1100px) {
      .hero-text-col {
        padding: 3rem 3rem 3rem 4rem !important;
      }
    }
  `;
  document.head.appendChild(s);
}

const SLIDES = [
  {
    photo: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=85&fit=crop&auto=format',
    fallback: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&q=85&fit=crop&auto=format',
    location: 'Swiss Alps, Switzerland',
    tag: 'Alpine Escape',
    headline: 'Where silence\nmeets summit',
    rating: '4.9',
    accent: '#38bdf8',
  },
  {
    photo: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200&q=85&fit=crop&center&auto=format',
    fallback: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200&q=85&fit=crop&auto=format',
    location: 'Bali, Indonesia',
    tag: 'Tropical Vibe',
    headline: 'Temples, rice\nfields & soul',
    rating: '4.8',
    accent: '#2dd4bf',
  },
  {
    photo: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1200&q=85&fit=crop&auto=format',
    fallback: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=1200&q=85&fit=crop&auto=format',
    location: 'Kyoto, Japan',
    tag: 'Zen & Culture',
    headline: 'Ancient streets,\nmodern wonder',
    rating: '4.9',
    accent: '#fb923c',
  },
  {
    photo: 'https://images.unsplash.com/photo-1531761535209-180857e963b9?w=1200&q=85&fit=crop&auto=format',
    fallback: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1200&q=85&fit=crop&auto=format',
    location: 'Patagonia, Argentina',
    tag: 'Wild & Remote',
    headline: 'The edge of\nthe earth awaits',
    rating: '4.7',
    accent: '#a78bfa',
  },
];

const SLIDE_DURATION = 5000;

const slideVariants = {
  enter: (dir) => ({ opacity: 0, scale: 1.04, x: dir > 0 ? 40 : -40 }),
  center: { opacity: 1, scale: 1, x: 0, transition: { duration: 0.75, ease: [0.25, 0.46, 0.45, 0.94] } },
  exit: (dir) => ({ opacity: 0, scale: 0.97, x: dir > 0 ? -40 : 40, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } }),
};

const textVariants = {
  enter: { opacity: 0, y: 18 },
  center: { opacity: 1, y: 0, transition: { duration: 0.55, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] } },
  exit:   { opacity: 0, y: -12, transition: { duration: 0.3 } },
};

const statItems = [
  { value: '120+', label: 'Destinations' },
  { value: '4s',   label: 'Match Time'   },
  { value: '98%',  label: 'Accuracy'     },
];

export default function HeroSection() {
  const [index, setIndex] = useState(0);
  const [dir, setDir]     = useState(1);
  const [paused, setPaused] = useState(false);

  const go = useCallback((newDir) => {
    setDir(newDir);
    setIndex(i => (i + newDir + SLIDES.length) % SLIDES.length);
  }, []);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => go(1), SLIDE_DURATION);
    return () => clearInterval(t);
  }, [paused, go]);

  const slide = SLIDES[index];

  return (
    <section className="hero-split">

      {/* ══ PHOTO PANEL ══ */}
      <div
        className="hero-photo-col"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <AnimatePresence custom={dir} mode="sync">
          <motion.div
            key={index}
            custom={dir}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            style={{ position: 'absolute', inset: 0 }}
          >
            <img
              src={slide.photo}
              alt={slide.location}
              onError={e => { e.currentTarget.src = slide.fallback; }}
              style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
            />
          </motion.div>
        </AnimatePresence>

        {/* Overlays */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(6,14,24,0.3) 0%, rgba(6,14,24,0.05) 35%, rgba(6,14,24,0.5) 65%, rgba(6,14,24,0.9) 100%)', zIndex: 1 }} />
        <div className="hero-right-fade" style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: 140, background: 'linear-gradient(to right, transparent, rgba(6,14,24,0.98))', zIndex: 1 }} />

        {/* Photo UI layer */}
        <div
          className="hero-controls-inner"
          style={{ position: 'absolute', inset: 0, zIndex: 2, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '2.5rem' }}
        >
          {/* Top: location + rating */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={`loc-${index}`}
                initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.4 }}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'rgba(6,14,24,0.55)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 999, padding: '6px 14px' }}
              >
                <MapPin style={{ width: 11, height: 11, color: slide.accent }} />
                <span style={{ fontSize: 12, fontWeight: 600, color: '#eaf2fb', letterSpacing: '0.03em' }}>{slide.location}</span>
              </motion.div>
            </AnimatePresence>
            <AnimatePresence mode="wait">
              <motion.div
                key={`rat-${index}`}
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(6,14,24,0.55)', backdropFilter: 'blur(16px)', border: `1px solid ${slide.accent}33`, borderRadius: 999, padding: '6px 12px' }}
              >
                <Star style={{ width: 11, height: 11, color: slide.accent, fill: slide.accent }} />
                <span style={{ fontSize: 12, fontWeight: 700, color: slide.accent }}>{slide.rating}</span>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Bottom: tag + headline + nav */}
          <div>
            <AnimatePresence mode="wait">
              <motion.div
                key={`tag-${index}`}
                variants={textVariants} initial="enter" animate="center" exit="exit"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: `${slide.accent}18`, border: `1px solid ${slide.accent}35`, borderRadius: 999, padding: '4px 12px', marginBottom: '0.85rem' }}
              >
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: slide.accent, display: 'inline-block' }} />
                <span style={{ fontSize: 10.5, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.14em', color: slide.accent }}>{slide.tag}</span>
              </motion.div>
            </AnimatePresence>

            <AnimatePresence mode="wait">
              <motion.h2
                className="hero-slide-headline"
                key={`h-${index}`}
                variants={textVariants} initial="enter" animate="center" exit="exit"
                style={{ fontSize: 'clamp(1.7rem, 2.6vw, 2.4rem)', fontWeight: 700, color: '#eaf2fb', margin: '0 0 1.5rem', letterSpacing: '-0.025em', lineHeight: 1.18, whiteSpace: 'pre-line' }}
              >
                {slide.headline}
              </motion.h2>
            </AnimatePresence>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                {SLIDES.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => { setDir(i > index ? 1 : -1); setIndex(i); }}
                    style={{ width: i === index ? 28 : 7, height: 7, borderRadius: 999, border: 'none', cursor: 'pointer', padding: 0, background: i === index ? slide.accent : 'rgba(255,255,255,0.25)', transition: 'all 0.35s ease' }}
                  />
                ))}
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {[{ icon: ChevronLeft, d: -1 }, { icon: ChevronRight, d: 1 }].map(({ icon: Icon, d }) => (
                  <button
                    key={d}
                    onClick={() => go(d)}
                    style={{ width: 36, height: 36, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(6,14,24,0.5)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#eaf2fb', transition: 'all 0.2s ease' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(56,189,248,0.15)'; e.currentTarget.style.borderColor = 'rgba(56,189,248,0.4)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(6,14,24,0.5)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; }}
                  >
                    <Icon style={{ width: 16, height: 16 }} />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        {!paused && (
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, background: 'rgba(255,255,255,0.08)', zIndex: 3 }}>
            <motion.div
              key={index}
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: SLIDE_DURATION / 1000, ease: 'linear' }}
              style={{ height: '100%', background: slide.accent, borderRadius: 999 }}
            />
          </div>
        )}
      </div>

      {/* ══ TEXT PANEL ══ */}
      <div className="hero-text-col">

        {/* Desktop-only grid texture */}
        <div style={{ position: 'absolute', inset: 0, opacity: 0.02, backgroundImage: 'linear-gradient(rgba(56,189,248,1) 1px, transparent 1px), linear-gradient(90deg, rgba(56,189,248,1) 1px, transparent 1px)', backgroundSize: '48px 48px', pointerEvents: 'none' }} />

        {/* Ambient glows */}
        <div style={{ position: 'absolute', top: '-8rem', right: '-6rem', width: '30rem', height: '30rem', borderRadius: '50%', background: 'radial-gradient(circle, rgba(20,184,166,0.08) 0%, transparent 70%)', filter: 'blur(60px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-5rem', left: '-4rem', width: '24rem', height: '24rem', borderRadius: '50%', background: 'radial-gradient(circle, rgba(56,189,248,0.055) 0%, transparent 70%)', filter: 'blur(55px)', pointerEvents: 'none' }} />

        <div className="hero-text-inner">

          {/* Eyebrow */}
          <motion.div className="hero-eyebrow" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.55 }} style={{ marginBottom: '1.75rem' }}>
            <div className="hero-eyebrow-pill" style={{ display: 'inline-flex', alignItems: 'center', gap: 9, background: 'rgba(45,212,191,0.06)', border: '1px solid rgba(45,212,191,0.2)', borderRadius: 999, padding: '7px 16px' }}>
              <span style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(45,212,191,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Zap style={{ width: 10, height: 10, color: '#2dd4bf' }} />
              </span>
              <span className="hero-eyebrow-label" style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#2dd4bf' }}>
                Mood-first travel AI
              </span>
            </div>
          </motion.div>

          {/* Headline */}
          <motion.div className="hero-headline" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }} style={{ marginBottom: '1.5rem' }}>
            <h1 className="hero-h1" style={{ fontSize: 'clamp(2.8rem, 4vw, 4.5rem)', fontWeight: 700, letterSpacing: '-0.035em', lineHeight: 1.05, color: '#eaf2fb', margin: 0 }}>
              Meet your<br />
              <span style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontWeight: 700, fontSize: '1.1em', background: 'linear-gradient(125deg, #67e8f9 10%, #2dd4bf 50%, #fb923c 90%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                next Voyage
              </span>
            </h1>
          </motion.div>

          {/* Body */}
          <motion.p
            className="hero-body"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.55 }}
            style={{ fontSize: '1rem', lineHeight: 1.85, color: 'var(--color-text-secondary)', marginBottom: '2.25rem', maxWidth: '36rem' }}
          >
            Tell us your mood, budget, and days away. Our AI curates destinations and hotels that match your{' '}
            <span style={{ color: '#2dd4bf', fontWeight: 500 }}>energy</span> — not just your filters.
          </motion.p>

          {/* CTAs */}
          <motion.div className="hero-cta-row" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.5 }}>
            <button
              className="hero-cta-primary"
              onClick={() => document.getElementById('build-route')?.scrollIntoView({ behavior: 'smooth' })}
              style={{ flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 9, background: 'linear-gradient(135deg, #0891b2, #2dd4bf)', border: 'none', borderRadius: '0.875rem', padding: '14px 24px', cursor: 'pointer', boxShadow: '0 8px 28px rgba(8,145,178,0.35)', fontSize: 14, fontWeight: 600, color: '#fff', letterSpacing: '0.01em', fontFamily: 'var(--font-sans)', transition: 'all 0.25s ease' }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = '0 12px 36px rgba(8,145,178,0.5)'}
              onMouseLeave={e => e.currentTarget.style.boxShadow = '0 8px 28px rgba(8,145,178,0.35)'}
            >
              Start exploring <ArrowRight style={{ width: 14, height: 14 }} />
            </button>
            <button
              className="hero-cta-secondary"
              onClick={() => document.getElementById('trending')?.scrollIntoView({ behavior: 'smooth' })}
              style={{ flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 7, background: 'transparent', border: '1px solid rgba(56,189,248,0.18)', borderRadius: '0.875rem', padding: '14px 20px', cursor: 'pointer', fontSize: 14, fontWeight: 500, color: 'var(--color-text-secondary)', fontFamily: 'var(--font-sans)', transition: 'all 0.25s ease' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(56,189,248,0.4)'; e.currentTarget.style.color = '#eaf2fb'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(56,189,248,0.18)'; e.currentTarget.style.color = 'var(--color-text-secondary)'; }}
            >
              <Compass style={{ width: 13, height: 13, color: '#38bdf8' }} />
              Discover vibes
            </button>
          </motion.div>

          {/* Divider */}
          <motion.div
            className="hero-divider"
            initial={{ opacity: 0, scaleX: 0 }} animate={{ opacity: 1, scaleX: 1 }}
            transition={{ delay: 0.52, duration: 0.6, ease: 'easeOut' }}
          />

          {/* Stats */}
          <motion.div className="hero-stats-row" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.5 }}>
            {statItems.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65 + i * 0.08, duration: 0.45 }}
                style={{ flex: 1, paddingRight: i < statItems.length - 1 ? '1.5rem' : 0, borderRight: i < statItems.length - 1 ? '1px solid rgba(56,189,248,0.1)' : 'none', marginRight: i < statItems.length - 1 ? '1.5rem' : 0 }}
              >
                <p className="hero-stat-value" style={{ fontSize: 'clamp(1.5rem, 2vw, 1.85rem)', fontWeight: 700, color: '#38bdf8', margin: 0, letterSpacing: '-0.03em', lineHeight: 1 }}>{stat.value}</p>
                <p className="hero-stat-label" style={{ fontSize: 10.5, fontWeight: 500, color: 'var(--color-text-muted)', margin: '5px 0 0', letterSpacing: '0.04em' }}>{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>

        </div>
      </div>

    </section>
  );
}