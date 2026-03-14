import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Phone, Calendar, CreditCard, MapPin, Star, X, AlertCircle, LogIn } from 'lucide-react';
import { useBooking } from '../../context/BookingContext';
import { useAuth } from '../../context/AuthContext';
import { createBooking } from '../../api/axios';
import ElectricButton from '../ui/ElectricButton';
import DateRangePicker, { formatDate } from './DateRangePicker';
import toast from 'react-hot-toast';

// ─── Inject styles once ───────────────────────────────────────────────────────
const STYLE_ID = 'checkout-form-styles';
if (typeof document !== 'undefined' && !document.getElementById(STYLE_ID)) {
  const s = document.createElement('style');
  s.id = STYLE_ID;
  s.textContent = `
    /* Desktop: two-column — form left, summary right */
    .checkout-layout {
      display: grid;
      grid-template-columns: minmax(0, 1fr) 360px;
      gap: 1.75rem;
      align-items: start;
    }
    .checkout-summary-col {
      position: sticky;
      top: 2rem;
    }

    /* Guest info: 2-col grid */
    .guest-fields-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.1rem;
    }

    /* Auth warning */
    .auth-warning {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding: 0.875rem 1.1rem;
      background: rgba(251,191,36,0.06);
      border: 1px solid rgba(251,191,36,0.25);
      border-radius: 0.875rem;
      margin-bottom: 1.5rem;
    }
    .auth-warning-text {
      font-size: 13px;
    }

    /* ── Mobile ── */
    @media (max-width: 640px) {
      /* Stack: form on top, summary below */
      .checkout-layout {
        grid-template-columns: 1fr !important;
        gap: 1.1rem !important;
      }
      /* Summary is no longer sticky on mobile */
      .checkout-summary-col {
        position: static !important;
        top: unset !important;
      }
      /* Move summary to top of stacking order visually via order */
      .checkout-form-col  { order: 1; }
      .checkout-summary-col { order: 2; }

      /* Guest fields: single column on mobile */
      .guest-fields-grid {
        grid-template-columns: 1fr !important;
        gap: 0.875rem !important;
      }

      /* Auth warning: stack on mobile */
      .auth-warning {
        flex-direction: column;
        align-items: flex-start;
        gap: 10px;
        padding: 0.875rem;
        margin-bottom: 1.1rem;
      }
      .auth-warning-text {
        font-size: 12.5px !important;
      }
      .auth-signin-btn {
        width: 100%;
        justify-content: center !important;
      }

      /* Panels */
      .checkout-panel-inner {
        padding: 1.1rem !important;
      }
      .checkout-section-header {
        margin-bottom: 1.1rem !important;
        padding-bottom: 0.875rem !important;
      }

      /* Summary card image */
      .summary-hotel-image {
        height: 140px !important;
      }
      .summary-room-info {
        padding: 0.875rem 1.1rem !important;
      }
      .summary-price-breakdown {
        padding: 0.875rem 1.1rem !important;
      }
      .summary-cta {
        padding: 1rem 1.1rem !important;
      }
      .summary-total-amount {
        font-size: 1.4rem !important;
      }

      /* Nights pill */
      .nights-pill {
        padding: 0.75rem 0.875rem !important;
      }
      .nights-pill span:last-child {
        font-size: 12px !important;
      }
    }
  `;
  document.head.appendChild(s);
}

// ─── Inline field error ───────────────────────────────────────────────────────
function FieldError({ error }) {
  return (
    <AnimatePresence>
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -4, height: 0 }}
          animate={{ opacity: 1, y: 0, height: 'auto' }}
          exit={{ opacity: 0, y: -4, height: 0 }}
          transition={{ duration: 0.2 }}
          style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 5, overflow: 'hidden' }}
        >
          <AlertCircle style={{ width: 11, height: 11, color: '#f87171', flexShrink: 0 }} />
          <span style={{ fontSize: 11.5, color: '#f87171', fontWeight: 500 }}>{error}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Auth warning banner ──────────────────────────────────────────────────────
