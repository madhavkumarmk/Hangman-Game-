import React from 'react';
import { ViewTab, ThemeMode } from '../types';
import { Volume2, VolumeX, RotateCcw, Terminal, Gamepad2, Code2, BookOpen, Sun, Moon, Award, Globe } from 'lucide-react';
import { sound } from '../utils/audio';

interface NavbarProps {
  currentTab: ViewTab;
  onSelectTab: (tab: ViewTab) => void;
  onResetGame: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  theme: ThemeMode;
  onToggleTheme: () => void;
  onOpenDossier: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  onResetGame,
  isMuted,
  onToggleMute,
  theme,
  onToggleTheme,
  onOpenDossier
}) => {
  const isDark = theme === 'dark';

  return (
    <header
      className={`border-b sticky top-0 z-40 backdrop-blur-md transition-colors ${
        isDark ? 'border-slate-800/80 bg-slate-950/80' : 'border-slate-200/90 bg-white/90 shadow-xs'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark adhering to top-bar contract */}
        <button
          onClick={() => onSelectTab('GAME_BOARD')}
          className="text-left group cursor-pointer focus:outline-none"
        >
          <span
            className={`text-lg font-bold tracking-tight flex items-center gap-2 ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 group-hover:scale-125 transition-transform" />
            Hangman
          </span>
        </button>

        {/* Zone 2: Navigation items */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => onSelectTab('GAME_BOARD')}
            className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              currentTab === 'GAME_BOARD'
                ? isDark
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-900 font-semibold shadow-xs'
                : isDark
                ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
            }`}
          >
            <Gamepad2 className="w-4 h-4 text-emerald-500" />
            <span>Visual Game</span>
          </button>

          <button
            onClick={() => onSelectTab('CLASSIC_HTML')}
            className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              currentTab === 'CLASSIC_HTML'
                ? isDark
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-900 font-semibold shadow-xs'
                : isDark
                ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
            }`}
          >
            <Globe className="w-4 h-4 text-blue-500" />
            <span>Classic Web</span>
          </button>

          <button
            onClick={() => onSelectTab('TERMINAL')}
            className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              currentTab === 'TERMINAL'
                ? isDark
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-900 font-semibold shadow-xs'
                : isDark
                ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
            }`}
          >
            <Terminal className="w-4 h-4 text-amber-500" />
            <span>Python Console</span>
          </button>

          <button
            onClick={() => onSelectTab('API_DOCS')}
            className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              currentTab === 'API_DOCS'
                ? isDark
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-900 font-semibold shadow-xs'
                : isDark
                ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
            }`}
          >
            <Code2 className="w-4 h-4 text-emerald-500" />
            <span>Web API</span>
          </button>

          <button
            onClick={() => onSelectTab('CODE_STUDIO')}
            className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              currentTab === 'CODE_STUDIO'
                ? isDark
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-900 font-semibold shadow-xs'
                : isDark
                ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
            }`}
          >
            <Code2 className="w-4 h-4 text-sky-500" />
            <span>Export Code</span>
          </button>

          <button
            onClick={() => onSelectTab('VIVA_GUIDE')}
            className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              currentTab === 'VIVA_GUIDE'
                ? isDark
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-900 font-semibold shadow-xs'
                : isDark
                ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
            }`}
          >
            <BookOpen className="w-4 h-4 text-indigo-500" />
            <span>Viva &amp; Q&amp;A</span>
          </button>
        </nav>

        {/* Zone 3: Primary actions (Theme Toggle, Audio Mute, New Word) */}
        <div className="flex items-center gap-2">
          {/* Dark / Light Mode Toggle */}
          <button
            onClick={onToggleTheme}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className={`p-2 rounded-lg transition-colors cursor-pointer ${
              isDark
                ? 'text-amber-400 hover:text-amber-300 hover:bg-slate-800'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
            title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Sound Toggle */}
          <button
            onClick={onToggleMute}
            aria-label={isMuted ? 'Unmute game sounds' : 'Mute game sounds'}
            className={`p-2 rounded-lg transition-colors cursor-pointer ${
              isDark
                ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
            title={isMuted ? 'Unmute audio' : 'Mute audio'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Submission Dossier Button */}
          <button
            onClick={() => {
              sound.playKey();
              onOpenDossier();
            }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 border shadow-xs whitespace-nowrap cursor-pointer ${
              isDark
                ? 'bg-slate-900 hover:bg-slate-800 text-emerald-400 border-emerald-500/40'
                : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-300'
            }`}
            title="Open CodeAlpha Task 1 Submission Dossier & GitHub Kit"
          >
            <Award className="w-3.5 h-3.5 text-emerald-500" />
            <span className="hidden sm:inline">Internship Kit</span>
          </button>

          {/* New Word */}
          <button
            onClick={() => {
              sound.playKey();
              onResetGame();
            }}
            className="px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-all flex items-center gap-1.5 shadow-sm active:scale-95 whitespace-nowrap cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>New Word</span>
          </button>
        </div>
      </div>
    </header>
  );
};
