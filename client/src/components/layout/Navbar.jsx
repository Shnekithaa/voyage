import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, User, Luggage } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import VoyageLogo from './VoyageLogo';
import toast from 'react-hot-toast';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setShowMenu(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const links = [
    { path: '/', label: 'Home' },
    { path: '/discover', label: 'Discover' },
    { path: '/bookings', label: 'My Trips' },
  ];

  const handleLogout = async () => {
    await logout();
    setShowMenu(false);
    toast.success('Signed out');
    navigate('/');
  };

  return (
    <motion.nav
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="fixed top-0 left-0 right-0 z-50 hidden md:block"
    >
      <div className="w-full pt-4" style={{ paddingLeft: 32, paddingRight: 32 }}>
        <div
          className="glass-nav bg-grain flex items-center justify-between rounded-2xl"
          style={{ padding: '12px 24px' }}
        >
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center flex-shrink-0 transition-transform hover:scale-[1.02]"
          >
            <VoyageLogo />
          </Link>

          {/* Nav links + Auth */}
          <div className="flex items-center" style={{ gap: 4 }}>
            {links.map((item) => {
              const isActive = item.path === '/bookings'
                ? location.pathname === '/bookings'
                : location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className="relative flex items-center justify-center transition-all duration-300"
                  style={{
                    padding: '8px 18px',
                    borderRadius: 12,
                    fontSize: 14,
                    fontWeight: 500,
                    letterSpacing: '0.01em',
                    color: isActive
                      ? 'var(--color-electric-blue)'
                      : 'var(--color-text-secondary)',
                    textDecoration: 'none',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) e.currentTarget.style.color = 'var(--color-text-primary)';
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.currentTarget.style.color = 'var(--color-text-secondary)';
                  }}
                >
                  {isActive && (
                    <motion.div
                      layoutId="nav-pill"
                      className="absolute inset-0"
                      style={{
                        borderRadius: 12,
                        background: 'rgba(56, 189, 248, 0.08)',
                        border: '1px solid rgba(56, 189, 248, 0.2)',
                      }}
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span style={{ position: 'relative', zIndex: 1 }}>{item.label}</span>
                </Link>
              );
            })}

            {/* Auth section */}
            <div style={{ marginLeft: 8 }}>
              {user ? (
                <div ref={menuRef} style={{ position: 'relative' }}>
                  <button
                    type="button"
                    onClick={() => setShowMenu(!showMenu)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 8,
                      background: 'rgba(56,189,248,0.06)',
                      border: '1px solid rgba(56,189,248,0.15)',
                      borderRadius: 12, padding: '6px 14px 6px 8px',
                      cursor: 'pointer', transition: 'all 0.2s',
                      color: '#eaf2fb', fontFamily: 'inherit',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(56,189,248,0.35)')}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(56,189,248,0.15)')}
                  >
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt=""
                        style={{ width: 26, height: 26, borderRadius: '50%', objectFit: 'cover' }}
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <span style={{
                        width: 26, height: 26, borderRadius: '50%',
                        background: 'linear-gradient(135deg, #0891b2, #2dd4bf)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 12, fontWeight: 700, color: '#fff',
                      }}>
                        {(user.displayName || user.email || '?')[0].toUpperCase()}
                      </span>
                    )}
                    <span style={{ fontSize: 13, fontWeight: 500, maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {user.displayName || user.email?.split('@')[0]}
                    </span>
                  </button>

                  <AnimatePresence>
                    {showMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        style={{
                          position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                          minWidth: 180, padding: 6, borderRadius: 14,
                          background: 'rgba(11,23,38,0.95)',
                          backdropFilter: 'blur(24px)',
                          border: '1px solid rgba(56,189,248,0.15)',
                          boxShadow: '0 16px 48px rgba(0,0,0,0.4)',
                          zIndex: 100,
                        }}
                      >
                        <button
                          type="button"
                          onClick={() => { setShowMenu(false); navigate('/bookings'); }}
                          style={{
                            width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                            padding: '10px 12px', borderRadius: 10,
                            background: 'none', border: 'none', cursor: 'pointer',
                            color: '#eaf2fb', fontSize: 13, fontWeight: 500,
                            fontFamily: 'inherit', transition: 'background 0.15s',
                          }}
                          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(56,189,248,0.08)')}
                          onMouseLeave={e => (e.currentTarget.style.background = 'none')}
                        >
                          <Luggage style={{ width: 15, height: 15, color: '#38bdf8' }} />
                          My Trips
                        </button>
                        <div style={{ height: 1, margin: '4px 8px', background: 'rgba(56,189,248,0.08)' }} />
                        <button
                          type="button"
                          onClick={handleLogout}
                          style={{
                            width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                            padding: '10px 12px', borderRadius: 10,
                            background: 'none', border: 'none', cursor: 'pointer',
                            color: '#f87171', fontSize: 13, fontWeight: 500,
                            fontFamily: 'inherit', transition: 'background 0.15s',
                          }}
                          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(248,113,113,0.06)')}
                          onMouseLeave={e => (e.currentTarget.style.background = 'none')}
                        >
                          <LogOut style={{ width: 15, height: 15 }} />
                          Sign Out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  to="/login"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    padding: '8px 18px', borderRadius: 12,
                    background: 'linear-gradient(135deg, #0891b2, #2dd4bf)',
                    color: '#fff', fontSize: 13.5, fontWeight: 600,
                    textDecoration: 'none', transition: 'all 0.25s',
                    boxShadow: '0 4px 16px rgba(8,145,178,0.3)',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 6px 24px rgba(8,145,178,0.45)')}
                  onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 4px 16px rgba(8,145,178,0.3)')}
                >
                  <User style={{ width: 14, height: 14 }} />
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}