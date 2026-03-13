import React from 'react';
import { motion } from 'framer-motion';

export default function VoyageLogo({ compact = false }) {
  return (
    <div className="flex items-center gap-3.5 select-none cursor-pointer group py-1.5">
      {/* Scenic Map Pin Icon - Scaled Down */}
      <div className="relative flex-shrink-0">
        <motion.div
          whileHover="hover"
          initial="rest"
          variants={{
            hover: { y: -2, scale: 1.05 },
            rest: { y: 0, scale: 1 }
          }}
          transition={{ type: 'spring', stiffness: 400, damping: 15 }}
          className="relative"
          // Reduced from 48px to 36px for a cleaner look
          style={{ width: 36, height: 36 }}
        >
          <svg
            viewBox="0 0 100 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="drop-shadow-md"
          >
            {/* The Pin Container */}
            <path
              d="M50 115C50 115 10 75 10 45C10 22.9086 27.9086 5 50 5C72.0914 5 90 22.9086 90 45C90 75 50 115 50 115Z"
              fill="#0f172a" 
              stroke="white"
              strokeWidth="4" // Slightly thicker relative to size for better visibility
            />
            
            <defs>
              <clipPath id="pinClipSmall">
                <path d="M50 115C50 115 10 75 10 45C10 22.9086 27.9086 5 50 5C72.0914 5 90 22.9086 90 45C90 75 50 115 50 115Z" />
              </clipPath>
              
              <linearGradient id="skyGradientSmall" x1="50" y1="5" x2="50" y2="75" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#f97316" />
                <stop offset="100%" stopColor="#fbbf24" />
              </linearGradient>
            </defs>

            <g clipPath="url(#pinClipSmall)">
              {/* Sky Background */}
              <rect x="0" y="0" width="100" height="120" fill="url(#skyGradientSmall)" />
              
              {/* The Sun */}
              <circle cx="42" cy="32" r="11" fill="white" />
              
              {/* Mountains */}
              <path d="M5 80L35 45L65 80H5Z" fill="#0ea5e9" />
              <path d="M35 80L70 38L105 80H35Z" fill="#0284c7" />
              
              {/* Ocean */}
              <rect x="0" y="80" width="100" height="40" fill="#075985" />
              
              {/* Palm Tree Silhouette (simplified for smaller size) */}
              <path d="M22 80Q20 62 14 58" stroke="#1e293b" strokeWidth="2.5" />
              <circle cx="14" cy="58" r="1.5" fill="#1e293b" />
            </g>
          </svg>
          
          
        </motion.div>
      </div>

      {/* Wordmark Section - Same Typography */}
      <div className="flex flex-col justify-center leading-none">
        <span
          className="font-black text-white"
          style={{ 
            fontSize: '24px', // Dropped slightly from 28px to match the smaller icon
            letterSpacing: '-0.04em',
            textShadow: '0 2px 8px rgba(0,0,0,0.3)' 
          }}
        >
          VOYAGE
        </span>
        {!compact && (
          <span
            className="font-bold uppercase tracking-[0.35em] mt-1"
            style={{
              fontSize: '8px',
              color: '#38bdf8', 
            }}
          >
            Mood Travel Studio
          </span>
        )}
      </div>
    </div>
  );
}