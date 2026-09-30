import React from 'react';
import { motion } from 'motion/react';
import { AlertTriangle, ShieldCheck } from 'lucide-react';

import { ThemeMode } from '../types';

interface VisualHangmanProps {
  mistakes: number;
  maxMistakes: number;
  isWon: boolean;
  isLost: boolean;
  theme?: ThemeMode;
}

export const VisualHangman: React.FC<VisualHangmanProps> = ({
  mistakes,
  maxMistakes,
  isWon,
  isLost,
  theme = 'dark'
}) => {
  const isDark = theme === 'dark';
  const remaining = Math.max(0, maxMistakes - mistakes);

  const characterStroke = isLost
    ? '#f43f5e'
    : isWon
    ? '#10b981'
    : isDark
    ? '#e2e8f0'
    : '#0f172a';

  const headFill = isDark ? '#1e293b' : '#f1f5f9';

  return (
    <div
      className={`flex flex-col items-center justify-center p-6 rounded-2xl border transition-colors relative overflow-hidden ${
        isDark
          ? 'bg-slate-900/60 border-slate-800/80 shadow-inner'
          : 'bg-white border-slate-200/90 shadow-xs'
      }`}
    >
      {/* Background ambient radial highlight */}
      <div
        className={`absolute inset-0 pointer-events-none transition-opacity duration-500 ${
          isLost
            ? isDark
              ? 'bg-rose-950/20'
              : 'bg-rose-100/30'
            : isWon
            ? isDark
              ? 'bg-emerald-950/20'
              : 'bg-emerald-100/30'
            : mistakes >= 4
            ? isDark
              ? 'bg-amber-950/15'
              : 'bg-amber-100/30'
            : 'bg-transparent'
        }`}
      />

      {/* Top Status Strip */}
      <div className="w-full flex items-center justify-between text-xs mb-3 z-10">
        <span
          className={`font-mono tracking-tight flex items-center gap-1.5 ${
            isDark ? 'text-slate-400' : 'text-slate-500'
          }`}
        >
          <span>Tries Left:</span>
          <span
            className={`font-bold tabular-nums text-sm ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}
          >
            {remaining} / {maxMistakes}
          </span>
        </span>

        {/* Life Nodes */}
        <div className="flex items-center gap-1">
          {Array.from({ length: maxMistakes }).map((_, index) => {
            const isUsed = index < mistakes;
            return (
              <span
                key={index}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  isUsed
                    ? isDark
                      ? 'bg-rose-500/30 border border-rose-500/50 scale-90'
                      : 'bg-rose-200 border border-rose-300 scale-90'
                    : isDark
                    ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]'
                    : 'bg-emerald-500 shadow-xs'
                }`}
                title={`Attempt ${index + 1}`}
              />
            );
          })}
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="relative w-64 h-64 flex items-center justify-center">
        <svg
          viewBox="0 0 250 280"
          className="w-full h-full overflow-visible drop-shadow-md select-none"
        >
          {/* Base Platform */}
          <line
            x1="20"
            y1="260"
            x2="230"
            y2="260"
            stroke="#475569"
            strokeWidth="8"
            strokeLinecap="round"
          />

          {/* Upright Post */}
          <line
            x1="70"
            y1="260"
            x2="70"
            y2="30"
            stroke="#64748b"
            strokeWidth="8"
            strokeLinecap="round"
          />

          {/* Top Beam */}
          <line
            x1="70"
            y1="30"
            x2="180"
            y2="30"
            stroke="#64748b"
            strokeWidth="8"
            strokeLinecap="round"
          />

          {/* Angle Brace */}
          <line
            x1="70"
            y1="75"
            x2="115"
            y2="30"
            stroke="#475569"
            strokeWidth="5"
            strokeLinecap="round"
          />

          {/* Rope */}
          <line
            x1="175"
            y1="30"
            x2="175"
            y2="75"
            stroke="#d97706"
            strokeWidth="3.5"
            strokeDasharray="2,2"
          />

          {/* Noose Loop (always visible or highlighted on step 1 of easy) */}
          <circle
            cx="175"
            cy="77"
            r="4"
            fill="#d97706"
            stroke="#b45309"
            strokeWidth="1.5"
          />

          {/* Dynamic anatomical parts calculation according to maxMistakes */}
          {/* Head */}
          {((maxMistakes === 8 && mistakes >= 2) ||
            (maxMistakes === 6 && mistakes >= 1) ||
            (maxMistakes === 4 && mistakes >= 1)) && (
            <g>
              <circle
                cx="175"
                cy="98"
                r="22"
                fill={headFill}
                stroke={characterStroke}
                strokeWidth="3.5"
              />
              {isLost ? (
                // Defeat dead eyes (X X)
                <g stroke="#f43f5e" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="167" y1="92" x2="173" y2="98" />
                  <line x1="173" y1="92" x2="167" y2="98" />
                  <line x1="177" y1="92" x2="183" y2="98" />
                  <line x1="183" y1="92" x2="177" y2="98" />
                  {/* Sad mouth */}
                  <path d="M 168 110 Q 175 104 182 110" fill="none" stroke="#f43f5e" />
                </g>
              ) : isWon ? (
                // Happy face
                <g stroke="#10b981" strokeWidth="2.5" strokeLinecap="round">
                  <circle cx="168" cy="94" r="2" fill="#10b981" />
                  <circle cx="182" cy="94" r="2" fill="#10b981" />
                  <path d="M 168 104 Q 175 112 182 104" fill="none" stroke="#10b981" />
                </g>
              ) : (
                // Normal watchful face
                <g stroke={isDark ? '#94a3b8' : '#475569'} strokeWidth="2" strokeLinecap="round">
                  <circle cx="169" cy="95" r="1.8" fill={isDark ? '#94a3b8' : '#475569'} />
                  <circle cx="181" cy="95" r="1.8" fill={isDark ? '#94a3b8' : '#475569'} />
                  <line x1="171" y1="106" x2="179" y2="106" stroke={isDark ? '#94a3b8' : '#475569'} />
                </g>
              )}
            </g>
          )}

          {/* Torso */}
          {((maxMistakes === 8 && mistakes >= 3) ||
            (maxMistakes === 6 && mistakes >= 2) ||
            (maxMistakes === 4 && mistakes >= 2)) && (
            <line
              x1="175"
              y1="120"
              x2="175"
              y2="180"
              stroke={characterStroke}
              strokeWidth="4"
              strokeLinecap="round"
            />
          )}

          {/* Left Arm */}
          {((maxMistakes === 8 && mistakes >= 4) ||
            (maxMistakes === 6 && mistakes >= 3) ||
            (maxMistakes === 4 && mistakes >= 3)) && (
            <line
              x1="175"
              y1="135"
              x2="145"
              y2="162"
              stroke={characterStroke}
              strokeWidth="3.5"
              strokeLinecap="round"
            />
          )}

          {/* Right Arm */}
          {((maxMistakes === 8 && mistakes >= 5) ||
            (maxMistakes === 6 && mistakes >= 4) ||
            (maxMistakes === 4 && mistakes >= 3)) && (
            <line
              x1="175"
              y1="135"
              x2="205"
              y2="162"
              stroke={characterStroke}
              strokeWidth="3.5"
              strokeLinecap="round"
            />
          )}

          {/* Left Leg */}
          {((maxMistakes === 8 && mistakes >= 6) ||
            (maxMistakes === 6 && mistakes >= 5) ||
            (maxMistakes === 4 && mistakes >= 4)) && (
            <line
              x1="175"
              y1="180"
              x2="148"
              y2="225"
              stroke={characterStroke}
              strokeWidth="3.5"
              strokeLinecap="round"
            />
          )}

          {/* Right Leg */}
          {((maxMistakes === 8 && mistakes >= 7) ||
            (maxMistakes === 6 && mistakes >= 6) ||
            (maxMistakes === 4 && mistakes >= 4)) && (
            <line
              x1="175"
              y1="180"
              x2="202"
              y2="225"
              stroke={characterStroke}
              strokeWidth="3.5"
              strokeLinecap="round"
            />
          )}

          {/* Feet (Easy mode stage 8) */}
          {maxMistakes === 8 && mistakes >= 8 && (
            <g stroke={characterStroke} strokeWidth="3" strokeLinecap="round">
              <line x1="148" y1="225" x2="138" y2="225" />
              <line x1="202" y1="225" x2="212" y2="225" />
            </g>
          )}
        </svg>

        {/* Victory Badge Overlay */}
        {isWon && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`absolute bottom-2 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-lg backdrop-blur-sm border ${
              isDark
                ? 'bg-emerald-900/90 text-emerald-200 border-emerald-500/50'
                : 'bg-emerald-50 text-emerald-800 border-emerald-300'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Word Solved!</span>
          </motion.div>
        )}

        {/* Defeat Badge Overlay */}
        {isLost && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`absolute bottom-2 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-lg backdrop-blur-sm border ${
              isDark
                ? 'bg-rose-950/90 text-rose-200 border-rose-500/50'
                : 'bg-rose-50 text-rose-800 border-rose-300'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
            <span>{maxMistakes}/{maxMistakes} Guesses Exhausted</span>
          </motion.div>
        )}
      </div>

      <div
        className={`text-[11px] font-mono mt-2 ${
          isDark ? 'text-slate-500' : 'text-slate-500'
        }`}
      >
        Limit: {maxMistakes} incorrect guesses allowed
      </div>
    </div>
  );
};
