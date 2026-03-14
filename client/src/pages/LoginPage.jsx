import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, Eye, EyeOff, AlertCircle, ArrowRight, MapPin, Plane } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ElectricButton from '../components/ui/ElectricButton';
import VoyageLogo from '../components/layout/VoyageLogo';
import toast from 'react-hot-toast';

function getAuthErrorMessage(error) {
  const code = error?.code;
  const fallback = error?.message || 'Authentication failed. Please try again.';

  const map = {
    'auth/invalid-email': 'Invalid email address format.',
    'auth/user-not-found': 'No account found with this email.',
    'auth/invalid-credential': 'Invalid email or password.',
    'auth/wrong-password': 'Invalid email or password.',
    'auth/email-already-in-use': 'This email is already registered.',
    'auth/weak-password': 'Password should be at least 6 characters.',
    'auth/too-many-requests': 'Too many attempts. Please try again later.',
    'auth/network-request-failed': 'Network error. Check your internet and try again.',
    'auth/operation-not-allowed': 'This sign-in method is disabled in Firebase console.',
    'auth/unauthorized-domain': 'This domain is not authorized in Firebase Auth settings.',
    'auth/popup-blocked': 'Popup blocked by browser. Please allow popups and try again.',
    'auth/popup-closed-by-user': 'Google sign-in popup was closed before completing sign-in.',
  };

  return map[code] || fallback;
}

// ─── Google Icon ──────────────────────────────────────────────────────────────
function GoogleIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 18 18" style={{ flexShrink: 0 }}>
      <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/>
      <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"/>
      <path fill="#FBBC05" d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957C.347 6.175 0 7.55 0 9s.348 2.825.957 4.039l3.007-2.332z"/>
      <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58z"/>
    </svg>
  );
}

// ─── Field Error ──────────────────────────────────────────────────────────────
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

// ─── Floating destination card for left panel ─────────────────────────────────
function DestCard({ city, country, img, style, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={{
        position: 'absolute',
        background: 'rgba(6,16,28,0.72)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(56,189,248,0.14)',
        borderRadius: '0.875rem',
        padding: '10px 14px',
        display: 'flex', alignItems: 'center', gap: 10,
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        ...style,
      }}
    >
      <div style={{
        width: 38, height: 38, borderRadius: '0.625rem', overflow: 'hidden', flexShrink: 0,
        background: 'rgba(56,189,248,0.1)',
      }}>
        <img src={img} alt={city} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
      <div>
        <p style={{ margin: 0, fontSize: 12.5, fontWeight: 700, color: '#eaf2fb' }}>{city}</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 3, marginTop: 2 }}>
          <MapPin style={{ width: 9, height: 9, color: '#2dd4bf' }} />
          <span style={{ fontSize: 10.5, color: 'rgba(160,184,208,0.5)', fontWeight: 500 }}>{country}</span>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Input style fn ───────────────────────────────────────────────────────────
const inputStyle = (focused, hasError) => ({
  width: '100%',
  background: hasError ? 'rgba(248,113,113,0.04)' : 'rgba(4,13,24,0.55)',
  border: `1px solid ${
    hasError ? 'rgba(248,113,113,0.4)' :
    focused  ? 'rgba(56,189,248,0.45)' :
               'rgba(56,189,248,0.11)'
  }`,
  borderRadius: '0.75rem',
  padding: '12px 14px 12px 42px',
  color: '#eaf2fb',
  fontSize: 14,
  outline: 'none',
  fontFamily: 'inherit',
  transition: 'all 0.2s ease',
  boxShadow: focused
    ? '0 0 0 3px rgba(56,189,248,0.06)'
    : hasError
      ? '0 0 0 3px rgba(248,113,113,0.06)'
      : 'none',
  boxSizing: 'border-box',
});

