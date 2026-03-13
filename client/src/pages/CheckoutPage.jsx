import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import { useBooking } from '../context/BookingContext';
import CheckoutForm from '../components/booking/CheckoutForm';

// ─── Inject styles once ───────────────────────────────────────────────────────
const STYLE_ID = 'checkout-page-styles';
if (typeof document !== 'undefined' && !document.getElementById(STYLE_ID)) {
  const s = document.createElement('style');
  s.id = STYLE_ID;
  s.textContent = `
    .checkout-root {
      min-height: 100vh;
      padding-top: 6rem;
      padding-bottom: 7rem;
    }
    main.checkout-root {
      padding-top: 6rem !important;
    }
    .checkout-inner {
      max-width: 1100px;
      margin: 0 auto;
      padding: 0 1.5rem;
    }
    .checkout-page-header {
      margin-bottom: 2.75rem;
    }
    .checkout-back-btn {
      display: inline-flex;
      align-items: center;
      gap: 7px;
      background: none;
      border: none;
      cursor: pointer;
      color: rgba(160,184,208,0.55);
      font-size: 13.5px;
      font-weight: 500;
      margin-bottom: 1.5rem;
      padding: 0;
      font-family: inherit;
      transition: color 0.2s ease;
    }
    .checkout-back-btn:hover { color: #38bdf8; }
    .checkout-security-footer {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      margin-top: 2rem;
    }

    @media (max-width: 640px) {
      .checkout-root,
      main.checkout-root {
        padding-top: 1rem !important;
        padding-bottom: 6rem !important;
      }
      .checkout-inner {
        padding: 0 1rem;
      }
      .checkout-page-header {
        margin-bottom: 1.5rem;
      }
      .checkout-back-btn {
        display: none !important;
      }
      .checkout-page-header h1 {
        font-size: 1.6rem !important;
      }
      .checkout-page-header p {
        font-size: 13px !important;
        margin-top: 5px !important;
      }
      .checkout-security-footer {
        flex-wrap: wrap;
        text-align: center;
        margin-top: 1.5rem;
      }
      .checkout-security-footer span {
        font-size: 11.5px !important;
      }
    }
  `;
  document.head.appendChild(s);
}

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

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { state } = useBooking();
  const mainRef = useRef(null);
  useMobilePaddingFix(mainRef);

  useEffect(() => {
    if (!state.hotel || !state.selectedRoom) navigate('/');
  }, [state.hotel, state.selectedRoom, navigate]);

  if (!state.hotel || !state.selectedRoom) return null;

  return (
    <main ref={mainRef} className="checkout-root">
      <div className="checkout-inner">

        {/* ── Header ── */}
        <motion.div
          className="checkout-page-header"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <button
            type="button"
            className="checkout-back-btn"
            onClick={() => navigate(-1)}
            onMouseEnter={e => (e.currentTarget.style.color = '#38bdf8')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(160,184,208,0.55)')}
          >
            <ArrowLeft style={{ width: 15, height: 15 }} />
            Back to Hotels
          </button>

          <h1 style={{
            fontSize: 'clamp(1.9rem, 3vw, 2.75rem)',
            fontWeight: 800, color: '#eaf2fb',
            margin: 0, letterSpacing: '-0.04em', lineHeight: 1.1,
          }}>
            Complete Your Booking
          </h1>
          <p style={{ fontSize: 14, color: 'rgba(160,184,208,0.45)', marginTop: 8, marginBottom: 0 }}>
            You're almost there — fill in your details to secure your stay.
          </p>
        </motion.div>

        <CheckoutForm />

        {/* ── Security footer ── */}
        <motion.div
          className="checkout-security-footer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <ShieldCheck style={{ width: 14, height: 14, color: '#4ade80', flexShrink: 0 }} />
          <span style={{ fontSize: 13, color: 'rgba(160,184,208,0.35)' }}>
            Secure checkout powered by Stripe. Your payment info is encrypted and safe.
          </span>
        </motion.div>

      </div>
    </main>
  );
}