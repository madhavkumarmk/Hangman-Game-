import React, { useState, useMemo } from 'react';
import { generateClassicHtmlGame } from '../utils/classicHtmlGame';
import { downloadPythonFile } from '../utils/pythonCode';
import { Play, Copy, Check, Download, RotateCcw, ExternalLink, Code2, Sparkles, CheckCircle } from 'lucide-react';
import { sound } from '../utils/audio';
import { ThemeMode, DifficultyLevel } from '../types';
import { DIFFICULTY_CONFIGS } from '../utils/words';

interface ClassicHtmlTabProps {
  customWords: string[];
  currentDifficulty: DifficultyLevel;
  theme?: ThemeMode;
}

export const ClassicHtmlTab: React.FC<ClassicHtmlTabProps> = ({
  customWords,
  currentDifficulty,
  theme = 'dark'
}) => {
  const isDark = theme === 'dark';
  const [copied, setCopied] = useState<boolean>(false);
  const [activeSubTab, setActiveSubTab] = useState<'preview' | 'source'>('preview');
  const [iframeKey, setIframeKey] = useState<number>(1);

  const limit = DIFFICULTY_CONFIGS[currentDifficulty].limit;
  const htmlContent = useMemo(() => {
    return generateClassicHtmlGame(customWords, limit);
  }, [customWords, limit]);

  const handleCopy = () => {
    sound.playKey();
    navigator.clipboard.writeText(htmlContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    sound.playCorrect();
    downloadPythonFile('hangman_web.html', htmlContent);
  };

  const handleRestartIframe = () => {
    sound.playKey();
    setIframeKey(prev => prev + 1);
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-6">
      {/* Top Banner */}
      <div
        className={`rounded-2xl border p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-colors ${
          isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
        }`}
      >
        <div>
          <div className={`flex items-center gap-2 text-xs mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            <span>Standalone Web Edition</span>
            <span aria-hidden="true" className={isDark ? 'text-slate-600' : 'text-slate-400'}>·</span>
            <span>Single-File HTML5, CSS &amp; JavaScript</span>
          </div>
          <h2 className={`text-xl font-bold tracking-tight flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            <span>Classic Web Hangman</span>
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          </h2>
          <p className={`text-xs mt-1 max-w-xl leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Zero-dependency, standalone single-file HTML game containing built-in CSS and JavaScript. Works out of the box in any web browser without Node.js or Python installations.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={handleRestartIframe}
            className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 shadow-xs cursor-pointer ${
              isDark
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-300'
            }`}
            title="Reload web frame"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restart Frame</span>
          </button>

          <button
            onClick={handleCopy}
            className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 shadow-xs cursor-pointer ${
              isDark
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-100 border-slate-700'
                : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-300'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-emerald-500">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span>Copy HTML</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownload}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white transition-all flex items-center gap-2 shadow-xs cursor-pointer active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span>Download .html</span>
          </button>
        </div>
      </div>

      {/* View Switcher: Live Preview vs Raw Source Code */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => {
            sound.playKey();
            setActiveSubTab('preview');
          }}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
            activeSubTab === 'preview'
              ? 'bg-blue-600 text-white shadow-xs'
              : isDark
              ? 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
              : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
          }`}
        >
          <Play className="w-3.5 h-3.5" />
          <span>Interactive Live Game</span>
        </button>

        <button
          onClick={() => {
            sound.playKey();
            setActiveSubTab('source');
          }}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
            activeSubTab === 'source'
              ? 'bg-blue-600 text-white shadow-xs'
              : isDark
              ? 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
              : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
          }`}
        >
          <Code2 className="w-3.5 h-3.5" />
          <span>View Single-File Code</span>
        </button>

        <div className="ml-auto hidden sm:flex items-center gap-2 text-xs text-slate-500">
          <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
          <span>Words: {customWords.map(w => w.toUpperCase()).join(', ')}</span>
        </div>
      </div>

      {/* Main Container */}
      {activeSubTab === 'preview' ? (
        <div
          className={`rounded-2xl border overflow-hidden shadow-xl transition-colors ${
            isDark ? 'border-slate-800 bg-slate-950' : 'border-slate-300 bg-slate-100'
          }`}
        >
          {/* Mock Browser Header */}
          <div
            className={`px-4 py-2.5 border-b flex items-center justify-between transition-colors ${
              isDark ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-slate-200 border-slate-300 text-slate-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
              <span className="text-[11px] font-mono ml-2">file:///hangman_web.html</span>
            </div>
            <span className="text-[11px] font-mono text-slate-500">HTML5 · CSS3 · Vanilla JS</span>
          </div>

          {/* Sandboxed Live Execution Frame */}
          <div className="w-full min-h-[560px] flex items-center justify-center p-2 bg-[#f4f4f9]">
            <iframe
              key={iframeKey}
              srcDoc={htmlContent}
              title="Classic Hangman Game"
              sandbox="allow-scripts"
              className="w-full h-[580px] border-0 rounded-lg"
            />
          </div>
        </div>
      ) : (
        /* Source Code Viewer */
        <div className="rounded-2xl border border-slate-800 bg-[#070b14] overflow-hidden shadow-2xl flex flex-col">
          <div className="px-4 py-3 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between text-xs font-mono">
            <span className="text-slate-300 font-semibold">hangman_web.html</span>
            <span className="text-slate-500">HTML + Embedded CSS &amp; JavaScript</span>
          </div>
          <div className="p-4 font-mono text-xs text-slate-300 overflow-x-auto max-h-[560px] terminal-scroll leading-relaxed">
            <pre>
              <code>{htmlContent}</code>
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
