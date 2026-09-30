import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Lightbulb } from 'lucide-react';
import { sound } from '../utils/audio';
import { ThemeMode } from '../types';

interface WordDisplayProps {
  word: string;
  guessedLetters: string[];
  isLost: boolean;
  isWon: boolean;
  hint?: string;
  categoryName: string;
  maxMistakes: number;
  theme?: ThemeMode;
}

export const WordDisplay: React.FC<WordDisplayProps> = ({
  word,
  guessedLetters,
  isLost,
  isWon,
  hint,
  categoryName,
  maxMistakes,
  theme = 'dark'
}) => {
  const [showHint, setShowHint] = useState<boolean>(false);
  const isDark = theme === 'dark';

  return (
    <div className="w-full flex flex-col items-center">
      {/* Category text kicker without pill badge (following anti-slop rules) */}
      <div className={`flex items-center gap-2 text-xs mb-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
        <span>Category</span>
        <span aria-hidden="true" className={isDark ? 'text-slate-600' : 'text-slate-400'}>·</span>
        <span className={`font-semibold ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>{categoryName}</span>
        <span aria-hidden="true" className={isDark ? 'text-slate-600' : 'text-slate-400'}>·</span>
        <span className="tabular-nums">{word.length} Letters</span>
      </div>

      {/* Letter Tiles */}
      <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-3 py-4 min-h-[80px]">
        {word.split('').map((letter, idx) => {
          const isGuessed = guessedLetters.includes(letter.toLowerCase());
          const isRevealedAfterLoss = isLost && !isGuessed;

          let tileStyle = '';
          if (isGuessed) {
            tileStyle = isDark
              ? 'bg-emerald-950/40 border-emerald-500/60 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.2)]'
              : 'bg-emerald-50 border-emerald-500 text-emerald-800 shadow-xs';
          } else if (isRevealedAfterLoss) {
            tileStyle = isDark
              ? 'bg-rose-950/40 border-rose-500/50 text-rose-400'
              : 'bg-rose-50 border-rose-400 text-rose-700 shadow-xs';
          } else {
            tileStyle = isDark
              ? 'bg-slate-900/80 border-slate-700/80 text-transparent shadow-sm'
              : 'bg-white border-slate-300 text-transparent shadow-xs';
          }

          return (
            <motion.div
              key={`${idx}-${letter}`}
              initial={{ scale: 0.9, opacity: 0.8 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.15 }}
              className={`w-10 h-14 sm:w-12 sm:h-16 rounded-xl flex flex-col items-center justify-center font-mono font-bold text-2xl sm:text-3xl border transition-all ${tileStyle}`}
            >
              <span>{isGuessed || isRevealedAfterLoss ? letter.toUpperCase() : ''}</span>
              <div
                className={`w-5 h-0.5 rounded-full mt-1 ${
                  isGuessed
                    ? isDark ? 'bg-emerald-400' : 'bg-emerald-600'
                    : isRevealedAfterLoss
                    ? isDark ? 'bg-rose-400' : 'bg-rose-600'
                    : isDark ? 'bg-slate-500' : 'bg-slate-300'
                }`}
              />
            </motion.div>
          );
        })}
      </div>

      {/* Hint Accordion / Context */}
      {hint && (
        <div className="mt-4 flex flex-col items-center">
          {!showHint ? (
            <button
              onClick={() => {
                sound.playKey();
                setShowHint(true);
              }}
              className={`text-xs flex items-center gap-1.5 transition-colors py-1.5 px-3 rounded-lg cursor-pointer ${
                isDark
                  ? 'text-amber-400/90 hover:text-amber-300 hover:bg-amber-950/30'
                  : 'text-amber-800 hover:text-amber-900 hover:bg-amber-50 bg-amber-50/50 border border-amber-200/60'
              }`}
            >
              <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
              <span>Need a clue? Reveal Word Hint</span>
            </button>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className={`max-w-md text-xs px-4 py-2.5 rounded-xl text-center leading-relaxed border ${
                isDark
                  ? 'bg-amber-950/20 border-amber-500/30 text-amber-200/90'
                  : 'bg-amber-50 border-amber-300/80 text-amber-950 shadow-xs'
              }`}
            >
              <span className={`font-semibold ${isDark ? 'text-amber-400' : 'text-amber-700'}`}>Hint: </span>
              {hint}
            </motion.div>
          )}
        </div>
      )}

      {/* Word result message when game ends */}
      {isLost && (
        <p className={`text-xs mt-3 font-mono ${isDark ? 'text-rose-400' : 'text-rose-700'}`}>
          The secret word was <span className="font-bold underline uppercase">{word}</span>
        </p>
      )}
      {isWon && (
        <p className={`text-xs mt-3 font-mono flex items-center gap-1 ${isDark ? 'text-emerald-400' : 'text-emerald-700 font-medium'}`}>
          <Sparkles className="w-3.5 h-3.5" />
          <span>Brilliant! You guessed it with {maxMistakes - guessedLetters.filter(l => !word.includes(l)).length} tries to spare.</span>
        </p>
      )}
    </div>
  );
};
