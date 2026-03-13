import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronDown, ChevronUp, Bed, Maximize2, Users, CheckCircle2 } from 'lucide-react';
import { useBooking } from '../../context/BookingContext';
import AmenityTag from './AmenityTag';
import ElectricButton from '../ui/ElectricButton';

// ─── Inject styles once ───────────────────────────────────────────────────────
const STYLE_ID = 'hotel-card-styles';
if (typeof document !== 'undefined' && !document.getElementById(STYLE_ID)) {
  const s = document.createElement('style');
  s.id = STYLE_ID;
  s.textContent = `
    /* ── Desktop: image left, info right ── */
    .hotel-card-layout {
      display: grid;
      grid-template-columns: 300px 1fr;
    }
    .hotel-card-image {
      position: relative;
      overflow: hidden;
      min-height: 220px;
    }
    .hotel-card-info {
      padding: 1.5rem 1.75rem;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .hotel-card-top {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 1rem;
      margin-bottom: 0.875rem;
    }
    .hotel-card-price-block {
      text-align: right;
      flex-shrink: 0;
    }
    .hotel-room-row {
      display: grid;
      grid-template-columns: 1fr auto;
      align-items: center;
      gap: 1.5rem;
      padding: 1.25rem 1.5rem;
      border-radius: 1rem;
      cursor: pointer;
      transition: all 0.22s ease;
    }
    .hotel-room-actions {
      display: flex;
      align-items: center;
      gap: 1.25rem;
      flex-shrink: 0;
    }
    .hotel-room-price {
      text-align: right;
    }

    /* ── Mobile ── */
    @media (max-width: 640px) {
      /* Stack image on top, info below */
      .hotel-card-layout {
        grid-template-columns: 1fr !important;
      }
      .hotel-card-image {
        min-height: 190px !important;
        max-height: 210px;
      }
      /* Remove right-fade gradient on mobile (not needed stacked) */
      .hotel-card-image .right-fade {
        display: none;
      }
      .hotel-card-info {
        padding: 1rem 1rem 1.1rem !important;
        gap: 0.75rem;
      }
      .hotel-card-top {
        margin-bottom: 0.5rem !important;
        align-items: center;
      }
      .hotel-name {
        font-size: 1.05rem !important;
      }
      .hotel-card-price-block p:nth-child(2) span {
        font-size: 1.25rem !important;
      }
      .hotel-description {
        font-size: 12.5px !important;
        -webkit-line-clamp: 2;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        overflow: hidden;
        margin-bottom: 0.625rem !important;
      }
      .hotel-amenities {
        margin-bottom: 0.75rem !important;
      }

      /* Rooms panel */
      .hotel-rooms-panel {
        padding: 1rem !important;
      }
      .hotel-rooms-title {
        font-size: 13.5px !important;
        margin-bottom: 1rem !important;
      }
      /* Room row: stack info + price-button vertically */
      .hotel-room-row {
        grid-template-columns: 1fr !important;
        gap: 0.875rem !important;
        padding: 1rem !important;
        border-radius: 0.875rem !important;
      }
      .hotel-room-name {
        font-size: 13.5px !important;
      }
      .hotel-room-desc {
        font-size: 12px !important;
      }
      .hotel-room-meta span {
        font-size: 11px !important;
      }
      /* Actions: price left, button right */
      .hotel-room-actions {
        justify-content: space-between;
        width: 100%;
      }
      .hotel-room-price p:first-child {
        font-size: 1.2rem !important;
      }
    }
  `;
  document.head.appendChild(s);
}

