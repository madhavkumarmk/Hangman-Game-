import React, { useEffect, useCallback } from 'react';
import { sound } from '../utils/audio';
import { ThemeMode } from '../types';

const KEYBOARD_ROWS = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm']
];

interface VirtualKeyboardProps {
  onGuessLetter: (letter: string) => void;
  guessedLetters: string[];
  secretWord: string;
  disabled: boolean;
  theme?: ThemeMode;
}

export const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({
  onGuessLetter,
  guessedLetters,
  secretWord,
  disabled,
  theme = 'dark'
}) => {
  const isDark = theme === 'dark';

  const handleKeyClick = useCallback((letter: string) => {
    if (disabled || guessedLetters.includes(letter)) return;
    onGuessLetter(letter);
  }, [disabled, guessedLetters, onGuessLetter]);

  // Physical keyboard listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in an input/textarea
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) {
        return;
      }

      if (e.metaKey || e.ctrlKey || e.altKey) return;

      const key = e.key.toLowerCase();
      if (/^[a-z]$/.test(key)) {
        if (!disabled && !guessedLetters.includes(key)) {
          e.preventDefault();
          onGuessLetter(key);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [disabled, guessedLetters, onGuessLetter]);

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center gap-1.5 sm:gap-2 px-2 select-none">
      {KEYBOARD_ROWS.map((row, rowIdx) => (
        <div key={rowIdx} className="flex justify-center items-center gap-1 sm:gap-1.5 w-full">
          {row.map((letter) => {
            const isGuessed = guessedLetters.includes(letter);
            const isCorrect = isGuessed && secretWord.includes(letter);
            const isWrong = isGuessed && !secretWord.includes(letter);

            let keyStyle = '';

            if (isDark) {
              keyStyle = 'bg-slate-800/90 text-slate-100 hover:bg-slate-700/90 border-slate-700 shadow-sm active:scale-95 cursor-pointer';

              if (disabled && !isGuessed) {
                keyStyle = 'bg-slate-900/60 text-slate-600 border-slate-800/60 opacity-60 cursor-not-allowed';
              } else if (isCorrect) {
                keyStyle = 'bg-emerald-900/40 text-emerald-300 border-emerald-500/60 shadow-[0_0_8px_rgba(16,185,129,0.2)] cursor-default';
              } else if (isWrong) {
                keyStyle = 'bg-slate-900/80 text-slate-600 border-slate-800/80 line-through opacity-45 cursor-default';
              }
            } else {
              // Light theme
              keyStyle = 'bg-white text-slate-800 hover:bg-slate-100 border-slate-300 shadow-xs active:scale-95 cursor-pointer';

              if (disabled && !isGuessed) {
                keyStyle = 'bg-slate-100 text-slate-400 border-slate-200 opacity-60 cursor-not-allowed';
              } else if (isCorrect) {
                keyStyle = 'bg-emerald-100 text-emerald-800 border-emerald-500 shadow-xs cursor-default font-extrabold';
              } else if (isWrong) {
                keyStyle = 'bg-slate-100 text-slate-400 border-slate-200 line-through opacity-50 cursor-default';
              }
            }

            return (
              <button
                key={letter}
                onClick={() => handleKeyClick(letter)}
                disabled={disabled || isGuessed}
                aria-label={`Letter ${letter.toUpperCase()}`}
                className={`min-w-[32px] sm:min-w-[42px] h-11 sm:h-12 flex-1 max-w-[48px] rounded-lg font-mono font-bold text-sm sm:text-base uppercase border transition-all flex items-center justify-center focus-visible:outline-2 focus-visible:outline-emerald-500 ${keyStyle}`}
              >
                {letter}
              </button>
            );
          })}
        </div>
      ))}
      <p className="text-[11px] text-slate-500 mt-1 font-mono">
        Pro tip: You can also use your computer physical keyboard to type letters!
      </p>
    </div>
  );
};
