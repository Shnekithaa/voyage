import { motion } from 'framer-motion';

const VARIANTS = {
  primary: {
    background: 'linear-gradient(135deg, #0891b2, #2dd4bf)',
    border: 'none',
    color: '#fff',
    boxShadow: '0 8px 28px rgba(8,145,178,0.35)',
    hoverShadow: '0 12px 36px rgba(8,145,178,0.5)',
  },
  secondary: {
    background: 'rgba(11,23,38,0.6)',
    border: '1px solid rgba(56,189,248,0.2)',
    color: '#eaf2fb',
    boxShadow: 'none',
    hoverShadow: '0 4px 20px rgba(56,189,248,0.1)',
  },
  ghost: {
    background: 'transparent',
    border: '1px solid rgba(56,189,248,0.15)',
    color: '#38bdf8',
    boxShadow: 'none',
    hoverShadow: 'none',
  },
  danger: {
    background: 'linear-gradient(135deg, #dc2626, #ef4444)',
    border: 'none',
    color: '#fff',
    boxShadow: '0 8px 24px rgba(220,38,38,0.3)',
    hoverShadow: '0 12px 32px rgba(220,38,38,0.45)',
  },
};

const SIZES = {
  sm: { padding: '7px 16px',  fontSize: 12.5, borderRadius: '0.6rem'  },
  md: { padding: '11px 22px', fontSize: 14,   borderRadius: '0.75rem' },
  lg: { padding: '13px 28px', fontSize: 15,   borderRadius: '0.875rem'},
  xl: { padding: '15px 36px', fontSize: 16,   borderRadius: '1rem'    },
};

export default function ElectricButton({
  children, onClick, variant = 'primary', size = 'md',
  disabled = false, loading = false, fullWidth = false, type = 'button',
}) {
  const v = VARIANTS[variant] || VARIANTS.primary;
  const s = SIZES[size] || SIZES.md;

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={!disabled && !loading ? { scale: 1.02, boxShadow: v.hoverShadow } : {}}
      whileTap={!disabled && !loading ? { scale: 0.97 } : {}}
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        background: v.background,
        border: v.border,
        borderRadius: s.borderRadius,
        padding: s.padding,
        fontSize: s.fontSize,
        fontWeight: 600,
        color: disabled ? 'rgba(160,184,208,0.35)' : v.color,
        boxShadow: disabled ? 'none' : v.boxShadow,
        cursor: disabled || loading ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        fontFamily: 'var(--font-sans)',
        letterSpacing: '0.01em',
        transition: 'background 0.25s ease, border-color 0.25s ease',
        width: fullWidth ? '100%' : undefined,
        backdropFilter: variant === 'secondary' ? 'blur(20px)' : undefined,
      }}
    >
      {loading ? (
        <>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
            style={{
              width: 15, height: 15, borderRadius: '50%',
              border: '2px solid rgba(255,255,255,0.2)',
              borderTopColor: '#fff',
            }}
          />
          <span>Processing…</span>
        </>
      ) : children}
    </motion.button>
  );
}