export default function HotelCard({ hotel, index }) {
  const navigate = useNavigate();
  const { dispatch } = useBooking();
  const [expanded, setExpanded] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);

  const handleBook = (room) => {
    dispatch({ type: 'SET_HOTEL', payload: hotel });
    dispatch({ type: 'SET_ROOM', payload: room });
    navigate('/checkout');
  };

  const amenityList = hotel.amenityList || [];
  const lowestPrice = hotel.roomTypes?.[0]?.pricePerNight;

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={{
        background: 'rgba(13,31,51,0.7)', backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        border: '1px solid rgba(56,189,248,0.1)', borderRadius: '1.25rem',
        overflow: 'hidden',
        boxShadow: '0 8px 32px rgba(0,0,0,0.22)',
        transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(45,212,191,0.22)'; e.currentTarget.style.boxShadow = '0 16px 48px rgba(14,116,144,0.15)'; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(56,189,248,0.1)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.22)'; }}
    >
      {/* ── Hotel header: image + info ── */}
      <div className="hotel-card-layout">

        {/* Image */}
        <div className="hotel-card-image">
          <motion.img
            src={hotel.heroImage} alt={hotel.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          />
          {/* Right fade (desktop only) */}
          <div className="right-fade" style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: 80, background: 'linear-gradient(to right, transparent, rgba(13,31,51,0.85))', pointerEvents: 'none' }} />
          {/* Bottom fade */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '40%', background: 'linear-gradient(to top, rgba(13,31,51,0.7), transparent)', pointerEvents: 'none' }} />
          {/* Vibe tag */}
          {hotel.vibeTag && (
            <div style={{ position: 'absolute', top: 13, left: 13, display: 'inline-flex', alignItems: 'center', gap: 5, padding: '5px 11px', borderRadius: 999, background: 'rgba(6,14,24,0.75)', backdropFilter: 'blur(12px)', border: '1px solid rgba(56,189,248,0.2)', fontSize: 11, fontWeight: 600, color: '#38bdf8' }}>
              {hotel.vibeTag}
            </div>
          )}
        </div>

        {/* Info panel */}
        <div className="hotel-card-info">

          {/* Top: name + price */}
          <div className="hotel-card-top">
            <div style={{ flex: 1, minWidth: 0 }}>
              <h3
                className="hotel-name"
                style={{ fontSize: '1.2rem', fontWeight: 700, color: '#eaf2fb', margin: '0 0 0.375rem', letterSpacing: '-0.02em', lineHeight: 1.2 }}
              >
                {hotel.name}
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', gap: 2 }}>
                  {[...Array(hotel.starRating)].map((_, i) => (
                    <Star key={i} style={{ width: 13, height: 13, color: '#fbbf24', fill: '#fbbf24' }} />
                  ))}
                </div>
                <span style={{ fontSize: 12, color: 'rgba(160,184,208,0.65)', fontWeight: 500 }}>
                  {hotel.userRating?.average} · {hotel.userRating?.count} reviews
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="hotel-card-price-block">
              <p style={{ fontSize: 10.5, color: 'rgba(107,135,163,0.8)', margin: '0 0 2px' }}>From</p>
              <p style={{ margin: 0, lineHeight: 1 }}>
                <span style={{ fontSize: '1.5rem', fontWeight: 700, color: '#38bdf8', letterSpacing: '-0.025em' }}>${lowestPrice}</span>
              </p>
              <p style={{ fontSize: 10.5, color: 'rgba(107,135,163,0.7)', margin: '2px 0 0' }}>/night</p>
            </div>
          </div>

          {/* Description */}
          <p
            className="hotel-description"
            style={{ fontSize: 13, lineHeight: 1.72, color: 'rgba(160,184,208,0.7)', margin: '0 0 1rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
          >
            {hotel.description}
          </p>

          {/* Amenities */}
          <div className="hotel-amenities" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem', marginBottom: '1.125rem' }}>
            {amenityList.slice(0, 5).map(a => <AmenityTag key={a} name={a} />)}
            {amenityList.length > 5 && (
              <span style={{ fontSize: 11, color: 'rgba(107,135,163,0.7)', padding: '4px 8px', alignSelf: 'center' }}>
                +{amenityList.length - 5} more
              </span>
            )}
          </div>

          {/* Expand toggle */}
          <button
            onClick={() => setExpanded(!expanded)}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: 13, fontWeight: 600, color: '#38bdf8', fontFamily: 'var(--font-sans)', transition: 'color 0.2s ease' }}
            onMouseEnter={e => e.currentTarget.style.color = '#7dd3fc'}
            onMouseLeave={e => e.currentTarget.style.color = '#38bdf8'}
          >
            {expanded ? 'Hide' : 'View'} Room Types
            {expanded ? <ChevronUp style={{ width: 14, height: 14 }} /> : <ChevronDown style={{ width: 14, height: 14 }} />}
          </button>
        </div>
      </div>

      {/* ── Expandable rooms ── */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{ overflow: 'hidden' }}
          >
            <div
              className="hotel-rooms-panel"
              style={{ borderTop: '1px solid rgba(56,189,248,0.1)', padding: '1.75rem' }}
            >
              <h4
                className="hotel-rooms-title"
                style={{ fontSize: 15, fontWeight: 700, color: '#eaf2fb', margin: '0 0 1.25rem', letterSpacing: '-0.01em' }}
              >
                Choose Your Room
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                {hotel.roomTypes?.map((room, i) => {
                  const isSelected = selectedRoom === room.name;
                  return (
                    <motion.div
                      key={room.name}
                      className="hotel-room-row"
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.08, duration: 0.4 }}
                      onClick={() => setSelectedRoom(room.name)}
                      style={{
                        background: isSelected ? 'rgba(56,189,248,0.06)' : 'rgba(6,14,24,0.4)',
                        border: `1px solid ${isSelected ? 'rgba(56,189,248,0.3)' : 'rgba(56,189,248,0.08)'}`,
                        boxShadow: isSelected ? '0 4px 20px rgba(8,145,178,0.1)' : 'none',
                      }}
                      onMouseEnter={e => { if (!isSelected) { e.currentTarget.style.borderColor = 'rgba(56,189,248,0.2)'; e.currentTarget.style.background = 'rgba(6,14,24,0.6)'; }}}
                      onMouseLeave={e => { if (!isSelected) { e.currentTarget.style.borderColor = 'rgba(56,189,248,0.08)'; e.currentTarget.style.background = 'rgba(6,14,24,0.4)'; }}}
                    >
                      {/* Room info */}
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '0.375rem', flexWrap: 'wrap' }}>
                          <h5 className="hotel-room-name" style={{ fontSize: 15, fontWeight: 700, color: '#eaf2fb', margin: 0, letterSpacing: '-0.01em' }}>
                            {room.name}
                          </h5>
                          <span style={{ fontSize: 10.5, fontWeight: 600, padding: '2px 9px', borderRadius: '0.375rem', background: 'rgba(56,189,248,0.08)', border: '1px solid rgba(56,189,248,0.15)', color: 'rgba(56,189,248,0.85)' }}>
                            {room.sizeSqFt} sq ft
                          </span>
                          {isSelected && (
                            <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 10.5, fontWeight: 600, color: '#2dd4bf' }}>
                              <CheckCircle2 style={{ width: 13, height: 13 }} /> Selected
                            </motion.span>
                          )}
                        </div>
                        <p className="hotel-room-desc" style={{ fontSize: 12.5, color: 'rgba(160,184,208,0.65)', margin: '0 0 0.625rem', lineHeight: 1.6 }}>
                          {room.description}
                        </p>
                        <div className="hotel-room-meta" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
                          {[
                            { icon: Bed,       text: room.bedConfiguration },
                            { icon: Users,     text: `Max ${room.maxGuests} guests` },
                            { icon: Maximize2, text: `${room.sizeSqFt} ft²` },
                          ].map(({ icon: Icon, text }) => (
                            <span key={text} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11.5, color: 'rgba(107,135,163,0.8)', fontWeight: 500 }}>
                              <Icon style={{ width: 12, height: 12, color: '#38bdf8' }} /> {text}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Price + Book */}
                      <div className="hotel-room-actions">
                        <div className="hotel-room-price">
                          <p style={{ fontSize: '1.4rem', fontWeight: 700, color: '#38bdf8', margin: 0, letterSpacing: '-0.025em', lineHeight: 1 }}>
                            ${room.pricePerNight}
                          </p>
                          <p style={{ fontSize: 10.5, color: 'rgba(107,135,163,0.7)', margin: '3px 0 0' }}>/night</p>
                        </div>
                        <ElectricButton
                          size="sm"
                          onClick={e => { e.stopPropagation(); handleBook(room); }}
                        >
                          Book Now
                        </ElectricButton>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}