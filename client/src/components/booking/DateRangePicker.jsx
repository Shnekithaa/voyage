import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAYS   = ['Su','Mo','Tu','We','Th','Fr','Sa'];

function getDaysInMonth(year, month) { return new Date(year, month + 1, 0).getDate(); }
function getFirstDay(year, month)    { return new Date(year, month, 1).getDay(); }

function isSameDay(a, b) {
  if (!a || !b) return false;
  return a.getFullYear() === b.getFullYear()
    && a.getMonth() === b.getMonth()
    && a.getDate()   === b.getDate();
}
function isBetween(d, start, end) {
  if (!d || !start || !end) return false;
  return d > start && d < end;
}
export function formatDate(d) {
  if (!d) return '';
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function DateRangePicker({ checkIn, checkOut, onChange }) {
  const today    = new Date(); today.setHours(0,0,0,0);
  const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1);

  const MAX_NIGHTS = 21;

  const [viewDate, setViewDate] = useState(checkIn || tomorrow);
  const [hovered,  setHovered]  = useState(null);
  const [dateError, setDateError] = useState('');

  const year       = viewDate.getFullYear();
  const month      = viewDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay   = getFirstDay(year, month);

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1));

  const handleDayClick = (d) => {
    if (d < tomorrow) return;
    setDateError('');
    if (!checkIn || (checkIn && checkOut)) {
      onChange({ checkIn: d, checkOut: null });
    } else {
      if (d <= checkIn) {
        onChange({ checkIn: d, checkOut: null });
      } else {
        const nights = Math.ceil((d - checkIn) / (1000 * 60 * 60 * 24));
        if (nights > MAX_NIGHTS) {
          setDateError(`Stay cannot exceed ${MAX_NIGHTS} days. You selected ${nights} days.`);
          return;
        }
        onChange({ checkIn, checkOut: d });
      }
    }
  };

  const rangeEnd = hovered && checkIn && !checkOut ? hovered : checkOut;

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));

  return (
    <div style={{
      background: 'rgba(6,14,26,0.98)',
      border: '1px solid rgba(56,189,248,0.18)',
      borderRadius: '1.25rem',
      padding: '1.5rem',
      boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(56,189,248,0.06)',
      backdropFilter: 'blur(24px)',
    }}>

      {/* Selected range chips */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem' }}>
        {[
          { label: 'CHECK-IN',  value: checkIn,  active: !checkIn || (!!checkIn && !checkOut) },
          { label: 'CHECK-OUT', value: checkOut, active: !!checkIn && !checkOut },
        ].map(({ label, value, active }) => (
          <div key={label} style={{
            flex: 1, padding: '0.75rem 1rem',
            background: active ? 'rgba(56,189,248,0.07)' : 'rgba(255,255,255,0.02)',
            border: `1px solid ${active ? 'rgba(56,189,248,0.35)' : 'rgba(56,189,248,0.08)'}`,
            borderRadius: '0.75rem',
            transition: 'all 0.25s ease',
          }}>
            <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.14em', color: 'rgba(56,189,248,0.6)', margin: '0 0 4px' }}>{label}</p>
            <p style={{ fontSize: 13, fontWeight: 600, color: value ? '#eaf2fb' : 'rgba(160,184,208,0.3)', margin: 0 }}>
              {value ? formatDate(value) : 'Select date'}
            </p>
          </div>
        ))}
      </div>

      {/* Month navigation */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        {[prevMonth, nextMonth].map((fn, idx) => (
          <button
            key={idx}
            type="button"
            onClick={fn}
            style={{
              background: 'rgba(56,189,248,0.06)', border: '1px solid rgba(56,189,248,0.12)',
              borderRadius: '0.5rem', width: 32, height: 32,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: '#38bdf8', transition: 'background 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(56,189,248,0.14)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(56,189,248,0.06)')}
          >
            {idx === 0 ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
          </button>
        ))}
        {/* month label sits between — re-order with flex */}
        <span style={{
          position: 'absolute', left: '50%', transform: 'translateX(-50%)',
          fontSize: 14, fontWeight: 700, color: '#eaf2fb', letterSpacing: '-0.01em',
          pointerEvents: 'none',
        }}>
          {MONTHS[month]} {year}
        </span>
      </div>

      {/* Day-of-week headers */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: '0.5rem' }}>
        {DAYS.map(d => (
          <div key={d} style={{ textAlign: 'center', fontSize: 10, fontWeight: 700, color: 'rgba(160,184,208,0.35)', letterSpacing: '0.08em', padding: '4px 0' }}>
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px' }}>
        {cells.map((d, i) => {
          if (!d) return <div key={`empty-${i}`} />;
          const isPast  = d < tomorrow;
          const isStart = isSameDay(d, checkIn);
          const isEnd   = isSameDay(d, checkOut);
          const inRange = checkIn && rangeEnd && isBetween(d, checkIn, rangeEnd);
          const isToday = isSameDay(d, today);
          const isHov   = isSameDay(d, hovered);

          let bg     = 'transparent';
          let color  = isPast ? 'rgba(160,184,208,0.2)' : 'rgba(160,184,208,0.75)';
          let border = '1px solid transparent';

          if      (isStart || isEnd) { bg = '#38bdf8'; color = '#040d18'; border = '1px solid #38bdf8'; }
          else if (inRange)          { bg = 'rgba(56,189,248,0.1)'; color = '#eaf2fb'; border = '1px solid rgba(56,189,248,0.08)'; }
          else if (isHov && !isPast) { bg = 'rgba(56,189,248,0.07)'; color = '#38bdf8'; border = '1px solid rgba(56,189,248,0.2)'; }

          return (
            <button
              type="button"
              key={d.toISOString()}
              onClick={() => handleDayClick(d)}
              onMouseEnter={() => setHovered(d)}
              onMouseLeave={() => setHovered(null)}
              disabled={isPast}
              style={{
                background: bg, color, border,
                borderRadius: '0.5rem',
                padding: '7px 4px',
                fontSize: 12.5,
                fontWeight: isStart || isEnd ? 700 : 500,
                cursor: isPast ? 'not-allowed' : 'pointer',
                transition: 'all 0.15s ease',
                position: 'relative',
                outline: 'none',
              }}
            >
              {d.getDate()}
              {isToday && !isStart && !isEnd && (
                <span style={{
                  position: 'absolute', bottom: 2, left: '50%',
                  transform: 'translateX(-50%)',
                  width: 3, height: 3, borderRadius: '50%',
                  background: '#38bdf8', display: 'block',
                }} />
              )}
            </button>
          );
        })}
      </div>

      <AnimatePresence>
        {checkIn && !checkOut && !dateError && (
          <motion.p
            initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            style={{ textAlign: 'center', marginTop: '1rem', fontSize: 12, color: 'rgba(56,189,248,0.55)', fontStyle: 'italic', marginBottom: 0 }}
          >
            Now select your check-out date
          </motion.p>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {dateError && (
          <motion.p
            initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            style={{ textAlign: 'center', marginTop: '1rem', fontSize: 12, color: '#f87171', fontWeight: 600, marginBottom: 0 }}
          >
            ⚠ {dateError}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}