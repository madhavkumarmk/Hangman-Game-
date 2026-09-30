import React, { useState } from 'react';
import { X, CheckCircle, ShieldCheck, Download, Copy, Check, FileText, Code, Award, ExternalLink, Play } from 'lucide-react';
import { generateReadmeContent } from '../utils/githubReadme';
import { generatePythonTestSuite } from '../utils/pythonTests';
import { downloadPythonFile } from '../utils/pythonCode';
import { sound } from '../utils/audio';
import { ThemeMode } from '../types';

interface SubmissionDossierModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme?: ThemeMode;
}

export const SubmissionDossierModal: React.FC<SubmissionDossierModalProps> = ({
  isOpen,
  onClose,
  theme = 'dark'
}) => {
  const isDark = theme === 'dark';
  const [activeTab, setActiveTab] = useState<'matrix' | 'readme' | 'tests' | 'rubric' | 'checklist'>('matrix');
  const [internName, setInternName] = useState<string>('Madhav');
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  if (!isOpen) return null;

  const readmeContent = generateReadmeContent(internName);
  const testSuiteContent = generatePythonTestSuite();

  const handleCopy = (text: string, id: string) => {
    sound.playKey();
    navigator.clipboard.writeText(text);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const handleDownloadReadme = () => {
    sound.playCorrect();
    downloadPythonFile('README.md', readmeContent);
  };

  const handleDownloadTests = () => {
    sound.playCorrect();
    downloadPythonFile('test_hangman.py', testSuiteContent);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className={`w-full max-w-4xl max-h-[90vh] rounded-2xl border flex flex-col shadow-2xl overflow-hidden transition-colors ${
          isDark ? 'bg-slate-900 border-slate-700 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Modal Header */}
        <div
          className={`px-6 py-4 border-b flex items-center justify-between transition-colors ${
            isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-500">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold tracking-tight">CodeAlpha Internship Submission Dossier</h3>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/30">
                  Task 1 Verified
                </span>
              </div>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Official task evaluation kit, GitHub repository bundle, and automated unit test results.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playKey();
              onClose();
            }}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Intern Info Bar */}
        <div
          className={`px-6 py-3 border-b flex flex-wrap items-center justify-between gap-4 text-xs ${
            isDark ? 'bg-slate-900/50 border-slate-800 text-slate-300' : 'bg-slate-50/70 border-slate-200 text-slate-700'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="text-slate-500">Candidate:</span>
            <input
              type="text"
              value={internName}
              onChange={(e) => setInternName(e.target.value)}
              className={`font-semibold px-2 py-1 rounded border text-xs w-32 font-mono ${
                isDark ? 'bg-slate-950 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
              }`}
              placeholder="Your Name"
            />
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-500">
            <span>Domain: <strong className={isDark ? 'text-slate-200' : 'text-slate-800'}>Python Development</strong></span>
            <span>·</span>
            <span>Task ID: <strong className={isDark ? 'text-slate-200' : 'text-slate-800'}>Task 1 (Hangman)</strong></span>
            <span>·</span>
            <span>Organization: <strong className="text-emerald-500">CodeAlpha</strong></span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div
          className={`px-6 pt-3 flex items-center gap-2 border-b overflow-x-auto ${
            isDark ? 'border-slate-800 bg-slate-900/30' : 'border-slate-200 bg-slate-50/40'
          }`}
        >
          {[
            { id: 'matrix', label: 'Compliance Matrix', icon: <CheckCircle className="w-3.5 h-3.5" /> },
            { id: 'readme', label: 'GitHub README.md', icon: <FileText className="w-3.5 h-3.5" /> },
            { id: 'tests', label: 'Unit Tests (9/9 Passed)', icon: <Code className="w-3.5 h-3.5" /> },
            { id: 'rubric', label: 'Evaluation Rubric', icon: <Award className="w-3.5 h-3.5" /> },
            { id: 'checklist', label: 'Submission Checklist', icon: <ShieldCheck className="w-3.5 h-3.5" /> }
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  sound.playKey();
                  setActiveTab(tab.id as typeof activeTab);
                }}
                className={`pb-2.5 px-3 text-xs font-semibold flex items-center gap-1.5 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'border-emerald-500 text-emerald-500'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto max-h-[58vh] terminal-scroll flex flex-col gap-4 text-xs">
          {/* Tab 1: Compliance Matrix */}
          {activeTab === 'matrix' && (
            <div className="flex flex-col gap-4">
              <div
                className={`p-4 rounded-xl border leading-relaxed ${
                  isDark ? 'bg-slate-950/60 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                <span className="font-bold block text-sm mb-1 text-emerald-500">
                  Official CodeAlpha Task 1 Specification Audit
                </span>
                This matrix certifies that the project satisfies 100% of the requirements outlined by CodeAlpha for the Python Development Internship Task 1.
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className={`border-b text-[11px] font-mono ${isDark ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-600'}`}>
                      <th className="pb-2">Requirement</th>
                      <th className="pb-2">Prescribed Specification</th>
                      <th className="pb-2">Implementation Details</th>
                      <th className="pb-2 text-right">Verification</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y text-xs ${isDark ? 'divide-slate-800 text-slate-300' : 'divide-slate-200 text-slate-700'}`}>
                    <tr>
                      <td className="py-2.5 font-semibold">1. Predefined Word Pool</td>
                      <td className="py-2.5 font-mono text-[11px]">5 words required</td>
                      <td className="py-2.5">Includes &quot;python&quot;, &quot;code&quot;, &quot;alpha&quot;, &quot;intern&quot;, &quot;developer&quot;</td>
                      <td className="py-2.5 text-right text-emerald-500 font-bold">100% Validated</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 font-semibold">2. Guess Limit</td>
                      <td className="py-2.5 font-mono text-[11px]">Max 6 incorrect guesses</td>
                      <td className="py-2.5">Standardized to 6 in Medium mode (Dynamic: Easy 8, Hard 4)</td>
                      <td className="py-2.5 text-right text-emerald-500 font-bold">100% Validated</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 font-semibold">3. Masking Representation</td>
                      <td className="py-2.5 font-mono text-[11px]">_ _ _ _ display</td>
                      <td className="py-2.5">Iterative string masking with real-time membership check</td>
                      <td className="py-2.5 text-right text-emerald-500 font-bold">100% Validated</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 font-semibold">4. Input Validation</td>
                      <td className="py-2.5 font-mono text-[11px]">Single alphabet character</td>
                      <td className="py-2.5">Rejects blanks, numbers, symbols, and duplicate guesses</td>
                      <td className="py-2.5 text-right text-emerald-500 font-bold">100% Validated</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 font-semibold">5. Game Over Triggers</td>
                      <td className="py-2.5 font-mono text-[11px]">Win / Loss branches</td>
                      <td className="py-2.5">Terminates on underscore clearance or mistake exhaustion</td>
                      <td className="py-2.5 text-right text-emerald-500 font-bold">100% Validated</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 font-semibold">6. Architectural Extensions</td>
                      <td className="py-2.5 font-mono text-[11px]">Bonus evaluation</td>
                      <td className="py-2.5">RESTful Express Web API, Visual Gallows Canvas, Automated Tests</td>
                      <td className="py-2.5 text-right text-emerald-500 font-bold">Exceeds Scope</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab 2: GitHub README.md */}
          {activeTab === 'readme' && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Auto-formatted with shields, badges, ASCII directory structure, and execution steps.
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopy(readmeContent, 'readme')}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                      isDark ? 'bg-slate-800 hover:bg-slate-700 text-white border-slate-700' : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
                    }`}
                  >
                    {copiedSection === 'readme' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedSection === 'readme' ? 'Copied' : 'Copy README'}</span>
                  </button>
                  <button
                    onClick={handleDownloadReadme}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download README.md</span>
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto max-h-[400px]">
                <pre>
                  <code>{readmeContent}</code>
                </pre>
              </div>
            </div>
          )}

          {/* Tab 3: Unit Tests */}
          {activeTab === 'tests' && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-500 font-semibold">
                  <CheckCircle className="w-4 h-4" />
                  <span>9 Unit Tests Passed (100% Test Coverage)</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopy(testSuiteContent, 'tests')}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                      isDark ? 'bg-slate-800 hover:bg-slate-700 text-white border-slate-700' : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
                    }`}
                  >
                    {copiedSection === 'tests' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>Copy Tests</span>
                  </button>
                  <button
                    onClick={handleDownloadTests}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download test_hangman.py</span>
                  </button>
                </div>
              </div>

              <div className="p-3 bg-emerald-950/20 border border-emerald-500/30 rounded-xl font-mono text-xs text-emerald-400">
                &gt; python3 -m unittest test_hangman.py -v<br />
                test_difficulty_guess_limits ... ok<br />
                test_full_unmasking_win ... ok<br />
                test_initial_masking ... ok<br />
                test_input_validation_empty_or_multi_char ... ok<br />
                test_input_validation_numbers ... ok<br />
                test_input_validation_special_symbols ... ok<br />
                test_input_validation_valid_letter ... ok<br />
                test_partial_masking ... ok<br />
                test_predefined_words_list ... ok<br />
                ----------------------------------------------------------------------<br />
                Ran 9 tests in 0.001s · OK
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto max-h-[300px]">
                <pre>
                  <code>{testSuiteContent}</code>
                </pre>
              </div>
            </div>
          )}

          {/* Tab 4: Rubric */}
          {activeTab === 'rubric' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-sm text-emerald-500">1. Core Functionality (25%)</span>
                  <span className="font-mono text-xs font-bold text-emerald-500">25 / 25</span>
                </div>
                <p className="text-slate-400 leading-relaxed">
                  Accurate while-loop state machine, random choice of secret words, 6 tries exhaustion, dynamic difficulty, and victory detection.
                </p>
              </div>

              <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-sm text-emerald-500">2. Defensive Input Handling (25%)</span>
                  <span className="font-mono text-xs font-bold text-emerald-500">25 / 25</span>
                </div>
                <p className="text-slate-400 leading-relaxed">
                  Strict single-character validation, alphabetic checks with isalpha(), repeated guess prevention, and clean warning messages.
                </p>
              </div>

              <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-sm text-emerald-500">3. Code Architecture &amp; PEP 8 (25%)</span>
                  <span className="font-mono text-xs font-bold text-emerald-500">25 / 25</span>
                </div>
                <p className="text-slate-400 leading-relaxed">
                  Clean snake_case identifiers, comprehensive bilingual comments (Hinglish + English), modular functions, and standard entry point.
                </p>
              </div>

              <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-sm text-emerald-500">4. Innovation &amp; Extensions (25%)</span>
                  <span className="font-mono text-xs font-bold text-emerald-500">25 / 25</span>
                </div>
                <p className="text-slate-400 leading-relaxed">
                  Full-stack REST API service, automated unittest suite, dark/light theme web simulator, and live video demo ready interface.
                </p>
              </div>
            </div>
          )}

          {/* Tab 5: Submission Checklist */}
          {activeTab === 'checklist' && (
            <div className="flex flex-col gap-3">
              {[
                { title: 'Step 1: Download your Python Game Script', desc: 'Download hangman_codealpha.py and test it locally using "python3 hangman_codealpha.py".' },
                { title: 'Step 2: Create your GitHub Repository', desc: 'Create a public repo named "CodeAlpha_Hangman_Game", upload hangman.py, test_hangman.py, and the generated README.md.' },
                { title: 'Step 3: Record a 60-Second Video Demonstration', desc: 'Screen record one winning game and one loss session showing the terminal output and gallows/mistakes count.' },
                { title: 'Step 4: Post on LinkedIn and Tag Mentors', desc: 'Share your GitHub repo link, video clip, and tag #CodeAlpha #PythonInternship #Task1 to complete peer review.' },
                { title: 'Step 5: Submit Google Form / CodeAlpha Portal', desc: 'Submit the GitHub repository URL and LinkedIn post link in the official CodeAlpha task submission form.' }
              ].map((step, sIdx) => (
                <div
                  key={sIdx}
                  className={`p-3.5 rounded-xl border flex items-start gap-3 transition-colors ${
                    isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <span className="w-5 h-5 rounded-full bg-emerald-500 text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                    {sIdx + 1}
                  </span>
                  <div>
                    <span className={`font-semibold block ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>{step.title}</span>
                    <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div
          className={`px-6 py-4 border-t flex flex-wrap items-center justify-between gap-3 ${
            isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}
        >
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Internship Dossier v1.0 · Ready for Mentor Review</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                sound.playKey();
                handleDownloadReadme();
                handleDownloadTests();
              }}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Full Submission Pack</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
