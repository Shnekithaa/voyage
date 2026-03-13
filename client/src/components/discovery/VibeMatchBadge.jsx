import { motion } from 'framer-motion';

export default function VibeMatchBadge({ percent }) {
  const getStyle = () => {
    if (percent >= 90) return { bg: 'rgba(34,197,94,0.15)',  border: 'rgba(34,197,94,0.35)',  color: '#86efac', dot: '#22c55e' };
    if (percent >= 80) return { bg: 'rgba(56,189,248,0.12)', border: 'rgba(56,189,248,0.35)', color: '#7dd3fc', dot: '#38bdf8' };
    if (percent >= 70) return { bg: 'rgba(251,191,36,0.12)', border: 'rgba(251,191,36,0.32)', color: '#fde68a', dot: '#fbbf24' };
    return               { bg: 'rgba(251,146,60,0.12)',  border: 'rgba(251,146,60,0.32)',  color: '#fdba74', dot: '#fb923c' };
  };

  const s = getStyle();

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.3 }}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 5,
        padding: '5px 11px', borderRadius: 999,
        background: s.bg,
        border: `1px solid ${s.border}`,
        backdropFilter: 'blur(12px)',
        boxShadow: '0 2px 12px rgba(0,0,0,0.25)',
      }}
    >
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: s.dot, display: 'inline-block', flexShrink: 0 }} />
      <span style={{ fontSize: 11, fontWeight: 700, color: s.color, letterSpacing: '0.03em', whiteSpace: 'nowrap' }}>
        {percent}% Match
      </span>
    </motion.div>
  );
}