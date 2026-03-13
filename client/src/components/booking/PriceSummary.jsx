import { motion, AnimatePresence } from 'framer-motion';
import GlassCard from '../ui/GlassCard';

export default function PriceSummary({ hotel, room, nights, pricing }) {
  if (!room || !nights) return null;

  const totalBeforeTax = room.pricePerNight * nights;
  const taxAmount      = Math.round(totalBeforeTax * 0.12 * 100) / 100;
  const total          = Math.round((totalBeforeTax + taxAmount) * 100) / 100;

  const rowStyle = {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
  };
  const labelStyle = { fontSize: 13, color: 'rgba(160,184,208,0.6)' };
  const valueStyle = { fontSize: 13, color: '#eaf2fb', fontWeight: 500 };

  return (
    <GlassCard hover={false} glow className="p-6">

      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        marginBottom: '1.25rem', paddingBottom: '1rem',
        borderBottom: '1px solid rgba(56,189,248,0.07)',
      }}>
        <span style={{ fontSize: 16 }}>💰</span>
        <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#eaf2fb', margin: 0 }}>
          Price Summary
        </h3>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>

        {/* Hotel name */}
        <div style={rowStyle}>
          <span style={labelStyle}>{hotel?.name}</span>
        </div>

        {/* Room × nights */}
        <div style={rowStyle}>
          <span style={labelStyle}>
            {room.name} × {nights} night{nights > 1 ? 's' : ''}
          </span>
          <span style={{ ...valueStyle, color: 'rgba(160,184,208,0.8)' }}>
            ${room.pricePerNight} × {nights}
          </span>
        </div>

        {/* Subtotal */}
        <div style={rowStyle}>
          <span style={labelStyle}>Subtotal</span>
          <span style={valueStyle}>${totalBeforeTax.toFixed(2)}</span>
        </div>

        {/* Taxes */}
        <div style={rowStyle}>
          <span style={labelStyle}>Taxes & Fees (12%)</span>
          <span style={valueStyle}>${taxAmount.toFixed(2)}</span>
        </div>

        {/* Divider */}
        <div style={{ borderTop: '1px solid rgba(56,189,248,0.07)', margin: '0.25rem 0' }} />

        {/* Total */}
        <div style={{ ...rowStyle, alignItems: 'flex-end' }}>
          <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#eaf2fb' }}>Total</span>
          <motion.span
            key={total}
            initial={{ scale: 1.2, color: '#2dd4bf' }}
            animate={{ scale: 1,   color: '#38bdf8' }}
            transition={{ duration: 0.3 }}
            style={{ fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.04em', color: '#38bdf8' }}
          >
            ${total.toFixed(2)}
          </motion.span>
        </div>

      </div>
    </GlassCard>
  );
}