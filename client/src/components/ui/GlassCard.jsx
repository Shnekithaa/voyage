import { motion } from 'framer-motion';

export default function GlassCard({
  children,
  className = '',
  hover = true,
  glow = false,
  onClick,
  delay = 0,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      whileHover={
        hover
          ? { y: -6, transition: { duration: 0.25, ease: 'easeOut' } }
          : {}
      }
      onClick={onClick}
      className={[
        'glass-card relative overflow-hidden rounded-2xl transition-all duration-300 ease-out',
        hover ? 'cursor-pointer' : '',
        glow ? 'glow-blue' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {/* Top edge highlight */}
      <div
        className="absolute top-0 left-[10%] right-[10%] h-[1px] pointer-events-none"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(56, 189, 248, 0.15), transparent)',
        }}
      />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}