import React, { useState } from 'react';
import { generatePythonCode, downloadPythonFile } from '../utils/pythonCode';
import { generateReadmeContent } from '../utils/githubReadme';
import { generatePythonTestSuite } from '../utils/pythonTests';
import { Copy, Check, Download, FileCode, Plus, X, RotateCcw, Award, FileText } from 'lucide-react';
import { sound } from '../utils/audio';

import { DifficultyLevel, ThemeMode } from '../types';
import { DIFFICULTY_CONFIGS } from '../utils/words';

interface CodeStudioTabProps {
  customWords: string[];
  onUpdateCustomWords: (words: string[]) => void;
  currentDifficulty: DifficultyLevel;
  onSelectDifficulty: (difficulty: DifficultyLevel) => void;
  theme?: ThemeMode;
  onOpenDossier?: () => void;
}

export const CodeStudioTab: React.FC<CodeStudioTabProps> = ({
  customWords,
  onUpdateCustomWords,
  currentDifficulty,
  onSelectDifficulty,
  theme = 'dark',
  onOpenDossier
}) => {
  const isDark = theme === 'dark';
  const [commentLanguage, setCommentLanguage] = useState<'english' | 'hinglish'>('hinglish');
  const [copied, setCopied] = useState<boolean>(false);
  const [newWordInput, setNewWordInput] = useState<string>('');

  const pythonCode = generatePythonCode(customWords, commentLanguage, currentDifficulty);

  const handleCopy = () => {
    sound.playKey();
    navigator.clipboard.writeText(pythonCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    sound.playCorrect();
    downloadPythonFile('hangman_codealpha.py', pythonCode);
  };

  const handleAddWord = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newWordInput.trim().toLowerCase();
    if (!trimmed || !/^[a-z]+$/.test(trimmed)) return;
    if (customWords.includes(trimmed)) return;

    sound.playKey();
    onUpdateCustomWords([...customWords, trimmed]);
    setNewWordInput('');
  };

  const handleRemoveWord = (wordToRemove: string) => {
    sound.playKey();
    if (customWords.length <= 1) return;
    onUpdateCustomWords(customWords.filter(w => w !== wordToRemove));
  };

  const handleResetToDefault = () => {
    sound.playKey();
    onUpdateCustomWords(['python', 'code', 'alpha', 'intern', 'developer']);
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-6">
      {/* Top Banner & Submission Requirements Card */}
      <div
        className={`rounded-2xl border p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 transition-colors ${
          isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
        }`}
      >
        <div>
          <div className={`flex items-center gap-2 text-xs mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            <span>CodeAlpha Python Internship</span>
            <span aria-hidden="true" className={isDark ? 'text-slate-600' : 'text-slate-400'}>·</span>
            <span>Task 1 Submission Kit</span>
          </div>
          <h2 className={`text-xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Python Source Code &amp; Generator
          </h2>
          <p className={`text-xs mt-1 max-w-xl leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Beginner-friendly, PEP8 compliant Python script ready to run in any Python 3 environment (VS Code, PyCharm, IDLE, Google Colab, or Terminal).
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {onOpenDossier && (
            <button
              onClick={onOpenDossier}
              className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 shadow-xs cursor-pointer ${
                isDark
                  ? 'bg-slate-900 hover:bg-slate-800 text-emerald-400 border-emerald-500/40'
                  : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-300'
              }`}
            >
              <Award className="w-3.5 h-3.5 text-emerald-500" />
              <span>Full Dossier</span>
            </button>
          )}

          <button
            onClick={() => {
              sound.playCorrect();
              downloadPythonFile('README.md', generateReadmeContent());
            }}
            className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 shadow-xs cursor-pointer ${
              isDark
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-300'
            }`}
            title="Download formatted GitHub repository README.md"
          >
            <FileText className="w-3.5 h-3.5 text-sky-400" />
            <span>README.md</span>
          </button>

          <button
            onClick={handleCopy}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all flex items-center gap-2 shadow-xs cursor-pointer ${
              isDark
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-100 border-slate-700'
                : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-300'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-500" />
                <span className="text-emerald-500">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-slate-400" />
                <span>Copy Script</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownload}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-all flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download .py</span>
          </button>
        </div>
      </div>

      {/* Control Bar: Language Toggle & Word Customizer */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Comment Language & Difficulty Selector */}
        <div
          className={`rounded-xl border p-4 flex flex-col justify-between gap-3 transition-colors ${
            isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
          }`}
        >
          <div>
            <span className={`text-xs font-semibold ${isDark ? 'text-slate-300' : 'text-slate-900'}`}>
              Comment Style &amp; Default Mode
            </span>
            <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Choose the comment language and difficulty configuration for the generated script.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <div
              className={`flex items-center gap-1.5 p-1 rounded-lg border self-start transition-colors ${
                isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-200'
              }`}
            >
              <button
                onClick={() => {
                  sound.playKey();
                  setCommentLanguage('hinglish');
                }}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  commentLanguage === 'hinglish'
                    ? 'bg-emerald-600 text-white shadow-xs font-semibold'
                    : isDark
                    ? 'text-slate-400 hover:text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Hinglish Comments
              </button>
              <button
                onClick={() => {
                  sound.playKey();
                  setCommentLanguage('english');
                }}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  commentLanguage === 'english'
                    ? 'bg-emerald-600 text-white shadow-xs font-semibold'
                    : isDark
                    ? 'text-slate-400 hover:text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Standard English
              </button>
            </div>

            <div className="flex items-center gap-1 text-xs text-slate-400 mt-1">
              <span>Script Target:</span>
              {(['easy', 'medium', 'hard'] as DifficultyLevel[]).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => {
                    sound.playKey();
                    onSelectDifficulty(lvl);
                  }}
                  className={`px-2 py-0.5 rounded text-[11px] font-mono capitalize transition-colors ${
                    currentDifficulty === lvl
                      ? 'bg-slate-800 text-white font-semibold border border-slate-700'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {lvl} ({DIFFICULTY_CONFIGS[lvl].limit} tries)
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Word Pool Customizer */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300">
              Active Words ({customWords.length})
            </span>
            <button
              onClick={handleResetToDefault}
              className="text-[11px] text-slate-400 hover:text-emerald-400 flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset to 5 CodeAlpha Words</span>
            </button>
          </div>

          {/* Words Chips */}
          <div className="flex flex-wrap items-center gap-1.5 max-h-24 overflow-y-auto">
            {customWords.map((word) => (
              <span
                key={word}
                className="text-xs font-mono px-2 py-1 bg-slate-950 border border-slate-800 rounded-md text-slate-200 flex items-center gap-1.5"
              >
                <span>{word}</span>
                {customWords.length > 1 && (
                  <button
                    onClick={() => handleRemoveWord(word)}
                    className="text-slate-500 hover:text-rose-400 p-0.5 rounded transition-colors"
                    aria-label={`Remove ${word}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </span>
            ))}
          </div>

          {/* Add Word Input */}
          <form onSubmit={handleAddWord} className="flex items-center gap-2 mt-1">
            <input
              type="text"
              value={newWordInput}
              onChange={(e) => setNewWordInput(e.target.value)}
              placeholder="Add word (e.g. backend)..."
              className="flex-1 px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg flex items-center gap-1 border border-slate-700 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </form>
        </div>
      </div>

      {/* Code Display Area */}
      <div className="bg-[#0b101b] rounded-2xl border border-slate-800 shadow-xl overflow-hidden flex flex-col">
        {/* Code Header */}
        <div className="bg-slate-900/90 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileCode className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-mono text-slate-300 font-semibold">
              hangman_codealpha.py
            </span>
          </div>
          <span className="text-[11px] font-mono text-slate-500">
            Python 3.8+ · UTF-8
          </span>
        </div>

        {/* Syntax Viewer */}
        <div className="p-4 sm:p-6 overflow-x-auto bg-[#070b14] max-h-[550px] overflow-y-auto terminal-scroll">
          <pre className="font-mono text-xs sm:text-sm text-slate-300 leading-relaxed">
            <code>{pythonCode}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};
