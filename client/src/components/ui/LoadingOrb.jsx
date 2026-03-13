import { motion } from 'framer-motion';

export default function LoadingOrb({ message = 'Finding your vibe...' }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '7rem 0' }}>

      {/* Orb cluster */}
      <div style={{ position: 'relative', width: 120, height: 120, marginBottom: '2.5rem' }}>
        {/* Outer pulse */}
        <motion.div
          animate={{ scale: [1, 1.6, 1], opacity: [0.15, 0.3, 0.15] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
          style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'rgba(56,189,248,0.2)', filter: 'blur(16px)' }}
        />
        {/* Mid ring */}
        <motion.div
          animate={{ scale: [1.2, 0.85, 1.2], opacity: [0.3, 0.55, 0.3] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
          style={{ position: 'absolute', inset: 16, borderRadius: '50%', background: 'rgba(45,212,191,0.25)', filter: 'blur(10px)' }}
        />
        {/* Inner glow */}
        <motion.div
          animate={{ scale: [0.9, 1.2, 0.9], opacity: [0.5, 0.9, 0.5] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
          style={{ position: 'absolute', inset: 32, borderRadius: '50%', background: 'rgba(56,189,248,0.4)', filter: 'blur(6px)' }}
        />
        {/* Core */}
        <motion.div
          animate={{ scale: [1, 0.82, 1] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute', inset: 44,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #38bdf8, #2dd4bf)',
            boxShadow: '0 0 20px rgba(56,189,248,0.6)',
          }}
        />
        {/* Orbit dot */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          style={{ position: 'absolute', inset: 10 }}
        >
          <div style={{
            width: 8, height: 8, borderRadius: '50%',
            background: '#2dd4bf',
            boxShadow: '0 0 8px rgba(45,212,191,0.8)',
            position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
          }} />
        </motion.div>
      </div>

      {/* Message */}
      <motion.p
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        style={{ fontSize: 15, fontWeight: 500, color: 'rgba(160,184,208,0.85)', marginBottom: '1rem', fontFamily: 'var(--font-sans)' }}
      >
        {message}
      </motion.p>

      {/* Bouncing dots */}
      <div style={{ display: 'flex', gap: '0.4rem' }}>
        {[0, 1, 2].map(i => (
          <motion.div
            key={i}
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 0.65, repeat: Infinity, ease: 'easeInOut', delay: i * 0.14 }}
            style={{ width: 7, height: 7, borderRadius: '50%', background: i === 1 ? '#2dd4bf' : '#38bdf8', opacity: 0.8 }}
          />
        ))}
      </div>
    </div>
  );
}