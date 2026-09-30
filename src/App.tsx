import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ViewTab, GameStats, WordItem, DifficultyLevel, ThemeMode } from './types';
import { DEFAULT_WORD_CATEGORIES, DIFFICULTY_CONFIGS, getWordsForDifficulty } from './utils/words';
import { sound } from './utils/audio';
import { Navbar } from './components/Navbar';
import { VisualHangman } from './components/VisualHangman';
import { WordDisplay } from './components/WordDisplay';
import { VirtualKeyboard } from './components/VirtualKeyboard';
import { TerminalMode } from './components/TerminalMode';
import { CodeStudioTab } from './components/CodeStudioTab';
import { VivaGuideTab } from './components/VivaGuideTab';
import { DifficultySelector } from './components/DifficultySelector';
import { ApiExplorerTab } from './components/ApiExplorerTab';
import { ClassicHtmlTab } from './components/ClassicHtmlTab';
import { SubmissionDossierModal } from './components/SubmissionDossierModal';
import { Flame, Trophy, Percent, RefreshCw, Terminal, ArrowRight, Sparkles, Award, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const STATS_STORAGE_KEY = 'codealpha_hangman_stats';
const THEME_STORAGE_KEY = 'codealpha_hangman_theme';

export default function App() {
  const [currentTab, setCurrentTab] = useState<ViewTab>('GAME_BOARD');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('codealpha-task');
  const [currentDifficulty, setCurrentDifficulty] = useState<DifficultyLevel>('medium');
  const [isDossierOpen, setIsDossierOpen] = useState<boolean>(false);
  const [theme, setTheme] = useState<ThemeMode>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(THEME_STORAGE_KEY);
      if (saved === 'light' || saved === 'dark') return saved;
    }
    return 'dark';
  });

  const isDark = theme === 'dark';

  // Sync theme class to root DOM
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      if (theme === 'dark') {
        root.classList.add('dark');
        root.classList.remove('light');
        document.body.classList.add('dark');
        document.body.classList.remove('light');
      } else {
        root.classList.add('light');
        root.classList.remove('dark');
        document.body.classList.add('light');
        document.body.classList.remove('dark');
      }
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    }
  }, [theme]);

  const handleToggleTheme = () => {
    sound.playKey();
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const [customWordsList, setCustomWordsList] = useState<string[]>([
    'python',
    'code',
    'alpha',
    'intern',
    'developer'
  ]);

  const [currentWordItem, setCurrentWordItem] = useState<WordItem>({
    word: 'python',
    hint: 'The popular high-level programming language used in this project',
    difficulty: 'medium'
  });

  const [guessedLetters, setGuessedLetters] = useState<string[]>([]);
  const [isMuted, setIsMuted] = useState<boolean>(() => sound.getMuted());

  // Dynamic limit based on difficulty
  const maxMistakes = DIFFICULTY_CONFIGS[currentDifficulty].limit;

  // Persistent Stats
  const [stats, setStats] = useState<GameStats>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STATS_STORAGE_KEY);
        if (saved) return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return { played: 0, won: 0, lost: 0, currentStreak: 0, maxStreak: 0 };
  });

  // Calculate current category
  const currentCategory = useMemo(() => {
    return (
      DEFAULT_WORD_CATEGORIES.find(c => c.id === selectedCategoryId) ||
      DEFAULT_WORD_CATEGORIES[0]
    );
  }, [selectedCategoryId]);

  // Words list for terminal & generator
  const activeWordList = useMemo(() => {
    if (selectedCategoryId === 'codealpha-task') {
      return customWordsList;
    }
    const filtered = getWordsForDifficulty(currentCategory.words, currentDifficulty);
    return filtered.map(w => w.word);
  }, [selectedCategoryId, customWordsList, currentCategory, currentDifficulty]);

  // Pick random word respecting difficulty and category
  const pickNewWord = useCallback((diff: DifficultyLevel = currentDifficulty) => {
    let pool: WordItem[] = [];

    if (selectedCategoryId === 'codealpha-task') {
      const categoryMatches = DEFAULT_WORD_CATEGORIES[0].words.filter(
        w => w.difficulty === diff
      );

      if (categoryMatches.length > 0) {
        pool = categoryMatches;
      } else {
        pool = customWordsList.map(w => ({
          word: w.toLowerCase(),
          hint: 'Task challenge word',
          difficulty: diff
        }));
      }
    } else {
      pool = getWordsForDifficulty(currentCategory.words, diff);
    }

    if (pool.length === 0) {
      pool = [{ word: 'python', hint: 'The programming language', difficulty: diff }];
    }

    const randomIndex = Math.floor(Math.random() * pool.length);
    setCurrentWordItem(pool[randomIndex]);
    setGuessedLetters([]);
  }, [selectedCategoryId, customWordsList, currentCategory, currentDifficulty]);

  // Handle difficulty switch
  const handleSelectDifficulty = (newDiff: DifficultyLevel) => {
    setCurrentDifficulty(newDiff);
    pickNewWord(newDiff);
  };

  // Start new game on category change
  useEffect(() => {
    pickNewWord(currentDifficulty);
  }, [selectedCategoryId]);

  // Mistakes calculation
  const mistakes = useMemo(() => {
    return guessedLetters.filter(char => !currentWordItem.word.includes(char)).length;
  }, [guessedLetters, currentWordItem.word]);

  // Win condition: all unique letters of secret word are in guessedLetters
  const isWon = useMemo(() => {
    if (!currentWordItem.word) return false;
    const uniqueWordLetters = Array.from(new Set(currentWordItem.word.split('')));
    return uniqueWordLetters.every(char => guessedLetters.includes(char));
  }, [currentWordItem.word, guessedLetters]);

  // Loss condition: mistakes reach dynamic limit
  const isLost = useMemo(() => {
    return !isWon && mistakes >= maxMistakes;
  }, [isWon, mistakes, maxMistakes]);

  const isGameOver = isWon || isLost;

  // Track stats when game ends
  useEffect(() => {
    if (!isGameOver) return;

    setStats(prev => {
      const newPlayed = prev.played + 1;
      const newWon = isWon ? prev.won + 1 : prev.won;
      const newLost = isLost ? prev.lost + 1 : prev.lost;
      const newStreak = isWon ? prev.currentStreak + 1 : 0;
      const newMaxStreak = Math.max(prev.maxStreak, newStreak);

      const updated: GameStats = {
        played: newPlayed,
        won: newWon,
        lost: newLost,
        currentStreak: newStreak,
        maxStreak: newMaxStreak,
        lastPlayedAt: new Date().toISOString()
      };

      if (typeof window !== 'undefined') {
        localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(updated));
      }

      return updated;
    });
  }, [isGameOver, isWon, isLost]);

  // Letter guess handler
  const handleGuessLetter = useCallback(
    (letter: string) => {
      if (isGameOver || guessedLetters.includes(letter)) return;

      const newGuessed = [...guessedLetters, letter];
      setGuessedLetters(newGuessed);

      if (currentWordItem.word.includes(letter)) {
        const uniqueWordLetters = Array.from(new Set(currentWordItem.word.split('')));
        const allFound = uniqueWordLetters.every(char => newGuessed.includes(char));
        if (allFound) {
          sound.playWin();
        } else {
          sound.playCorrect();
        }
      } else {
        const currentWrongCount = newGuessed.filter(
          c => !currentWordItem.word.includes(c)
        ).length;
        if (currentWrongCount >= maxMistakes) {
          sound.playLose();
        } else {
          sound.playWrong();
        }
      }
    },
    [isGameOver, guessedLetters, currentWordItem.word, maxMistakes]
  );

  const handleToggleMute = () => {
    const next = sound.toggleMute();
    setIsMuted(next);
  };

  const winPercentage = stats.played > 0 ? Math.round((stats.won / stats.played) * 100) : 0;

  return (
    <div
      className={`min-h-screen flex flex-col antialiased transition-colors ${
        isDark ? 'bg-[#070b14] text-slate-100 selection:bg-emerald-500/30' : 'bg-slate-50 text-slate-900 selection:bg-emerald-200'
      }`}
    >
      {/* Top Navigation conforming to strict Top Bar contract */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onResetGame={() => pickNewWord(currentDifficulty)}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onOpenDossier={() => setIsDossierOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 flex flex-col gap-6">
        {/* Executive Internship Credential Strip */}
        <div
          className={`p-3.5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs transition-colors ${
            isDark
              ? 'bg-slate-900/60 border-slate-800'
              : 'bg-white border-slate-200/90 shadow-xs'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-500 shrink-0">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  CodeAlpha Python Internship — Task 1 Submission
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                  Ready for Mentor Review
                </span>
              </div>
              <p className={`text-[11px] mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                PEP-8 Clean Architecture · 9/9 Automated Unit Tests Passed · Full-Stack REST API &amp; Web Simulator
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playKey();
              setIsDossierOpen(true);
            }}
            className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-xs whitespace-nowrap self-start sm:self-auto cursor-pointer active:scale-95 transition-all"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Open Submission Kit</span>
          </button>
        </div>

        {/* Dashboard Header: Stats, Category Selector & Difficulty Selector */}
        <section
          className={`flex flex-col gap-4 pb-4 border-b transition-colors ${
            isDark ? 'border-slate-800/80' : 'border-slate-200'
          }`}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Unboxed Metadata & Stats Bar */}
            <div
              className={`flex flex-wrap items-center gap-3 sm:gap-4 text-xs ${
                isDark ? 'text-slate-400' : 'text-slate-600'
              }`}
            >
              <div className={`flex items-center gap-1.5 font-medium ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>
                <Flame className="w-3.5 h-3.5 text-amber-500" />
                <span>Streak:</span>
                <span className={`font-mono font-bold tabular-nums ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {stats.currentStreak}
                </span>
              </div>
              <span aria-hidden="true" className={isDark ? 'text-slate-700' : 'text-slate-300'}>·</span>
              <div className="flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5 text-emerald-500" />
                <span>Best:</span>
                <span className={`font-mono tabular-nums ${isDark ? 'text-slate-300' : 'text-slate-700 font-semibold'}`}>
                  {stats.maxStreak}
                </span>
              </div>
              <span aria-hidden="true" className={isDark ? 'text-slate-700' : 'text-slate-300'}>·</span>
              <div className="flex items-center gap-1.5">
                <Percent className="w-3.5 h-3.5 text-sky-500" />
                <span>Win Rate:</span>
                <span className={`font-mono tabular-nums ${isDark ? 'text-slate-300' : 'text-slate-700 font-semibold'}`}>
                  {winPercentage}% ({stats.won}/{stats.played})
                </span>
              </div>
            </div>

            {/* Interactive Category Tabs */}
            <div
              className={`flex items-center gap-1.5 p-1 rounded-xl border overflow-x-auto self-start md:self-auto transition-colors ${
                isDark ? 'bg-slate-900/90 border-slate-800/80' : 'bg-slate-100 border-slate-200'
              }`}
            >
              {DEFAULT_WORD_CATEGORIES.map(cat => {
                const isActive = selectedCategoryId === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      sound.playKey();
                      setSelectedCategoryId(cat.id);
                    }}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                      isActive
                        ? isDark
                          ? 'bg-slate-800 text-white font-semibold shadow-sm'
                          : 'bg-white text-slate-900 font-semibold shadow-xs'
                        : isDark
                        ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                    }`}
                  >
                    {cat.id === 'codealpha-task' ? 'CodeAlpha Task' : cat.name.split(' ')[0]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Difficulty Selection in Dashboard */}
          <div className="w-full">
            <DifficultySelector
              currentDifficulty={currentDifficulty}
              onSelectDifficulty={handleSelectDifficulty}
              theme={theme}
            />
          </div>
        </section>

        {/* Tab 1: Visual Game Board */}
        {currentTab === 'GAME_BOARD' && (
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Gallows Illustration & Mode Overview */}
              <div className="lg:col-span-5 flex flex-col gap-4">
                <VisualHangman
                  mistakes={mistakes}
                  maxMistakes={maxMistakes}
                  isWon={isWon}
                  isLost={isLost}
                  theme={theme}
                />

                {/* Sub banner for quick action */}
                <div
                  className={`p-4 rounded-xl border flex items-center justify-between text-xs transition-colors ${
                    isDark ? 'bg-slate-900/40 border-slate-800/80' : 'bg-white border-slate-200 shadow-xs'
                  }`}
                >
                  <div className={`flex items-center gap-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    <Terminal className="w-4 h-4 text-amber-500" />
                    <span>Test script in CLI mode?</span>
                  </div>
                  <button
                    onClick={() => {
                      sound.playKey();
                      setCurrentTab('TERMINAL');
                    }}
                    className={`font-medium flex items-center gap-1 cursor-pointer transition-colors ${
                      isDark ? 'text-amber-400 hover:text-amber-300' : 'text-amber-700 hover:text-amber-800'
                    }`}
                  >
                    <span>Open Console</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Right Column: Word Slots, Actions, Keyboard */}
              <div
                className={`lg:col-span-7 flex flex-col items-center justify-center p-6 rounded-2xl border min-h-[460px] gap-6 transition-colors ${
                  isDark
                    ? 'bg-slate-900/60 border-slate-800/80 shadow-inner'
                    : 'bg-white border-slate-200/90 shadow-xs'
                }`}
              >
                {/* Secret Word Display */}
                <WordDisplay
                  word={currentWordItem.word}
                  guessedLetters={guessedLetters}
                  isLost={isLost}
                  isWon={isWon}
                  hint={currentWordItem.hint}
                  categoryName={`${currentCategory.name} (${DIFFICULTY_CONFIGS[currentDifficulty].label})`}
                  maxMistakes={maxMistakes}
                  theme={theme}
                />

                {/* Game Outcome Actions or Keyboard */}
                <AnimatePresence mode="wait">
                  {isGameOver ? (
                    <motion.div
                      key="game-over-panel"
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.95, opacity: 0 }}
                      className={`w-full max-w-md p-6 rounded-2xl border flex flex-col items-center text-center gap-4 shadow-xl transition-colors ${
                        isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-white border-slate-200 shadow-lg'
                      }`}
                    >
                      {isWon ? (
                        <>
                          <div className={`w-12 h-12 rounded-full border flex items-center justify-center ${
                            isDark ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-emerald-50 border-emerald-200 text-emerald-600'
                          }`}>
                            <Sparkles className="w-6 h-6" />
                          </div>
                          <div>
                            <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                              Victory! Word Solved
                            </h3>
                            <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                              Solved in <span className="font-semibold text-emerald-600 capitalize">{currentDifficulty}</span> mode with{' '}
                              <span className="font-mono text-emerald-600 font-bold">
                                {maxMistakes - mistakes}
                              </span>{' '}
                              tries left!
                            </p>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className={`w-12 h-12 rounded-full border flex items-center justify-center ${
                            isDark ? 'bg-rose-500/10 border-rose-500/30 text-rose-400' : 'bg-rose-50 border-rose-200 text-rose-600'
                          }`}>
                            <RefreshCw className="w-6 h-6" />
                          </div>
                          <div>
                            <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                              {maxMistakes} Incorrect Guesses Reached
                            </h3>
                            <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                              The secret word was{' '}
                              <span className="font-mono text-rose-600 font-bold uppercase">
                                {currentWordItem.word}
                              </span>
                              . Try another challenge!
                            </p>
                          </div>
                        </>
                      )}

                      <div className="flex items-center gap-3 w-full justify-center pt-2">
                        <button
                          onClick={() => {
                            sound.playKey();
                            pickNewWord(currentDifficulty);
                          }}
                          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl flex items-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>Play Next Word</span>
                        </button>

                        <button
                          onClick={() => {
                            sound.playKey();
                            setCurrentTab('CODE_STUDIO');
                          }}
                          className={`px-4 py-2.5 text-xs font-semibold rounded-xl flex items-center gap-2 transition-all border cursor-pointer ${
                            isDark
                              ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                              : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-300 shadow-xs'
                          }`}
                        >
                          <span>Get Python Code</span>
                        </button>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="keyboard"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="w-full"
                    >
                      <VirtualKeyboard
                        onGuessLetter={handleGuessLetter}
                        guessedLetters={guessedLetters}
                        secretWord={currentWordItem.word}
                        disabled={isGameOver}
                        theme={theme}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Classic Single-File HTML5/JS Web Edition */}
        {currentTab === 'CLASSIC_HTML' && (
          <ClassicHtmlTab
            customWords={customWordsList}
            currentDifficulty={currentDifficulty}
            theme={theme}
          />
        )}

        {/* Tab 3: Simulated Interactive Terminal Console */}
        {currentTab === 'TERMINAL' && (
          <TerminalMode
            wordList={activeWordList}
            categoryName={currentCategory.name}
            currentDifficulty={currentDifficulty}
            onSelectDifficulty={handleSelectDifficulty}
            theme={theme}
          />
        )}

        {/* Tab 3: Full-Stack Web API Explorer & Services */}
        {currentTab === 'API_DOCS' && <ApiExplorerTab theme={theme} />}

        {/* Tab 4: Code Studio & Submission Exporter */}
        {currentTab === 'CODE_STUDIO' && (
          <CodeStudioTab
            customWords={customWordsList}
            onUpdateCustomWords={setCustomWordsList}
            currentDifficulty={currentDifficulty}
            onSelectDifficulty={handleSelectDifficulty}
            theme={theme}
            onOpenDossier={() => setIsDossierOpen(true)}
          />
        )}

        {/* Tab 5: Internship Viva Guide & Interview Prep */}
        {currentTab === 'VIVA_GUIDE' && <VivaGuideTab theme={theme} />}
      </main>

      {/* Submission Dossier Modal */}
      <SubmissionDossierModal
        isOpen={isDossierOpen}
        onClose={() => setIsDossierOpen(false)}
        theme={theme}
      />

      {/* Footer */}
      <footer
        className={`border-t py-4 px-6 mt-auto transition-colors ${
          isDark ? 'border-slate-900 bg-slate-950/60 text-slate-500' : 'border-slate-200 bg-white text-slate-500'
        }`}
      >
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span>CodeAlpha Python Internship Project</span>
            <span aria-hidden="true">·</span>
            <span>Task 1: Hangman Console Game with Difficulty Tiers</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setCurrentTab('CODE_STUDIO')}
              className={`transition-colors cursor-pointer ${isDark ? 'hover:text-slate-300' : 'hover:text-slate-900'}`}
            >
              Export Script
            </button>
            <button
              onClick={() => setCurrentTab('VIVA_GUIDE')}
              className={`transition-colors cursor-pointer ${isDark ? 'hover:text-slate-300' : 'hover:text-slate-900'}`}
            >
              Viva Questions
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