function AuthWarning({ onLogin }) {
  return (
    <motion.div
      className="auth-warning"
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
        <AlertCircle style={{ width: 15, height: 15, color: '#fbbf24', flexShrink: 0, marginTop: 1 }} />
        <span className="auth-warning-text" style={{ fontSize: 13, color: 'rgba(251,191,36,0.9)', fontWeight: 500, lineHeight: 1.5 }}>
          You must be signed in for your booking to be saved to your account.
        </span>
      </div>
      <button
        type="button"
        className="auth-signin-btn"
        onClick={onLogin}
        style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '6px 14px', borderRadius: '0.625rem',
          background: 'rgba(251,191,36,0.12)',
          border: '1px solid rgba(251,191,36,0.3)',
          color: '#fbbf24', fontSize: 12, fontWeight: 700,
          cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'inherit',
          transition: 'all 0.2s',
        }}
        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(251,191,36,0.2)')}
        onMouseLeave={e => (e.currentTarget.style.background = 'rgba(251,191,36,0.12)')}
      >
        <LogIn style={{ width: 12, height: 12 }} />
        Sign In
      </button>
    </motion.div>
  );
}

// ─── Shared styles ────────────────────────────────────────────────────────────
const panelStyle = {
  background: 'rgba(10,22,38,0.72)',
  backdropFilter: 'blur(28px)',
  WebkitBackdropFilter: 'blur(28px)',
  border: '1px solid rgba(56,189,248,0.1)',
  borderRadius: '1.25rem',
  boxShadow: '0 8px 40px rgba(0,0,0,0.3)',
};

const labelStyle = {
  fontSize: 10, fontWeight: 700, textTransform: 'uppercase',
  letterSpacing: '0.13em', color: 'rgba(160,184,208,0.5)',
  marginBottom: 6, display: 'block',
};

