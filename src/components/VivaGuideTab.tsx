import React, { useState } from 'react';
import { CODEALPHA_VIVA_QUESTIONS } from '../utils/pythonCode';
import { ChevronDown, ChevronUp, BookOpen, CheckCircle, Lightbulb } from 'lucide-react';
import { sound } from '../utils/audio';
import { ThemeMode } from '../types';

interface VivaGuideTabProps {
  theme?: ThemeMode;
}

export const VivaGuideTab: React.FC<VivaGuideTabProps> = ({ theme = 'dark' }) => {
  const isDark = theme === 'dark';
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    sound.playKey();
    setOpenIndex(prev => (prev === index ? null : index));
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-6">
      {/* Header */}
      <div
        className={`rounded-2xl border p-6 transition-colors ${
          isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
        }`}
      >
        <div className={`flex items-center gap-2 text-xs mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          <span>Internship Preparation</span>
          <span aria-hidden="true" className={isDark ? 'text-slate-600' : 'text-slate-400'}>·</span>
          <span>Evaluation &amp; Viva Voce</span>
        </div>
        <h2 className={`text-xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
          CodeAlpha Task Explanation &amp; Viva Questions
        </h2>
        <p className={`text-xs mt-1 max-w-2xl leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          Detailed explanations in English and Hindi (Hinglish) to help you understand how every line works and confidently explain your project to internship mentors and interviewers.
        </p>

        {/* Task Requirements Checklist */}
        <div className={`mt-4 pt-4 border-t grid grid-cols-1 sm:grid-cols-3 gap-3 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
          <div
            className={`p-3 rounded-xl border flex items-start gap-2.5 transition-colors ${
              isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <div>
              <div className={`text-xs font-semibold ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>
                Predefined Word Pools
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">Easy, Medium (Core 5), &amp; Hard tiers</div>
            </div>
          </div>

          <div
            className={`p-3 rounded-xl border flex items-start gap-2.5 transition-colors ${
              isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <div>
              <div className={`text-xs font-semibold ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>
                Dynamic Mistake Limits
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">8 (Easy), 6 (Standard), 4 (Hard)</div>
            </div>
          </div>

          <div
            className={`p-3 rounded-xl border flex items-start gap-2.5 transition-colors ${
              isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <div>
              <div className={`text-xs font-semibold ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>
                Console &amp; REST API
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">while-loop, input validation, Express API</div>
            </div>
          </div>
        </div>
      </div>

      {/* Accordion Questions */}
      <div className="flex flex-col gap-3">
        {CODEALPHA_VIVA_QUESTIONS.map((item, idx) => {
          const isOpen = openIndex === idx;

          return (
            <div
              key={idx}
              className={`rounded-xl border overflow-hidden transition-all duration-200 ${
                isDark
                  ? 'bg-slate-900/60 border-slate-800'
                  : 'bg-white border-slate-200 shadow-xs'
              }`}
            >
              <button
                onClick={() => toggleAccordion(idx)}
                className={`w-full px-5 py-4 flex items-center justify-between text-left transition-colors cursor-pointer ${
                  isDark ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3 pr-4">
                  <span
                    className={`w-6 h-6 rounded-md text-xs font-mono font-bold flex items-center justify-center shrink-0 ${
                      isDark ? 'bg-slate-800 text-emerald-400' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}
                  >
                    Q{idx + 1}
                  </span>
                  <span className={`text-sm font-semibold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                    {item.question}
                  </span>
                </div>
                <div className="text-slate-400 shrink-0">
                  {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </button>

              {isOpen && (
                <div
                  className={`px-5 pb-5 pt-1 border-t flex flex-col gap-3 ${
                    isDark ? 'border-slate-800/80' : 'border-slate-200'
                  }`}
                >
                  {/* Hindi Summary */}
                  <div
                    className={`p-3 rounded-lg border flex items-start gap-2.5 ${
                      isDark
                        ? 'bg-amber-950/20 border-amber-500/20'
                        : 'bg-amber-50 border-amber-200/80'
                    }`}
                  >
                    <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <span className={`text-[11px] font-semibold block ${isDark ? 'text-amber-300' : 'text-amber-900'}`}>
                        Quick Hindi / Hinglish Summary:
                      </span>
                      <p className={`text-xs mt-0.5 leading-relaxed ${isDark ? 'text-amber-200/90' : 'text-amber-900'}`}>
                        {item.hindiSummary}
                      </p>
                    </div>
                  </div>

                  {/* Technical English Answer */}
                  <div>
                    <span className={`text-xs font-semibold block mb-1 ${isDark ? 'text-slate-300' : 'text-slate-900'}`}>
                      Technical Explanation:
                    </span>
                    <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      {item.answer}
                    </p>
                  </div>

                  {/* Code Snippet */}
                  {item.codeSnippet && (
                    <div className="bg-slate-950 rounded-lg p-3 border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto">
                      <pre>
                        <code>{item.codeSnippet}</code>
                      </pre>
                    </div>
                  )}

                  {/* Key Concepts Tags (unboxed text style) */}
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 pt-1">
                    <span>Key Topics:</span>
                    {item.keyConcepts.map((concept, cIdx) => (
                      <React.Fragment key={concept}>
                        {cIdx > 0 && <span aria-hidden="true">·</span>}
                        <span className={`font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{concept}</span>
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Submission Tips Footer */}
      <div
        className={`rounded-xl border p-4 text-xs leading-relaxed flex flex-col gap-2 transition-colors ${
          isDark
            ? 'bg-slate-900/40 border-slate-800/80 text-slate-400'
            : 'bg-white border-slate-200 text-slate-600 shadow-xs'
        }`}
      >
        <span className={`font-semibold flex items-center gap-1.5 ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>
          <BookOpen className="w-4 h-4 text-emerald-500" />
          Tips for CodeAlpha Task Submission:
        </span>
        <ul className="list-disc list-inside space-y-1 ml-1">
          <li>Create a clean GitHub repository named <code className="text-emerald-500 font-mono">CodeAlpha_Hangman_Game</code>.</li>
          <li>Add the downloaded <code className="text-emerald-500 font-mono">hangman_codealpha.py</code> file and a brief <code className="text-emerald-500 font-mono">README.md</code> describing the project.</li>
          <li>Record a quick 1-2 minute video demonstration showing a winning round and a round where incorrect guesses reach the limit.</li>
        </ul>
      </div>
    </div>
  );
};