const labelStyle = {
  fontSize: 10,
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.13em',
  color: 'rgba(160,184,208,0.45)',
  marginBottom: 6,
  display: 'block',
};

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register, loginWithGoogle } = useAuth();

  const from = location.state?.from || '/';

  const [isRegister, setIsRegister]       = useState(false);
  const [showPassword, setShowPassword]   = useState(false);
  const [loading, setLoading]             = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [focusedField, setFocusedField]   = useState(null);
  const [errors, setErrors]               = useState({});
  const [formData, setFormData]           = useState({ name: '', email: '', password: '', confirmPassword: '' });

  const validate = () => {
    const e = {};
    if (isRegister && !formData.name.trim()) e.name = 'Name is required';
    if (!formData.email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) e.email = 'Invalid email address';
    if (!formData.password) e.password = 'Password is required';
    else if (formData.password.length < 6) e.password = 'Minimum 6 characters';
    if (isRegister && formData.password !== formData.confirmPassword) e.confirmPassword = 'Passwords do not match';
    return e;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: undefined });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setLoading(true);
    try {
      if (isRegister) {
        await register(formData.email, formData.password, formData.name);
        toast.success('Account created! Welcome aboard.');
      } else {
        await login(formData.email, formData.password);
        toast.success('Welcome back!');
      }
      navigate(from, { replace: true });
    } catch (error) {
      const code = error.code;
      if (code === 'auth/user-not-found' || code === 'auth/invalid-credential')
        setErrors({ email: 'No account found with this email' });
      else if (code === 'auth/wrong-password')
        setErrors({ password: 'Incorrect password' });
      else if (code === 'auth/email-already-in-use')
        setErrors({ email: 'Email already registered' });
      else toast.error(getAuthErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    try {
      await loginWithGoogle();
      toast.success('Signed in with Google!');
      navigate(from, { replace: true });
    } catch (error) {
      if (error.code !== 'auth/popup-closed-by-user') {
        toast.error(getAuthErrorMessage(error));
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  const toggleMode = () => {
    setIsRegister(!isRegister);
    setErrors({});
    setFormData({ name: '', email: '', password: '', confirmPassword: '' });
  };

  return (
    <>
      {/* ── Responsive styles injected once ── */}
      <style>{`
        .login-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          min-height: 100vh;
          padding-top: 1px;
        }
        .login-left { display: flex; }
        .login-right {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem 2.5rem;
          min-height: calc(100vh - 60px);
        }
        .mobile-logo { display: none; }
        @media (max-width: 768px) {
          .login-grid {
            grid-template-columns: 1fr;
            padding-top: 0;
          }
          .login-left { display: none; }
          .login-right {
            padding: 1.75rem 1.25rem 3rem;
            align-items: flex-start;
            min-height: 100vh;
          }
          .mobile-logo { display: flex !important; }
        }
      `}</style>

      <div className="login-grid">

        {/* ═══ LEFT PANEL — atmospheric visual ═══ */}
        <div
          className="login-left"
          style={{
            position: 'relative', overflow: 'hidden',
            background: 'linear-gradient(160deg, #020d1a 0%, #041829 40%, #061e36 100%)',
          }}
        >
          {/* Deep mesh background */}
          <div style={{
            position: 'absolute', inset: 0,
            background: `
              radial-gradient(ellipse 70% 60% at 20% 80%, rgba(56,189,248,0.08) 0%, transparent 70%),
              radial-gradient(ellipse 50% 40% at 80% 20%, rgba(45,212,191,0.06) 0%, transparent 60%),
              radial-gradient(ellipse 40% 50% at 50% 50%, rgba(14,116,144,0.04) 0%, transparent 70%)
            `,
          }} />

          {/* Grid texture */}
          <div style={{
            position: 'absolute', inset: 0, opacity: 0.03,
            backgroundImage: `
              linear-gradient(rgba(56,189,248,1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(56,189,248,1) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }} />

          {/* Diagonal accent line */}
          <div style={{
            position: 'absolute', top: 0, right: 0,
            width: 1, height: '100%',
            background: 'linear-gradient(to bottom, transparent 0%, rgba(56,189,248,0.15) 30%, rgba(56,189,248,0.08) 70%, transparent 100%)',
          }} />

          {/* Big faint destination graphic */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{
              position: 'absolute',
              bottom: '8%', left: '50%', transform: 'translateX(-50%)',
              width: '85%', aspectRatio: '16/10',
              borderRadius: '1.25rem', overflow: 'hidden',
              border: '1px solid rgba(56,189,248,0.1)',
              boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80"
              alt="Travel"
              style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.55 }}
            />
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(to top, rgba(4,14,26,0.95) 0%, rgba(4,14,26,0.3) 50%, transparent 100%)',
            }} />
            {/* Caption inside image */}
            <div style={{ position: 'absolute', bottom: 18, left: 20 }}>
              <p style={{ margin: 0, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(56,189,248,0.6)', marginBottom: 5 }}>
                Featured Destination
              </p>
              <p style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#eaf2fb', letterSpacing: '-0.02em' }}>
                Swiss Alps, Switzerland
              </p>
            </div>
          </motion.div>

          {/* Floating destination cards — bottom half only, away from headline */}
          <DestCard
            city="Santorini"
            country="Greece"
            img="https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=120&q=80"
            delay={0.4}
            style={{ top: '52%', left: '6%' }}
          />
          <DestCard
            city="Kyoto"
            country="Japan"
            img="https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=120&q=80"
            delay={0.55}
            style={{ top: '62%', right: '6%' }}
          />
          <DestCard
            city="Amalfi"
            country="Italy"
            img="https://images.unsplash.com/photo-1533106497176-45ae19e68ba2?w=120&q=80"
            delay={0.7}
            style={{ top: '73%', left: '10%' }}
          />

          {/* Headline copy — top area, dark backdrop for readability */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.8 }}
            style={{
              position: 'absolute', top: '8%', left: '10%', right: '10%',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <div style={{
                width: 28, height: 28, borderRadius: '0.5rem',
                background: 'rgba(56,189,248,0.1)', border: '1px solid rgba(56,189,248,0.18)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Plane style={{ width: 14, height: 14, color: '#38bdf8' }} />
              </div>
              <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.18em', color: 'rgba(56,189,248,0.6)' }}>
                Voyage
              </span>
            </div>
            <h2 style={{
              fontSize: 'clamp(1.6rem, 2.5vw, 2.4rem)',
              fontWeight: 900,
              color: '#eaf2fb',
              margin: '0 0 0.75rem',
              letterSpacing: '-0.04em',
              lineHeight: 1.1,
              textShadow: '0 2px 24px rgba(4,12,24,0.9), 0 0 48px rgba(4,12,24,0.7)',
            }}>
              Your next<br />
              <span style={{ color: '#38bdf8', textShadow: '0 0 32px rgba(56,189,248,0.4)' }}>adventure</span> awaits
            </h2>
            <p style={{
              fontSize: 13.5, color: 'rgba(160,184,208,0.55)',
              margin: 0, lineHeight: 1.7, maxWidth: 260,
              textShadow: '0 1px 12px rgba(4,12,24,0.8)',
            }}>
              Discover extraordinary destinations curated to match your travel vibe.
            </p>
          </motion.div>

          {/* Bottom stat strip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            style={{
              position: 'absolute', bottom: 0, left: 0, right: 0,
              padding: '1.25rem 10%',
              display: 'flex', gap: '2rem',
              borderTop: '1px solid rgba(56,189,248,0.07)',
              background: 'rgba(4,12,22,0.5)',
              backdropFilter: 'blur(12px)',
            }}
          >
            {[['200+', 'Destinations'], ['50K+', 'Travelers'], ['4.9★', 'Rating']].map(([val, lbl]) => (
              <div key={lbl}>
                <p style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#38bdf8', letterSpacing: '-0.03em' }}>{val}</p>
                <p style={{ margin: 0, fontSize: 10, color: 'rgba(160,184,208,0.35)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{lbl}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* ═══ RIGHT PANEL — form ═══ */}
        <div className="login-right" style={{ background: 'rgba(4,11,22,0.98)' }}>
          <div style={{ width: '100%', maxWidth: 400 }}>

            {/* Mobile-only logo — hidden on desktop via CSS, shown on mobile since no navbar */}
            <motion.div
              className="mobile-logo"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              style={{ display: 'none', marginBottom: '1.75rem' }}
            >
              <VoyageLogo />
            </motion.div>

            {/* Heading */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
              style={{ marginBottom: '2rem' }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={isRegister ? 'reg-heading' : 'login-heading'}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                >
                  <h1 style={{
                    fontSize: 'clamp(1.65rem, 3vw, 2.1rem)',
                    fontWeight: 800, color: '#eaf2fb',
                    margin: '0 0 0.4rem', letterSpacing: '-0.045em',
                  }}>
                    {isRegister ? 'Create account' : 'Welcome back'}
                  </h1>
                  <p style={{ fontSize: 13.5, color: 'rgba(160,184,208,0.4)', margin: 0, lineHeight: 1.5 }}>
                    {isRegister
                      ? 'Join Voyage and start exploring the world'
                      : 'Sign in to access your trips and bookings'}
                  </p>
                </motion.div>
              </AnimatePresence>
            </motion.div>

            {/* Google first — primary social action */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.45 }}
            >
              <button
                type="button"
                onClick={handleGoogle}
                disabled={googleLoading}
                style={{
                  width: '100%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                  padding: '12px 20px',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(56,189,248,0.13)',
                  borderRadius: '0.875rem',
                  color: '#eaf2fb', fontSize: 14, fontWeight: 600,
                  fontFamily: 'inherit',
                  cursor: googleLoading ? 'not-allowed' : 'pointer',
                  opacity: googleLoading ? 0.6 : 1,
                  transition: 'all 0.2s ease',
                  marginBottom: '1.25rem',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.borderColor = 'rgba(56,189,248,0.28)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = 'rgba(56,189,248,0.13)'; }}
              >
                {googleLoading
                  ? <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
                      style={{ width: 17, height: 17, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.15)', borderTopColor: '#38bdf8' }} />
                  : <GoogleIcon />
                }
                Continue with Google
              </button>
            </motion.div>

            {/* Divider */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15 }}
              style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '1.25rem' }}
            >
              <div style={{ flex: 1, height: 1, background: 'linear-gradient(to right, transparent, rgba(56,189,248,0.1))' }} />
              <span style={{ fontSize: 10.5, fontWeight: 700, color: 'rgba(160,184,208,0.25)', textTransform: 'uppercase', letterSpacing: '0.14em' }}>or</span>
              <div style={{ flex: 1, height: 1, background: 'linear-gradient(to left, transparent, rgba(56,189,248,0.1))' }} />
            </motion.div>

            {/* Form card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
              style={{
                background: 'rgba(10,22,38,0.6)',
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
                border: '1px solid rgba(56,189,248,0.09)',
                borderRadius: '1.25rem',
                padding: 'clamp(1.25rem, 3vw, 1.75rem)',
                boxShadow: '0 12px 40px rgba(0,0,0,0.3)',
              }}
            >
              <form onSubmit={handleSubmit} noValidate>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                  {/* Name (register only) */}
                  <AnimatePresence>
                    {isRegister && (
                      <motion.div
                        key="name"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.22 }}
                        style={{ overflow: 'hidden' }}
                      >
                        <label style={labelStyle}>Full Name</label>
                        <div style={{ position: 'relative' }}>
                          <User style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', width: 14, height: 14, color: focusedField === 'name' ? '#38bdf8' : 'rgba(160,184,208,0.3)', transition: 'color 0.2s', pointerEvents: 'none' }} />
                          <input type="text" name="name" value={formData.name} onChange={handleChange}
                            onFocus={() => setFocusedField('name')} onBlur={() => setFocusedField(null)}
                            placeholder="Your full name" style={inputStyle(focusedField === 'name', errors.name)} />
                        </div>
                        <FieldError error={errors.name} />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Email */}
                  <div>
                    <label style={labelStyle}>Email Address</label>
                    <div style={{ position: 'relative' }}>
                      <Mail style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', width: 14, height: 14, color: focusedField === 'email' ? '#38bdf8' : 'rgba(160,184,208,0.3)', transition: 'color 0.2s', pointerEvents: 'none' }} />
                      <input type="email" name="email" value={formData.email} onChange={handleChange}
                        onFocus={() => setFocusedField('email')} onBlur={() => setFocusedField(null)}
                        placeholder="you@example.com" style={inputStyle(focusedField === 'email', errors.email)} />
                    </div>
                    <FieldError error={errors.email} />
                  </div>

                  {/* Password */}
                  <div>
                    <label style={labelStyle}>Password</label>
                    <div style={{ position: 'relative' }}>
                      <Lock style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', width: 14, height: 14, color: focusedField === 'password' ? '#38bdf8' : 'rgba(160,184,208,0.3)', transition: 'color 0.2s', pointerEvents: 'none' }} />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password" value={formData.password} onChange={handleChange}
                        onFocus={() => setFocusedField('password')} onBlur={() => setFocusedField(null)}
                        placeholder={isRegister ? 'Min 6 characters' : 'Your password'}
                        style={{ ...inputStyle(focusedField === 'password', errors.password), paddingRight: 42 }}
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)}
                        style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: 2, color: 'rgba(160,184,208,0.35)', transition: 'color 0.2s' }}
                        onMouseEnter={e => (e.currentTarget.style.color = '#38bdf8')}
                        onMouseLeave={e => (e.currentTarget.style.color = 'rgba(160,184,208,0.35)')}>
                        {showPassword ? <EyeOff style={{ width: 14, height: 14 }} /> : <Eye style={{ width: 14, height: 14 }} />}
                      </button>
                    </div>
                    <FieldError error={errors.password} />
                  </div>

                  {/* Confirm Password (register only) */}
                  <AnimatePresence>
                    {isRegister && (
                      <motion.div
                        key="confirm"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.22 }}
                        style={{ overflow: 'hidden' }}
                      >
                        <label style={labelStyle}>Confirm Password</label>
                        <div style={{ position: 'relative' }}>
                          <Lock style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', width: 14, height: 14, color: focusedField === 'confirmPassword' ? '#38bdf8' : 'rgba(160,184,208,0.3)', transition: 'color 0.2s', pointerEvents: 'none' }} />
                          <input type={showPassword ? 'text' : 'password'}
                            name="confirmPassword" value={formData.confirmPassword} onChange={handleChange}
                            onFocus={() => setFocusedField('confirmPassword')} onBlur={() => setFocusedField(null)}
                            placeholder="Re-enter your password"
                            style={inputStyle(focusedField === 'confirmPassword', errors.confirmPassword)} />
                        </div>
                        <FieldError error={errors.confirmPassword} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Submit */}
                <div style={{ marginTop: '1.4rem' }}>
                  <ElectricButton type="submit" fullWidth size="lg" loading={loading}>
                    {isRegister ? 'Create Account' : 'Sign In'}
                    <ArrowRight style={{ width: 15, height: 15 }} />
                  </ElectricButton>
                </div>
              </form>
            </motion.div>

            {/* Toggle mode */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
              style={{ textAlign: 'center', marginTop: '1.25rem', marginBottom: 0, fontSize: 13, color: 'rgba(160,184,208,0.4)' }}
            >
              {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button
                type="button"
                onClick={toggleMode}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: '#38bdf8', fontWeight: 700, fontSize: 13, fontFamily: 'inherit',
                  padding: 0, transition: 'color 0.2s',
                }}
                onMouseEnter={e => (e.currentTarget.style.color = '#2dd4bf')}
                onMouseLeave={e => (e.currentTarget.style.color = '#38bdf8')}
              >
                {isRegister ? 'Sign in' : 'Create account'}
              </button>
            </motion.p>

          </div>
        </div>
      </div>
    </>
  );
}