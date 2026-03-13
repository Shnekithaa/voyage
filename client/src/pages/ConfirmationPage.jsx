import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle, Plane, Calendar, Hotel, MapPin,
  Mail, Copy, Home, Sparkles, Check,
} from 'lucide-react';
import { useBooking } from '../context/BookingContext';
import ElectricButton from '../components/ui/ElectricButton';
import toast from 'react-hot-toast';

// ─── Inject styles once ───────────────────────────────────────────────────────
const STYLE_ID = 'confirmation-page-styles';
if (typeof document !== 'undefined' && !document.getElementById(STYLE_ID)) {
  const s = document.createElement('style');
  s.id = STYLE_ID;
  s.textContent = `
    .confirmation-root {
      min-height: 100vh;
      padding-top: 6.5rem;
      padding-bottom: 7rem;
    }
    main.confirmation-root {
      padding-top: 6.5rem !important;
    }
    .confirmation-inner {
      max-width: 640px;
      margin: 0 auto;
      padding: 0 1.5rem;
    }
    .confirmation-hero {
      text-align: center;
      margin-bottom: 2.75rem;
    }
    .confirmation-hero-ring {
      display: flex;
      justify-content: center;
      margin-bottom: 1.75rem;
    }
    .confirmation-panels {
      display: flex;
      flex-direction: column;
      gap: 1.1rem;
    }
    .confirmation-panel-pad {
      padding: 1.5rem;
    }
    .confirmation-ref-pad {
      padding: 1.5rem;
      text-align: center;
    }
    .confirmation-dates-text {
      font-size: 14px;
      font-weight: 600;
      color: #eaf2fb;
      margin: 0 0 2px;
      line-height: 1.5;
    }
    .confirmation-total-amount {
      font-size: 1.65rem;
    }
    .confirmation-actions {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      margin-top: 0.1rem;
    }

    @media (max-width: 640px) {
      .confirmation-root,
      main.confirmation-root {
        padding-top: 1.25rem !important;
        padding-bottom: 6rem !important;
      }
      .confirmation-inner {
        padding: 0 1rem;
      }

      /* Tighter hero */
      .confirmation-hero {
        margin-bottom: 1.75rem;
      }
      .confirmation-hero-ring {
        margin-bottom: 1.25rem;
      }
      .confirmation-hero h1 {
        font-size: 1.75rem !important;
        margin-bottom: 0.4rem !important;
      }
      .confirmation-hero p {
        font-size: 13.5px !important;
      }

      /* Tighter panels */
      .confirmation-panel-pad {
        padding: 1.1rem !important;
      }
      .confirmation-ref-pad {
        padding: 1.1rem !important;
      }

      /* Booking ref font size */
      .confirmation-ref-code {
        font-size: 1.45rem !important;
        letter-spacing: 0.08em !important;
      }

      /* Dates: wrap gracefully */
      .confirmation-dates-text {
        font-size: 13px !important;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 4px;
      }
      .confirmation-dates-arrow {
        flex-shrink: 0;
      }

      /* Total paid */
      .confirmation-total-amount {
        font-size: 1.4rem !important;
      }

      /* Email notice text */
      .confirmation-email-text {
        font-size: 12.5px !important;
      }

      /* Vibe match */
      .confirmation-vibe-pad {
        padding: 1.1rem !important;
      }

      /* Trip details rows gap */
      .confirmation-trip-rows {
        gap: 1rem !important;
      }
      .confirmation-trip-header {
        margin-bottom: 1.1rem !important;
        padding-bottom: 0.75rem !important;
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
        ref.current.style.setProperty('padding-top', '1.25rem', 'important');
      } else {
        ref.current.style.removeProperty('padding-top');
      }
    };
    apply();
    window.addEventListener('resize', apply);
    return () => window.removeEventListener('resize', apply);
  }, [ref]);
}

// ─── Confetti ─────────────────────────────────────────────────────────────────
function ConfettiParticle({ delay, x, y, color, size, rotation }) {
  return (
    <motion.div
      initial={{ opacity: 1, x: 0, y: 0, rotate: 0, scale: 1 }}
      animate={{ opacity: 0, x, y, rotate: rotation, scale: 0 }}
      transition={{ duration: 1.4, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={{
        position: 'absolute', top: '50%', left: '50%',
        width: size, height: size,
        borderRadius: size > 6 ? '2px' : '50%',
        background: color, pointerEvents: 'none',
      }}
    />
  );
}

function ConfettiBurst() {
  const particles = Array.from({ length: 28 }, (_, i) => ({
    delay: Math.random() * 0.3,
    x: (Math.random() - 0.5) * 320,
    y: (Math.random() - 0.5) * 260 - 60,
    color: ['#38bdf8','#2dd4bf','#4ade80','#fbbf24','#a78bfa','#f472b6'][i % 6],
    size: Math.random() * 6 + 4,
    rotation: (Math.random() - 0.5) * 720,
  }));
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      {particles.map((p, i) => <ConfettiParticle key={i} {...p} />)}
    </div>
  );
}

// ─── Success ring ─────────────────────────────────────────────────────────────
function SuccessRing() {
  return (
    <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
      <ConfettiBurst />
      {[0, 0.2, 0.4].map((delay, i) => (
        <motion.div
          key={i}
          initial={{ scale: 0.6, opacity: 0.6 }}
          animate={{ scale: 2.2 + i * 0.4, opacity: 0 }}
          transition={{ duration: 1.8, delay: 0.4 + delay, repeat: Infinity, repeatDelay: 2 }}
          style={{
            position: 'absolute', width: 96, height: 96, borderRadius: '50%',
            border: '1px solid rgba(74,222,128,0.4)', pointerEvents: 'none',
          }}
        />
      ))}
      <motion.div
        initial={{ scale: 0, rotate: -90 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.2 }}
        style={{
          width: 96, height: 96, borderRadius: '50%',
          background: 'radial-gradient(circle at 35% 35%, rgba(74,222,128,0.18) 0%, rgba(74,222,128,0.06) 100%)',
          border: '1.5px solid rgba(74,222,128,0.35)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 40px rgba(74,222,128,0.15), inset 0 0 20px rgba(74,222,128,0.06)',
        }}
      >
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300, delay: 0.5 }}
        >
          <CheckCircle style={{ width: 44, height: 44, color: '#4ade80' }} />
        </motion.div>
      </motion.div>
    </div>
  );
}

// ─── Detail row ───────────────────────────────────────────────────────────────
function DetailRow({ icon: Icon, label, children, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}
    >
      <span style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        width: 34, height: 34, borderRadius: '0.6rem', flexShrink: 0, marginTop: 1,
        background: 'rgba(56,189,248,0.07)', border: '1px solid rgba(56,189,248,0.12)',
      }}>
        <Icon style={{ width: 14, height: 14, color: '#38bdf8' }} />
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(160,184,208,0.45)', margin: '0 0 4px' }}>{label}</p>
        {children}
      </div>
    </motion.div>
  );
}

// ─── Panel ────────────────────────────────────────────────────────────────────
function Panel({ children, style = {}, delay = 0, teal = false }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={{
        background: 'rgba(10,22,38,0.72)',
        backdropFilter: 'blur(28px)', WebkitBackdropFilter: 'blur(28px)',
        border: `1px solid ${teal ? 'rgba(45,212,191,0.18)' : 'rgba(56,189,248,0.1)'}`,
        borderRadius: '1.25rem',
        boxShadow: teal
          ? '0 12px 40px rgba(0,0,0,0.3), 0 0 0 1px rgba(45,212,191,0.06)'
          : '0 8px 32px rgba(0,0,0,0.25)',
        ...style,
      }}
    >
      {children}
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ConfirmationPage() {
  const navigate = useNavigate();
  const { state, dispatch } = useBooking();
  const [copied, setCopied] = useState(false);
  const mainRef = useRef(null);
  useMobilePaddingFix(mainRef);

  useEffect(() => {
    if (!state.bookingReference) navigate('/');
  }, [state.bookingReference, navigate]);

  const copyReference = () => {
    navigator.clipboard.writeText(state.bookingReference);
    setCopied(true);
    toast.success('Booking reference copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  if (!state.bookingReference) return null;

  const formatD = (iso) => iso
    ? new Date(iso).toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' })
    : 'N/A';

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) { toast.error('Please allow pop-ups to print'); return; }
    const dest = state.destination || state.hotel?.destination || {};
    const html = `<!DOCTYPE html>
<html><head><title>Booking ${state.bookingReference}</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;padding:40px 48px;color:#1a1a2e;line-height:1.6}
.header{text-align:center;border-bottom:2px solid #0891b2;padding-bottom:20px;margin-bottom:28px}
.header h1{font-size:28px;color:#0891b2;letter-spacing:2px;margin-bottom:4px}
.header .sub{font-size:13px;color:#6b7280}
.ref{text-align:center;margin-bottom:28px}
.ref .label{font-size:11px;text-transform:uppercase;letter-spacing:1.5px;color:#6b7280;margin-bottom:6px}
.ref .code{font-family:'Courier New',monospace;font-size:26px;font-weight:700;color:#0891b2;letter-spacing:3px}
.section{margin-bottom:22px;border:1px solid #e5e7eb;border-radius:10px;overflow:hidden}
.section h2{font-size:14px;font-weight:700;color:#0891b2;background:#f0f9ff;padding:10px 16px;border-bottom:1px solid #e5e7eb;text-transform:uppercase;letter-spacing:0.5px}
.rows{padding:4px 16px}
.row{display:flex;justify-content:space-between;padding:9px 0;border-bottom:1px solid #f3f4f6}
.row:last-child{border-bottom:none}
.row .lbl{color:#6b7280;font-size:13px}
.row .val{font-weight:600;font-size:13px;color:#1a1a2e}
.total-box{text-align:center;padding:18px;background:#f0f9ff;border-radius:10px;margin:20px 0;border:1px solid #bae6fd}
.total-box .amount{font-size:28px;font-weight:800;color:#0891b2}
.total-box .lbl{font-size:12px;color:#6b7280;margin-bottom:4px}
.footer{text-align:center;margin-top:36px;padding-top:16px;border-top:1px solid #e5e7eb;font-size:11px;color:#9ca3af}
@media print{body{padding:20px 24px}}
</style></head><body>
<div class="header"><h1>✈️ VOYAGE</h1><div class="sub">Booking Confirmation</div></div>
<div class="ref"><div class="label">Booking Reference</div><div class="code">${state.bookingReference}</div></div>
<div class="section"><h2>🏨 Trip Details</h2><div class="rows">
<div class="row"><span class="lbl">Destination</span><span class="val">${dest.city || 'N/A'}${dest.country ? ', ' + dest.country : ''}</span></div>
<div class="row"><span class="lbl">Hotel</span><span class="val">${state.hotel?.name || 'N/A'}</span></div>
<div class="row"><span class="lbl">Room</span><span class="val">${state.selectedRoom?.name || 'N/A'}</span></div>
<div class="row"><span class="lbl">Check-in</span><span class="val">${formatD(state.checkIn)}</span></div>
<div class="row"><span class="lbl">Check-out</span><span class="val">${formatD(state.checkOut)}</span></div>
<div class="row"><span class="lbl">Nights</span><span class="val">${state.nights || 'N/A'}</span></div>
</div></div>
<div class="section"><h2>👤 Guest Information</h2><div class="rows">
<div class="row"><span class="lbl">Name</span><span class="val">${state.guestInfo?.firstName || ''} ${state.guestInfo?.lastName || ''}</span></div>
<div class="row"><span class="lbl">Email</span><span class="val">${state.guestInfo?.email || 'N/A'}</span></div>
${state.guestInfo?.phone ? `<div class="row"><span class="lbl">Phone</span><span class="val">${state.guestInfo.phone}</span></div>` : ''}
</div></div>
<div class="total-box"><div class="lbl">Total Paid</div><div class="amount">$${state.pricing?.totalAmount?.toFixed(2) || '0.00'}</div></div>
<div class="footer"><p>Voyage — Curated by AI, crafted for you</p><p>Printed on ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p></div>
</body></html>`;
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => { printWindow.print(); }, 300);
  };

  return (
    <main ref={mainRef} className="confirmation-root">
      <div className="confirmation-inner">

        {/* ── Hero ── */}
        <motion.div
          className="confirmation-hero"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div className="confirmation-hero-ring">
            <SuccessRing />
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.5 }}
            style={{
              fontSize: 'clamp(1.85rem, 4vw, 2.75rem)',
              fontWeight: 800, color: '#eaf2fb',
              margin: '0 0 0.6rem', letterSpacing: '-0.04em', lineHeight: 1.1,
            }}
          >
            Booking Confirmed!
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            style={{ fontSize: 15, color: 'rgba(160,184,208,0.55)', margin: 0 }}
          >
            Your Voyage Ticket is being prepared ✈️
          </motion.p>
        </motion.div>

        {/* ── All panels in a gap container ── */}
        <div className="confirmation-panels">

          {/* Booking reference */}
          <Panel delay={0.75} teal>
            <div className="confirmation-ref-pad">
              <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.16em', color: 'rgba(45,212,191,0.65)', margin: '0 0 0.75rem' }}>
                Booking Reference
              </p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
                <span
                  className="confirmation-ref-code"
                  style={{
                    fontSize: 'clamp(1.45rem, 4vw, 2.2rem)',
                    fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
                    fontWeight: 700, color: '#38bdf8', letterSpacing: '0.12em',
                  }}
                >
                  {state.bookingReference}
                </span>
                <button
                  type="button"
                  onClick={copyReference}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    width: 36, height: 36, borderRadius: '0.625rem',
                    background: copied ? 'rgba(74,222,128,0.1)' : 'rgba(56,189,248,0.07)',
                    border: `1px solid ${copied ? 'rgba(74,222,128,0.3)' : 'rgba(56,189,248,0.15)'}`,
                    cursor: 'pointer', transition: 'all 0.2s ease', flexShrink: 0,
                  }}
                  onMouseEnter={e => { if (!copied) e.currentTarget.style.background = 'rgba(56,189,248,0.14)'; }}
                  onMouseLeave={e => { if (!copied) e.currentTarget.style.background = copied ? 'rgba(74,222,128,0.1)' : 'rgba(56,189,248,0.07)'; }}
                >
                  <AnimatePresence mode="wait">
                    {copied
                      ? <motion.div key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}><Check style={{ width: 14, height: 14, color: '#4ade80' }} /></motion.div>
                      : <motion.div key="copy"  initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}><Copy  style={{ width: 14, height: 14, color: '#38bdf8' }} /></motion.div>
                    }
                  </AnimatePresence>
                </button>
              </div>
              <div style={{ marginTop: '1.1rem', borderTop: '1px dashed rgba(56,189,248,0.12)', paddingTop: '1rem' }}>
                <p style={{ fontSize: 12, color: 'rgba(160,184,208,0.35)', margin: 0 }}>
                  Save this reference — you'll need it to manage your booking
                </p>
              </div>
            </div>
          </Panel>

          {/* Trip details */}
          <Panel delay={0.85}>
            <div className="confirmation-panel-pad">
              {/* Header */}
              <div
                className="confirmation-trip-header"
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  marginBottom: '1.5rem', paddingBottom: '1rem',
                  borderBottom: '1px solid rgba(56,189,248,0.07)',
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 34, height: 34, borderRadius: '0.6rem', background: 'rgba(56,189,248,0.07)', border: '1px solid rgba(56,189,248,0.12)' }}>
                  <Plane style={{ width: 14, height: 14, color: '#38bdf8' }} />
                </span>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#eaf2fb', margin: 0 }}>Trip Details</h3>
              </div>

              <div className="confirmation-trip-rows" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

                <DetailRow icon={MapPin} label="Destination" delay={0.9}>
                  <p style={{ fontSize: 14, fontWeight: 600, color: '#eaf2fb', margin: 0 }}>
                    {state.destination?.city || state.hotel?.destination?.city},{' '}
                    {state.destination?.country || state.hotel?.destination?.country}
                  </p>
                </DetailRow>

                <div style={{ height: 1, background: 'rgba(56,189,248,0.06)' }} />

                <DetailRow icon={Hotel} label="Hotel & Room" delay={0.95}>
                  <p style={{ fontSize: 14, fontWeight: 600, color: '#eaf2fb', margin: '0 0 2px' }}>{state.hotel?.name}</p>
                  <p style={{ fontSize: 13, color: 'rgba(160,184,208,0.55)', margin: 0 }}>{state.selectedRoom?.name}</p>
                </DetailRow>

                <div style={{ height: 1, background: 'rgba(56,189,248,0.06)' }} />

                <DetailRow icon={Calendar} label="Dates" delay={1.0}>
                  {/* On mobile, dates stack via flex-wrap */}
                  <p className="confirmation-dates-text">
                    <span>{formatD(state.checkIn)}</span>
                    <span className="confirmation-dates-arrow" style={{ color: 'rgba(56,189,248,0.5)', margin: '0 4px' }}>→</span>
                    <span>{formatD(state.checkOut)}</span>
                  </p>
                  <p style={{ fontSize: 13, color: 'rgba(160,184,208,0.55)', margin: 0 }}>
                    {state.nights} night{state.nights !== 1 ? 's' : ''}
                  </p>
                </DetailRow>

                {/* Total paid */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.05 }}
                  style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    marginTop: '0.25rem', paddingTop: '1.25rem',
                    borderTop: '1px solid rgba(56,189,248,0.07)',
                  }}
                >
                  <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#eaf2fb' }}>Total Paid</span>
                  <motion.span
                    className="confirmation-total-amount"
                    initial={{ scale: 1.15, color: '#2dd4bf' }}
                    animate={{ scale: 1, color: '#38bdf8' }}
                    transition={{ delay: 1.1, duration: 0.4 }}
                    style={{ fontWeight: 800, letterSpacing: '-0.04em' }}
                  >
                    ${state.pricing?.totalAmount?.toFixed(2) || '0.00'}
                  </motion.span>
                </motion.div>
              </div>
            </div>
          </Panel>

          {/* Email notice */}
          <Panel delay={1.05}>
            <div className="confirmation-panel-pad" style={{ padding: '1.25rem 1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 34, height: 34, borderRadius: '0.6rem', background: 'rgba(56,189,248,0.07)', border: '1px solid rgba(56,189,248,0.12)', flexShrink: 0, marginTop: 1 }}>
                  <Mail style={{ width: 14, height: 14, color: '#38bdf8' }} />
                </span>
                <div>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#eaf2fb', margin: '0 0 5px' }}>
                    Voyage Ticket Sent! ✈️
                  </h4>
                  <p className="confirmation-email-text" style={{ fontSize: 13, color: 'rgba(160,184,208,0.55)', margin: 0, lineHeight: 1.6 }}>
                    We've sent your booking confirmation and a personalized AI-generated{' '}
                    <span style={{ color: '#38bdf8', fontWeight: 600 }}>3-day itinerary</span>{' '}
                    to{' '}
                    <span style={{ color: '#eaf2fb', fontWeight: 500 }}>{state.guestInfo?.email}</span>.
                    {' '}Check your inbox!
                  </p>
                </div>
              </div>
            </div>
          </Panel>

          {/* Vibe match */}
          <AnimatePresence>
            {state.vibeMatchPercent && (
              <Panel delay={1.1} teal>
                <div className="confirmation-vibe-pad" style={{ padding: '1.5rem', textAlign: 'center' }}>
                  <motion.div
                    animate={{ rotate: [0, 15, -15, 10, -10, 0] }}
                    transition={{ delay: 1.3, duration: 0.7 }}
                    style={{ display: 'inline-block', marginBottom: '0.75rem' }}
                  >
                    <Sparkles style={{ width: 28, height: 28, color: '#38bdf8' }} />
                  </motion.div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#eaf2fb', margin: '0 0 6px' }}>
                    Your Vibe Match:{' '}
                    <span style={{ color: '#2dd4bf' }}>{state.vibeMatchPercent}%</span>
                  </h4>
                  <p style={{ fontSize: 13, color: 'rgba(160,184,208,0.55)', margin: 0, maxWidth: 420, marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.6 }}>
                    {state.vibeExplanation}
                  </p>
                </div>
              </Panel>
            )}
          </AnimatePresence>

          {/* Actions */}
          <motion.div
            className="confirmation-actions"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.15, duration: 0.5 }}
          >
            <ElectricButton
              fullWidth
              onClick={() => { dispatch({ type: 'RESET' }); navigate('/'); }}
            >
              <Home style={{ width: 16, height: 16, marginRight: 8 }} />
              Plan Another Trip
            </ElectricButton>

            <button
              type="button"
              onClick={handlePrint}
              style={{
                width: '100%', padding: '13px 20px',
                background: 'rgba(56,189,248,0.05)',
                border: '1px solid rgba(56,189,248,0.15)',
                borderRadius: '0.875rem',
                color: 'rgba(160,184,208,0.7)',
                fontSize: 14, fontWeight: 600, fontFamily: 'inherit',
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                transition: 'all 0.2s ease', letterSpacing: '-0.01em',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(56,189,248,0.09)'; e.currentTarget.style.color = '#eaf2fb'; e.currentTarget.style.borderColor = 'rgba(56,189,248,0.28)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(56,189,248,0.05)'; e.currentTarget.style.color = 'rgba(160,184,208,0.7)'; e.currentTarget.style.borderColor = 'rgba(56,189,248,0.15)'; }}
            >
              🖨️ Print Confirmation
            </button>
          </motion.div>

        </div>
      </div>
    </main>
  );
}