function IconBadge({ Icon }) {
  return (
    <span style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      width: 36, height: 36, borderRadius: '0.625rem',
      background: 'rgba(56,189,248,0.07)', border: '1px solid rgba(56,189,248,0.12)',
      flexShrink: 0,
    }}>
      <Icon style={{ width: 15, height: 15, color: '#38bdf8' }} />
    </span>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function CheckoutForm() {
  const navigate = useNavigate();
  const { state, dispatch } = useBooking();
  const { user } = useAuth();

  const [loading,      setLoading]      = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [imgHovered,   setImgHovered]   = useState(false);
  const calendarRef = useRef(null);

  const [blurTouched,     setBlurTouched]     = useState({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [errors,          setErrors]          = useState({});

  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '',
  });
  const [dates, setDates] = useState({ checkIn: null, checkOut: null });

  // Pre-fill from Firebase user profile
  useEffect(() => {
    if (user) {
      const displayName = user.displayName || '';
      const [first = '', ...rest] = displayName.split(' ');
      setFormData(prev => ({
        ...prev,
        firstName: prev.firstName || first,
        lastName:  prev.lastName  || rest.join(' '),
        email:     prev.email     || (user.email || ''),
      }));
    }
  }, [user]);

  // Close calendar on outside click
  useEffect(() => {
    const handler = (e) => {
      if (calendarRef.current && !calendarRef.current.contains(e.target))
        setShowCalendar(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // ── Derived values ──────────────────────────────────────────────────────────
  const nights   = dates.checkIn && dates.checkOut
    ? Math.ceil((dates.checkOut - dates.checkIn) / (1000 * 60 * 60 * 24)) : 0;
  const subtotal = (state.selectedRoom?.pricePerNight || 0) * nights;
  const taxes    = Math.round(subtotal * 0.12 * 100) / 100;
  const total    = Math.round((subtotal + taxes) * 100) / 100;

  // ── Validation ──────────────────────────────────────────────────────────────
  const validateField = (name, value) => {
    if (name === 'firstName' && !value.trim()) return 'First name is required';
    if (name === 'lastName'  && !value.trim()) return 'Last name is required';
    if (name === 'email') {
      if (!value.trim()) return 'Email address is required';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Please enter a valid email';
    }
    if (name === 'phone' && value && !/^[\+\d\s\-\(\)]{7,}$/.test(value))
      return 'Please enter a valid phone number';
    return undefined;
  };

  const validateAll = () => {
    const e = {};
    ['firstName', 'lastName', 'email', 'phone'].forEach(n => {
      const err = validateField(n, formData[n]);
      if (err) e[n] = err;
    });
    if (!dates.checkIn || !dates.checkOut)
      e.dates = 'Please select both check-in and check-out dates';
    return e;
  };

  const showError = (name) => {
    if (name === 'dates') return submitAttempted && errors.dates;
    return (blurTouched[name] || submitAttempted) && errors[name];
  };

  // ── Handlers ────────────────────────────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (blurTouched[name] || submitAttempted)
      setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleBlur = (name) => {
    setFocusedField(null);
    setBlurTouched(prev => ({ ...prev, [name]: true }));
    setErrors(prev => ({ ...prev, [name]: validateField(name, formData[name]) }));
  };

  const handleDateChange = (d) => {
    setDates(d);
    if (d.checkIn && d.checkOut) {
      setErrors(prev => ({ ...prev, dates: undefined }));
      setTimeout(() => setShowCalendar(false), 400);
    }
  };

  const inputStyle = (name) => ({
    width: '100%',
    background:   showError(name) ? 'rgba(248,113,113,0.04)' : 'rgba(4,13,24,0.6)',
    border: `1px solid ${
      showError(name)       ? 'rgba(248,113,113,0.4)'  :
      focusedField === name ? 'rgba(56,189,248,0.45)'  :
                              'rgba(56,189,248,0.12)'
    }`,
    borderRadius: '0.75rem',
    padding: '11px 14px',
    color: '#eaf2fb', fontSize: 14, outline: 'none',
    fontFamily: 'inherit', transition: 'all 0.2s ease',
    boxShadow: focusedField === name
      ? '0 0 0 3px rgba(56,189,248,0.06)'
      : showError(name) ? '0 0 0 3px rgba(248,113,113,0.06)' : 'none',
    boxSizing: 'border-box', colorScheme: 'dark',
  });

  // ── Submit ───────────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitAttempted(true);
    setBlurTouched({ firstName: true, lastName: true, email: true, phone: true });

    const errs = validateAll();
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      toast.error('Please fix the errors before continuing');
      return;
    }

    if (!user) {
      toast.error('Please sign in to complete your booking');
      return;
    }

    const checkInISO  = dates.checkIn.toISOString().split('T')[0];
    const checkOutISO = dates.checkOut.toISOString().split('T')[0];

    dispatch({ type: 'SET_DATES', payload: { checkIn: checkInISO, checkOut: checkOutISO, nights } });
    dispatch({
      type: 'SET_GUEST_INFO',
      payload: {
        firstName: formData.firstName, lastName: formData.lastName,
        email: formData.email, phone: formData.phone,
      },
    });

    setLoading(true);
    try {
      const response = await createBooking({
        hotelId:      state.hotel._id,
        roomTypeName: state.selectedRoom.name,
        checkIn:      checkInISO,
        checkOut:     checkOutISO,
        guestInfo: {
          firstName: formData.firstName, lastName: formData.lastName,
          email: formData.email, phone: formData.phone,
        },
        guests:     state.guests,
        vibeSearch: state.searchParams,
      });

      const { bookingReference, totalAmount } = response.data.data;

      dispatch({ type: 'SET_PAYMENT',  payload: { clientSecret: null, bookingReference } });
      dispatch({ type: 'SET_PRICING',  payload: { totalAmount } });

      toast.success('Booking confirmed!');
      navigate('/confirmation');

    } catch (error) {
      const status  = error.response?.status;
      const message = error.response?.data?.error || error.message || 'Something went wrong';

      if (status === 401)      toast.error('Session expired — please sign in again and retry');
      else if (status === 409) toast.error('These dates are no longer available. Please choose different dates.');
      else if (status === 400) toast.error(`Booking error: ${message}`);
      else if (error.code === 'ECONNABORTED')
        toast.error('Server is taking too long to respond. Please retry in a few seconds (free-tier cold start).');
      else                     toast.error(`Could not complete booking: ${message}`);

      console.error('❌ createBooking failed — status:', status, '| message:', message, error);
    } finally {
      setLoading(false);
    }
  };

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <form onSubmit={handleSubmit} noValidate>

      {!user && (
        <AuthWarning onLogin={() => navigate('/login', { state: { from: '/checkout' } })} />
      )}

      <div className="checkout-layout">

        {/* ══════════ LEFT — form fields ══════════ */}
        <div className="checkout-form-col" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

          {/* Guest Information */}
          <motion.div
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12, duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={panelStyle}
          >
            <div className="checkout-panel-inner" style={{ padding: '1.75rem' }}>
              <div
                className="checkout-section-header"
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  marginBottom: '1.5rem', paddingBottom: '1rem',
                  borderBottom: '1px solid rgba(56,189,248,0.07)',
                }}
              >
                <IconBadge Icon={User} />
                <div>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#eaf2fb', margin: 0 }}>Guest Information</h3>
                  <p style={{ fontSize: 12, color: 'rgba(160,184,208,0.4)', margin: '2px 0 0' }}>Fields marked * are required</p>
                </div>
              </div>

              <div className="guest-fields-grid">
                {[
                  { name: 'firstName', label: 'First Name *',    type: 'text',  placeholder: 'John' },
                  { name: 'lastName',  label: 'Last Name *',     type: 'text',  placeholder: 'Doe' },
                  { name: 'email',     label: 'Email Address *', type: 'email', placeholder: 'john@example.com', Icon: Mail },
                  { name: 'phone',     label: 'Phone Number',    type: 'tel',   placeholder: '+1 (555) 000-0000', Icon: Phone },
                ].map(({ name, label, type, placeholder, Icon }) => (
                  <div key={name}>
                    <label style={labelStyle}>
                      {Icon && <Icon style={{ display: 'inline', width: 9, height: 9, marginRight: 4, verticalAlign: 'middle', opacity: 0.6 }} />}
                      {label}
                    </label>
                    <input
                      type={type} name={name} value={formData[name]}
                      onChange={handleChange}
                      onFocus={() => setFocusedField(name)}
                      onBlur={() => handleBlur(name)}
                      placeholder={placeholder}
                      style={inputStyle(name)}
                    />
                    <FieldError error={showError(name) ? errors[name] : undefined} />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Travel Dates */}
          <motion.div
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22, duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={panelStyle}
          >
            <div className="checkout-panel-inner" style={{ padding: '1.75rem' }}>
              <div
                className="checkout-section-header"
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  marginBottom: '1.5rem', paddingBottom: '1rem',
                  borderBottom: '1px solid rgba(56,189,248,0.07)',
                }}
              >
                <IconBadge Icon={Calendar} />
                <div>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#eaf2fb', margin: 0 }}>Travel Dates</h3>
                  <p style={{ fontSize: 12, color: 'rgba(160,184,208,0.4)', margin: '2px 0 0' }}>Select your check-in and check-out</p>
                </div>
              </div>

              <div ref={calendarRef}>
                <button
                  type="button"
                  onClick={() => setShowCalendar(v => !v)}
                  style={{
                    width: '100%',
                    background: showError('dates') ? 'rgba(248,113,113,0.04)' : 'rgba(4,13,24,0.6)',
                    border: `1px solid ${
                      showError('dates') ? 'rgba(248,113,113,0.4)' :
                      showCalendar       ? 'rgba(56,189,248,0.45)' :
                                          'rgba(56,189,248,0.12)'
                    }`,
                    borderRadius: '0.75rem', padding: '12px 16px',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s ease',
                    boxShadow: showCalendar
                      ? '0 0 0 3px rgba(56,189,248,0.06)'
                      : showError('dates') ? '0 0 0 3px rgba(248,113,113,0.06)' : 'none',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0, flex: 1 }}>
                    <Calendar style={{ width: 14, height: 14, color: '#38bdf8', flexShrink: 0 }} />
                    {dates.checkIn && dates.checkOut ? (
                      <span style={{ fontSize: 13.5, color: '#eaf2fb', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {formatDate(dates.checkIn)} → {formatDate(dates.checkOut)}
                        <span style={{ marginLeft: 8, fontSize: 12, color: '#38bdf8', fontWeight: 600 }}>
                          {nights}n
                        </span>
                      </span>
                    ) : dates.checkIn ? (
                      <span style={{ fontSize: 13.5, color: 'rgba(160,184,208,0.7)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {formatDate(dates.checkIn)} → <span style={{ color: 'rgba(56,189,248,0.6)' }}>Select checkout</span>
                      </span>
                    ) : (
                      <span style={{ fontSize: 13.5, color: 'rgba(160,184,208,0.35)' }}>Select your travel dates</span>
                    )}
                  </div>
                  {dates.checkIn && (
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        setDates({ checkIn: null, checkOut: null });
                        setErrors(prev => ({ ...prev, dates: undefined }));
                      }}
                      style={{ color: 'rgba(160,184,208,0.35)', cursor: 'pointer', padding: '2px 4px', borderRadius: 4, transition: 'color 0.15s', flexShrink: 0 }}
                      onMouseEnter={e => (e.currentTarget.style.color = '#f87171')}
                      onMouseLeave={e => (e.currentTarget.style.color = 'rgba(160,184,208,0.35)')}
                    >
                      <X style={{ width: 13, height: 13 }} />
                    </span>
                  )}
                </button>

                <FieldError error={showError('dates') ? errors.dates : undefined} />

                <AnimatePresence>
                  {showCalendar && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.98 }}
                      transition={{ duration: 0.2 }}
                      style={{ marginTop: '0.75rem' }}
                    >
                      <DateRangePicker
                        checkIn={dates.checkIn}
                        checkOut={dates.checkOut}
                        onChange={handleDateChange}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <AnimatePresence>
                {nights > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                    animate={{ opacity: 1, height: 'auto', marginTop: '1.25rem' }}
                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                    transition={{ duration: 0.3 }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div
                      className="nights-pill"
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                        padding: '0.875rem 1rem', borderRadius: '0.75rem',
                        background: 'rgba(56,189,248,0.05)', border: '1px solid rgba(56,189,248,0.12)',
                        flexWrap: 'wrap',
                      }}
                    >
                      <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#38bdf8', display: 'inline-block', flexShrink: 0 }} />
                      <span style={{ fontSize: 14, fontWeight: 600, color: '#38bdf8' }}>
                        {nights} night{nights > 1 ? 's' : ''}
                      </span>
                      <span style={{ fontSize: 13, color: 'rgba(160,184,208,0.6)' }}>
                        · ${state.selectedRoom?.pricePerNight} × {nights} = ${subtotal.toLocaleString()}
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* ══════════ RIGHT — booking summary ══════════ */}
        <motion.div
          className="checkout-summary-col"
          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.18, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div style={{
            ...panelStyle,
            borderColor: 'rgba(45,212,191,0.18)',
            boxShadow: '0 12px 40px rgba(0,0,0,0.25), 0 0 0 1px rgba(45,212,191,0.08)',
            overflow: 'hidden',
          }}>

            {/* Hotel image */}
            <div
              className="summary-hotel-image"
              style={{ position: 'relative', height: 168, overflow: 'hidden' }}
              onMouseEnter={() => setImgHovered(true)}
              onMouseLeave={() => setImgHovered(false)}
            >
              <motion.img
                src={state.hotel?.heroImage}
                alt={state.hotel?.name}
                animate={{ scale: imgHovered ? 1.08 : 1 }}
                transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(6,14,24,0.25) 0%, rgba(13,31,51,0.92) 100%)' }} />

              {state.hotel?.starRating && (
                <div style={{
                  position: 'absolute', top: 12, right: 12,
                  display: 'flex', alignItems: 'center', gap: 3,
                  background: 'rgba(6,14,24,0.65)', backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(251,191,36,0.25)', borderRadius: 999, padding: '4px 10px',
                }}>
                  {[...Array(state.hotel.starRating)].map((_, i) => (
                    <Star key={i} style={{ width: 10, height: 10, color: '#fbbf24', fill: '#fbbf24' }} />
                  ))}
                </div>
              )}

              <div style={{ position: 'absolute', bottom: '1rem', left: '1.25rem', right: '1.25rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#eaf2fb', margin: '0 0 4px', letterSpacing: '-0.015em', lineHeight: 1.2 }}>
                  {state.hotel?.name}
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <MapPin style={{ width: 11, height: 11, color: '#2dd4bf', flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: 'rgba(160,184,208,0.75)' }}>
                    {state.destination?.city}, {state.destination?.country}
                  </span>
                </div>
              </div>
            </div>

            {/* Room info */}
            <div className="summary-room-info" style={{ padding: '1.1rem 1.4rem', borderBottom: '1px solid rgba(56,189,248,0.07)' }}>
              <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.14em', color: 'rgba(45,212,191,0.75)', margin: '0 0 5px' }}>
                Selected Room
              </p>
              <p style={{ fontSize: '0.925rem', fontWeight: 600, color: '#eaf2fb', margin: '0 0 3px', letterSpacing: '-0.01em' }}>
                {state.selectedRoom?.name}
              </p>
              <p style={{ fontSize: 12, color: 'rgba(160,184,208,0.55)', margin: 0 }}>
                {state.selectedRoom?.sizeSqFt} sq ft · {state.selectedRoom?.bedConfiguration}
              </p>
            </div>

            {/* Price breakdown */}
            <div className="summary-price-breakdown" style={{ padding: '1.1rem 1.4rem', borderBottom: '1px solid rgba(56,189,248,0.07)' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 13, color: 'rgba(160,184,208,0.6)' }}>Rate / night</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#38bdf8' }}>${state.selectedRoom?.pricePerNight}</span>
                </div>
                <AnimatePresence>
                  {nights > 0 ? (
                    <motion.div key="breakdown" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: 13, color: 'rgba(160,184,208,0.6)' }}>{nights} night{nights > 1 ? 's' : ''}</span>
                        <span style={{ fontSize: 13, color: '#eaf2fb' }}>${subtotal.toLocaleString()}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: 13, color: 'rgba(160,184,208,0.6)' }}>Taxes & fees (12%)</span>
                        <span style={{ fontSize: 13, color: '#eaf2fb' }}>${taxes.toFixed(2)}</span>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.p key="placeholder" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      style={{ fontSize: 12, color: 'rgba(160,184,208,0.35)', fontStyle: 'italic', margin: 0 }}>
                      Select dates to see total
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Total + CTA */}
            <div className="summary-cta" style={{ padding: '1.25rem 1.4rem' }}>
              <AnimatePresence mode="wait">
                {nights > 0 ? (
                  <motion.div key="pay" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                      <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#eaf2fb' }}>Total</span>
                      <motion.span
                        className="summary-total-amount"
                        key={total}
                        initial={{ scale: 1.08, color: '#2dd4bf' }} animate={{ scale: 1, color: '#38bdf8' }}
                        transition={{ duration: 0.3 }}
                        style={{ fontSize: '1.6rem', fontWeight: 700, letterSpacing: '-0.04em', fontFamily: 'inherit' }}>
                        ${total.toFixed(2)}
                      </motion.span>
                    </div>
                    <ElectricButton type="submit" fullWidth size="lg" loading={loading} disabled={loading || !user}>
                      <CreditCard style={{ width: 16, height: 16 }} />
                      {!user ? 'Sign In to Book' : loading ? 'Confirming…' : 'Confirm Booking'}
                    </ElectricButton>
                    {!user && (
                      <p style={{ textAlign: 'center', fontSize: 11.5, color: 'rgba(160,184,208,0.35)', marginTop: 8, marginBottom: 0 }}>
                        Sign in so your booking is saved to your account
                      </p>
                    )}
                  </motion.div>
                ) : (
                  <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <div style={{
                      padding: '0.875rem', borderRadius: '0.75rem',
                      background: 'rgba(56,189,248,0.04)',
                      border: '1px dashed rgba(56,189,248,0.14)', textAlign: 'center',
                    }}>
                      <p style={{ fontSize: 12.5, color: 'rgba(160,184,208,0.4)', margin: 0 }}>
                        Enter your travel dates to continue
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>
        </motion.div>

      </div>
    </form>
  );
}