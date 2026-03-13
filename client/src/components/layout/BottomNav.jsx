import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Compass, Luggage, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { path: '/', icon: Home, label: 'Home' },
  { path: '/discover', icon: Compass, label: 'Discover' },
  { path: '/bookings', icon: Luggage, label: 'My Trips' },
  { path: '/account', icon: User, label: 'Account' },
];

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const isActive = (path) => {
    if (path === '/account') return location.pathname === '/login' || location.pathname === '/account';
    return location.pathname === path;
  };

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden pb-[env(safe-area-inset-bottom)]"
    >
      <div className="mx-3 mb-3">
        <div className="glass-nav rounded-2xl px-2 py-2 flex items-center justify-around">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <motion.button
                key={item.path}
                onClick={() => {
                  if (item.path === '/account') {
                    navigate(user ? '/bookings' : '/login');
                    return;
                  }
                  navigate(item.path);
                }}
                whileTap={{ scale: 0.9 }}
                className="relative flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all duration-300"
                style={{
                  color: active ? 'var(--color-electric-blue)' : 'var(--color-text-muted)',
                  background: active ? 'rgba(56, 189, 248, 0.08)' : 'transparent',
                }}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px] font-medium">{item.label}</span>
                {active && (
                  <motion.div
                    layoutId="bottomNavIndicator"
                    className="absolute bottom-0 w-8 h-0.5 rounded-full"
                    style={{ background: 'var(--color-electric-blue)' }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}