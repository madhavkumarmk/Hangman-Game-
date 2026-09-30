import React, { useState, useEffect, useRef } from 'react';
import { TerminalLine, DifficultyLevel, ThemeMode } from '../types';
import { Terminal, Send, RotateCcw, Trash2, CheckCircle2, Play, Shield, Zap, Flame } from 'lucide-react';
import { sound } from '../utils/audio';
import { DIFFICULTY_CONFIGS } from '../utils/words';

interface TerminalModeProps {
  wordList: string[];
  categoryName: string;
  currentDifficulty: DifficultyLevel;
  onSelectDifficulty: (difficulty: DifficultyLevel) => void;
  theme?: ThemeMode;
}

export const TerminalMode: React.FC<TerminalModeProps> = ({
  wordList,
  categoryName,
  currentDifficulty,
  onSelectDifficulty,
  theme = 'dark'
}) => {
  const isDark = theme === 'dark';
  const [secretWord, setSecretWord] = useState<string>('');
  const [guessedLetters, setGuessedLetters] = useState<string[]>([]);
  const [incorrectGuesses, setIncorrectGuesses] = useState<number>(0);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [history, setHistory] = useState<TerminalLine[]>([]);
  const [inputVal, setInputVal] = useState<string>('');
  const terminalEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const INCORRECT_LIMIT = DIFFICULTY_CONFIGS[currentDifficulty].limit;

  // Initialize a new game session
  const initGame = () => {
    const chosen = wordList[Math.floor(Math.random() * wordList.length)].toLowerCase();
    setSecretWord(chosen);
    setGuessedLetters([]);
    setIncorrectGuesses(0);
    setGameOver(false);
    setInputVal('');

    const initialDisplay = chosen.split('').map(() => '_').join(' ');
    const diffConfig = DIFFICULTY_CONFIGS[currentDifficulty];

    const newHistory: TerminalLine[] = [
      { id: '1', text: `$ python3 hangman_codealpha.py --difficulty=${currentDifficulty}`, type: 'prompt' },
      { id: '2', text: 'Welcome to Hangman Game by CodeAlpha!', type: 'system' },
      { id: '3', text: `Mode: ${diffConfig.label.toUpperCase()} (${diffConfig.limit} incorrect guesses limit · ${diffConfig.wordComplexity})`, type: 'info' },
      { id: '4', text: '---------------------------------------------------------', type: 'divider' },
      { id: '5', text: `Word: ${initialDisplay}`, type: 'info' },
      { id: '6', text: `Incorrect guesses left: ${diffConfig.limit}`, type: 'info' }
    ];

    setHistory(newHistory);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  useEffect(() => {
    initGame();
  }, [wordList, currentDifficulty]);

  // Auto scroll to bottom
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (gameOver) return;

    const rawGuess = inputVal.trim();
    if (!rawGuess) return;

    sound.playKey();
    const guess = rawGuess.toLowerCase();
    setInputVal('');

    const newLines: TerminalLine[] = [
      { id: `input-${Date.now()}`, text: `Guess a letter: ${rawGuess}`, type: 'input' }
    ];

    // Validation 1: Single alphabet letter
    if (guess.length !== 1 || !/^[a-zA-Z]$/.test(guess)) {
      newLines.push({
        id: `err-${Date.now()}`,
        text: 'Please enter a single valid alphabet letter.',
        type: 'error'
      });
      setHistory(prev => [...prev, ...newLines]);
      return;
    }

    // Validation 2: Already guessed
    if (guessedLetters.includes(guess)) {
      newLines.push({
        id: `dup-${Date.now()}`,
        text: 'You have already guessed that letter. Try a different one.',
        type: 'error'
      });
      setHistory(prev => [...prev, ...newLines]);
      return;
    }

    // New letter
    const updatedGuessed = [...guessedLetters, guess];
    setGuessedLetters(updatedGuessed);

    let updatedIncorrect = incorrectGuesses;
    let isCorrect = false;

    if (secretWord.includes(guess)) {
      isCorrect = true;
      sound.playCorrect();
      newLines.push({
        id: `suc-${Date.now()}`,
        text: `Good job! '${guess}' is in the word.`,
        type: 'success'
      });
    } else {
      updatedIncorrect += 1;
      setIncorrectGuesses(updatedIncorrect);
      sound.playWrong();
      newLines.push({
        id: `wrong-${Date.now()}`,
        text: `Wrong guess! '${guess}' is not in the word.`,
        type: 'error'
      });
    }

    // Build masked word
    let displayWord = '';
    for (const letter of secretWord) {
      if (updatedGuessed.includes(letter)) {
        displayWord += letter + ' ';
      } else {
        displayWord += '_ ';
      }
    }

    newLines.push({
      id: `w-${Date.now()}`,
      text: `Word: ${displayWord.trim()}`,
      type: 'info'
    });

    const guessesLeft = INCORRECT_LIMIT - updatedIncorrect;
    newLines.push({
      id: `left-${Date.now()}`,
      text: `Incorrect guesses left: ${Math.max(0, guessesLeft)}`,
      type: 'info'
    });

    // Check Win
    if (!displayWord.includes('_')) {
      sound.playWin();
      setGameOver(true);
      newLines.push({
        id: `win-${Date.now()}`,
        text: `\nCongratulations! You guessed the word correctly: ${secretWord}`,
        type: 'success'
      });
      newLines.push({
        id: `prompt-end-${Date.now()}`,
        text: '$ Process exited with status 0 (Success)',
        type: 'system'
      });
    }
    // Check Lose
    else if (updatedIncorrect >= INCORRECT_LIMIT) {
      sound.playLose();
      setGameOver(true);
      newLines.push({
        id: `loss-1-${Date.now()}`,
        text: '\nGame Over! You ran out of incorrect guesses.',
        type: 'error'
      });
      newLines.push({
        id: `loss-2-${Date.now()}`,
        text: `The secret word was: ${secretWord}`,
        type: 'info'
      });
      newLines.push({
        id: `prompt-end-${Date.now()}`,
        text: '$ Process exited with status 1 (Exhausted guesses)',
        type: 'system'
      });
    }

    setHistory(prev => [...prev, ...newLines]);
  };

  const handleQuickKey = (char: string) => {
    if (gameOver) return;
    setInputVal(char);
    setTimeout(() => {
      // Auto submit on tap
      sound.playKey();
      const guess = char.toLowerCase();
      const newLines: TerminalLine[] = [
        { id: `input-${Date.now()}`, text: `Guess a letter: ${char}`, type: 'input' }
      ];

      if (guessedLetters.includes(guess)) {
        newLines.push({
          id: `dup-${Date.now()}`,
          text: 'You have already guessed that letter. Try a different one.',
          type: 'error'
        });
        setHistory(prev => [...prev, ...newLines]);
        return;
      }

      const updatedGuessed = [...guessedLetters, guess];
      setGuessedLetters(updatedGuessed);

      let updatedIncorrect = incorrectGuesses;
      if (secretWord.includes(guess)) {
        sound.playCorrect();
        newLines.push({
          id: `suc-${Date.now()}`,
          text: `Good job! '${guess}' is in the word.`,
          type: 'success'
        });
      } else {
        updatedIncorrect += 1;
        setIncorrectGuesses(updatedIncorrect);
        sound.playWrong();
        newLines.push({
          id: `wrong-${Date.now()}`,
          text: `Wrong guess! '${guess}' is not in the word.`,
          type: 'error'
        });
      }

      let displayWord = '';
      for (const letter of secretWord) {
        if (updatedGuessed.includes(letter)) {
          displayWord += letter + ' ';
        } else {
          displayWord += '_ ';
        }
      }

      newLines.push({
        id: `w-${Date.now()}`,
        text: `Word: ${displayWord.trim()}`,
        type: 'info'
      });

      const guessesLeft = INCORRECT_LIMIT - updatedIncorrect;
      newLines.push({
        id: `left-${Date.now()}`,
        text: `Incorrect guesses left: ${Math.max(0, guessesLeft)}`,
        type: 'info'
      });

      if (!displayWord.includes('_')) {
        sound.playWin();
        setGameOver(true);
        newLines.push({
          id: `win-${Date.now()}`,
          text: `\nCongratulations! You guessed the word correctly: ${secretWord}`,
          type: 'success'
        });
      } else if (updatedIncorrect >= INCORRECT_LIMIT) {
        sound.playLose();
        setGameOver(true);
        newLines.push({
          id: `loss-1-${Date.now()}`,
          text: '\nGame Over! You ran out of incorrect guesses.',
          type: 'error'
        });
        newLines.push({
          id: `loss-2-${Date.now()}`,
          text: `The secret word was: ${secretWord}`,
          type: 'info'
        });
      }

      setHistory(prev => [...prev, ...newLines]);
      setInputVal('');
    }, 50);
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-4">
      {/* Terminal Window Frame */}
      <div
        className={`rounded-2xl border overflow-hidden flex flex-col transition-colors ${
          isDark
            ? 'bg-[#0b101b] border-slate-800 shadow-2xl'
            : 'bg-white border-slate-300 shadow-xl'
        }`}
      >
        {/* Terminal Header */}
        <div
          className={`px-4 py-3 border-b flex items-center justify-between transition-colors ${
            isDark
              ? 'bg-slate-900/90 border-slate-800'
              : 'bg-slate-100 border-slate-200'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
            <span
              className={`text-xs font-mono ml-2 ${
                isDark ? 'text-slate-400' : 'text-slate-700 font-medium'
              }`}
            >
              python3 hangman.py · {categoryName}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Difficulty Selector in Terminal */}
            <div
              className={`hidden md:flex items-center gap-1 p-0.5 rounded-lg border text-[11px] font-mono ${
                isDark ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
              }`}
            >
              {(['easy', 'medium', 'hard'] as DifficultyLevel[]).map((lvl) => {
                const isAct = currentDifficulty === lvl;
                return (
                  <button
                    key={lvl}
                    onClick={() => {
                      sound.playKey();
                      onSelectDifficulty(lvl);
                    }}
                    className={`px-2 py-0.5 rounded transition-all capitalize ${
                      isAct
                        ? 'bg-slate-800 text-white font-semibold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {lvl} ({DIFFICULTY_CONFIGS[lvl].limit})
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => {
                sound.playKey();
                const diffConfig = DIFFICULTY_CONFIGS[currentDifficulty];
                setHistory([
                  { id: '1', text: `$ python3 hangman_codealpha.py --difficulty=${currentDifficulty}`, type: 'prompt' },
                  { id: '2', text: 'Welcome to Hangman Game by CodeAlpha!', type: 'system' },
                  { id: '3', text: `Mode: ${diffConfig.label.toUpperCase()} (${diffConfig.limit} incorrect guesses limit · ${diffConfig.wordComplexity})`, type: 'info' },
                  { id: '4', text: '---------------------------------------------------------', type: 'divider' },
                  { id: '5', text: `Word: ${secretWord.split('').map(l => guessedLetters.includes(l) ? l : '_').join(' ')}`, type: 'info' },
                  { id: '6', text: `Incorrect guesses left: ${INCORRECT_LIMIT - incorrectGuesses}`, type: 'info' }
                ]);
              }}
              className="text-xs text-slate-400 hover:text-slate-200 p-1.5 rounded hover:bg-slate-800 transition-colors flex items-center gap-1"
              title="Clear screen buffer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Clear</span>
            </button>
            <button
              onClick={() => {
                sound.playKey();
                initGame();
              }}
              className="text-xs text-emerald-400 hover:text-emerald-300 p-1.5 rounded hover:bg-emerald-950/40 transition-colors flex items-center gap-1 font-mono font-medium"
              title="Restart game script"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restart Script</span>
            </button>
          </div>
        </div>

        {/* Terminal Screen Body */}
        <div className="p-4 sm:p-6 font-mono text-xs sm:text-sm min-h-[360px] max-h-[460px] overflow-y-auto terminal-scroll flex flex-col gap-1.5 leading-relaxed bg-[#060a12]">
          {history.map((line) => {
            if (line.type === 'system') {
              return (
                <div key={line.id} className="text-emerald-400 font-semibold">
                  {line.text}
                </div>
              );
            }
            if (line.type === 'divider') {
              return (
                <div key={line.id} className="text-slate-600">
                  {line.text}
                </div>
              );
            }
            if (line.type === 'prompt') {
              return (
                <div key={line.id} className="text-sky-400 flex items-center gap-1.5">
                  <span className="text-emerald-500">➜</span>
                  <span>{line.text}</span>
                </div>
              );
            }
            if (line.type === 'input') {
              return (
                <div key={line.id} className="text-slate-200">
                  <span className="text-amber-400">Guess a letter: </span>
                  <span className="font-bold underline text-white">
                    {line.text.replace('Guess a letter: ', '')}
                  </span>
                </div>
              );
            }
            if (line.type === 'error') {
              return (
                <div key={line.id} className="text-rose-400">
                  {line.text}
                </div>
              );
            }
            if (line.type === 'success') {
              return (
                <div key={line.id} className="text-emerald-300 font-semibold">
                  {line.text}
                </div>
              );
            }
            return (
              <div key={line.id} className="text-slate-300">
                {line.text}
              </div>
            );
          })}

          <div ref={terminalEndRef} />
        </div>

        {/* Input Bar */}
        <div
          className={`p-3 border-t transition-colors ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}
        >
          {!gameOver ? (
            <form onSubmit={handleSubmit} className="flex items-center gap-2">
              <span className="text-emerald-500 font-mono text-sm hidden sm:inline font-bold">
                &gt;&gt;&gt;
              </span>
              <span
                className={`font-mono text-xs sm:text-sm whitespace-nowrap ${
                  isDark ? 'text-slate-400' : 'text-slate-700 font-medium'
                }`}
              >
                Guess a letter:
              </span>
              <input
                ref={inputRef}
                type="text"
                maxLength={1}
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="a-z"
                className={`w-16 px-3 py-1.5 border rounded-lg font-mono text-center font-bold text-base focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-colors ${
                  isDark
                    ? 'bg-slate-950 border-slate-700 text-white'
                    : 'bg-white border-slate-300 text-slate-900'
                }`}
                autoFocus
              />
              <button
                type="submit"
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg font-mono flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs active:scale-95"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Enter</span>
              </button>
            </form>
          ) : (
            <div className="flex items-center justify-between">
              <span
                className={`text-xs font-mono ${
                  isDark ? 'text-slate-400' : 'text-slate-600'
                }`}
              >
                Session ended. Run script again to play another round.
              </span>
              <button
                onClick={() => {
                  sound.playKey();
                  initGame();
                }}
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg font-mono flex items-center gap-1.5 transition-colors shadow-xs active:scale-95 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Run hangman.py Again</span>
              </button>
            </div>
          )}

          {/* Quick-Letter Bar */}
          {!gameOver && (
            <div className="mt-3 pt-3 border-t border-slate-800/80 flex flex-wrap items-center gap-1">
              <span className="text-[11px] font-mono text-slate-500 mr-1 hidden sm:inline">
                Quick click:
              </span>
              {'abcdefghijklmnopqrstuvwxyz'.split('').map((char) => {
                const isGuessed = guessedLetters.includes(char);
                return (
                  <button
                    key={char}
                    type="button"
                    onClick={() => handleQuickKey(char)}
                    disabled={isGuessed}
                    className={`w-7 h-7 rounded text-xs font-mono font-medium transition-all ${
                      isGuessed
                        ? 'bg-slate-950 text-slate-700 cursor-not-allowed line-through'
                        : 'bg-slate-800 text-slate-200 hover:bg-slate-700 active:scale-95'
                    }`}
                  >
                    {char}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
