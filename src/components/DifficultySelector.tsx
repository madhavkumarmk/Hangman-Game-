import React from 'react';
import { DifficultyLevel, ThemeMode } from '../types';
import { DIFFICULTY_CONFIGS } from '../utils/words';
import { Shield, Zap, Flame } from 'lucide-react';
import { sound } from '../utils/audio';

interface DifficultySelectorProps {
  currentDifficulty: DifficultyLevel;
  onSelectDifficulty: (difficulty: DifficultyLevel) => void;
  compact?: boolean;
  theme?: ThemeMode;
}

export const DifficultySelector: React.FC<DifficultySelectorProps> = ({
  currentDifficulty,
  onSelectDifficulty,
  compact = false,
  theme = 'dark'
}) => {
  const isDark = theme === 'dark';
  const levels: DifficultyLevel[] = ['easy', 'medium', 'hard'];

  const getIcon = (diff: DifficultyLevel) => {
    switch (diff) {
      case 'easy':
        return <Shield className="w-3.5 h-3.5 text-emerald-500" />;
      case 'medium':
        return <Zap className="w-3.5 h-3.5 text-amber-500" />;
      case 'hard':
        return <Flame className="w-3.5 h-3.5 text-rose-500" />;
    }
  };

  const handleSelect = (diff: DifficultyLevel) => {
    if (diff === currentDifficulty) return;
    sound.playKey();
    onSelectDifficulty(diff);
  };

  if (compact) {
    return (
      <div
        className={`flex items-center gap-1 p-1 rounded-lg border transition-colors ${
          isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-200'
        }`}
      >
        {levels.map((level) => {
          const config = DIFFICULTY_CONFIGS[level];
          const isActive = currentDifficulty === level;
          return (
            <button
              key={level}
              onClick={() => handleSelect(level)}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                isActive
                  ? isDark
                    ? 'bg-slate-800 text-white font-semibold shadow-sm'
                    : 'bg-white text-slate-900 font-semibold shadow-xs'
                  : isDark
                  ? 'text-slate-400 hover:text-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {getIcon(level)}
              <span>{config.label}</span>
              <span className="font-mono text-[10px] opacity-75">({config.limit})</span>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex items-center justify-between text-xs">
        <span
          className={`font-semibold flex items-center gap-1.5 ${
            isDark ? 'text-slate-200' : 'text-slate-800'
          }`}
        >
          <span>Game Difficulty</span>
        </span>
        <span className="text-slate-500 font-mono text-[11px]">
          {DIFFICULTY_CONFIGS[currentDifficulty].wordComplexity}
        </span>
      </div>

      <div
        className={`grid grid-cols-3 gap-2 p-1.5 rounded-xl border transition-colors ${
          isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-100/90 border-slate-200 shadow-inner'
        }`}
      >
        {levels.map((level) => {
          const config = DIFFICULTY_CONFIGS[level];
          const isActive = currentDifficulty === level;

          let activeStyle = '';
          if (isActive) {
            if (isDark) {
              if (level === 'easy') activeStyle = 'border-emerald-500/50 bg-emerald-950/20 text-white shadow-sm';
              else if (level === 'medium') activeStyle = 'border-amber-500/50 bg-amber-950/20 text-white shadow-sm';
              else activeStyle = 'border-rose-500/50 bg-rose-950/20 text-white shadow-sm';
            } else {
              if (level === 'easy') activeStyle = 'border-emerald-500 bg-white text-emerald-950 shadow-xs ring-1 ring-emerald-500/20';
              else if (level === 'medium') activeStyle = 'border-amber-500 bg-white text-amber-950 shadow-xs ring-1 ring-amber-500/20';
              else activeStyle = 'border-rose-500 bg-white text-rose-950 shadow-xs ring-1 ring-rose-500/20';
            }
          } else {
            activeStyle = isDark
              ? 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-white/60';
          }

          return (
            <button
              key={level}
              onClick={() => handleSelect(level)}
              className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer flex flex-col gap-1 ${activeStyle}`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs flex items-center gap-1.5">
                  {getIcon(level)}
                  <span>{config.label}</span>
                </span>
                <span
                  className={`font-mono text-[11px] font-semibold tabular-nums ${
                    isActive ? (isDark ? 'text-white' : 'text-slate-900') : 'text-slate-500'
                  }`}
                >
                  {config.limit} tries
                </span>
              </div>
              <span className="text-[10px] text-slate-500 truncate">
                {level === 'easy' ? '3-5 letters' : level === 'medium' ? '5-7 letters' : '8+ letters'}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
