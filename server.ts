import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface GameSession {
  gameId: string;
  secretWord: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  guessedLetters: string[];
  mistakesCount: number;
  maxMistakes: number;
  status: 'PLAYING' | 'WON' | 'LOST';
  hint: string;
  createdAt: number;
}

const DIFFICULTY_SETTINGS = {
  easy: { limit: 8, complexity: 'Short & Simple' },
  medium: { limit: 6, complexity: 'CodeAlpha Standard' },
  hard: { limit: 4, complexity: 'Advanced & Complex' }
};

const WORDS_DATABASE = [
  // Easy
  { word: 'code', hint: 'Instructions written in a programming language', category: 'codealpha-task', difficulty: 'easy' },
  { word: 'byte', hint: 'Unit of digital data consisting of 8 bits', category: 'codealpha-task', difficulty: 'easy' },
  { word: 'loop', hint: 'Repeats a block of code until condition is met', category: 'codealpha-task', difficulty: 'easy' },
  { word: 'data', hint: 'Raw facts and symbols processed by computer', category: 'codealpha-task', difficulty: 'easy' },
  { word: 'list', hint: 'Ordered mutable collection in Python', category: 'python-core', difficulty: 'easy' },
  { word: 'file', hint: 'Resource stored on disk opened via open()', category: 'python-core', difficulty: 'easy' },
  // Medium
  { word: 'python', hint: 'High-level programming language', category: 'codealpha-task', difficulty: 'medium' },
  { word: 'alpha', hint: 'First Greek letter and brand name', category: 'codealpha-task', difficulty: 'medium' },
  { word: 'intern', hint: 'Trainee learning in industry', category: 'codealpha-task', difficulty: 'medium' },
  { word: 'script', hint: 'Automated program code file', category: 'codealpha-task', difficulty: 'medium' },
  { word: 'syntax', hint: 'Language rules of code structure', category: 'python-core', difficulty: 'medium' },
  { word: 'module', hint: 'Importable Python file (.py)', category: 'python-core', difficulty: 'medium' },
  // Hard
  { word: 'developer', hint: 'Software engineer building applications', category: 'codealpha-task', difficulty: 'hard' },
  { word: 'internship', hint: 'Practical training program at a company', category: 'codealpha-task', difficulty: 'hard' },
  { word: 'algorithm', hint: 'Step-by-step problem solving procedure', category: 'software-eng', difficulty: 'hard' },
  { word: 'framework', hint: 'Foundation architecture for software apps', category: 'software-eng', difficulty: 'hard' },
  { word: 'debugging', hint: 'Locating and fixing computer bugs', category: 'software-eng', difficulty: 'hard' },
  { word: 'asynchronous', hint: 'Non-blocking concurrent execution flow', category: 'software-eng', difficulty: 'hard' }
];

const sessions = new Map<string, GameSession>();

// Cleanup stale sessions after 2 hours
setInterval(() => {
  const twoHoursAgo = Date.now() - 2 * 60 * 60 * 1000;
  for (const [id, session] of sessions.entries()) {
    if (session.createdAt < twoHoursAgo) {
      sessions.delete(id);
    }
  }
}, 15 * 60 * 1000);

function buildMaskedWord(secretWord: string, guessedLetters: string[]): string {
  return secretWord
    .split('')
    .map(letter => (guessedLetters.includes(letter.toLowerCase()) ? letter : '_'))
    .join(' ');
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // ==========================================
  // REST API Routes
  // ==========================================

  // 1. Health Check
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({
      status: 'ok',
      service: 'CodeAlpha Hangman API',
      version: '1.0.0',
      activeSessions: sessions.size,
      timestamp: new Date().toISOString()
    });
  });

  // 2. Words & Categories Info
  app.get('/api/words', (req: Request, res: Response) => {
    const { category, difficulty } = req.query;
    let filtered = WORDS_DATABASE;

    if (category) {
      filtered = filtered.filter(w => w.category === category);
    }
    if (difficulty) {
      filtered = filtered.filter(w => w.difficulty === difficulty);
    }

    res.json({
      count: filtered.length,
      difficultySettings: DIFFICULTY_SETTINGS,
      categories: ['codealpha-task', 'python-core', 'software-eng'],
      words: filtered.map(w => ({
        wordLength: w.word.length,
        hint: w.hint,
        category: w.category,
        difficulty: w.difficulty
      }))
    });
  });

  // 3. Start New Game
  app.post('/api/game/new', (req: Request, res: Response) => {
    const { difficulty = 'medium', category = 'codealpha-task' } = req.body;
    const validDifficulty = (['easy', 'medium', 'hard'].includes(difficulty) ? difficulty : 'medium') as 'easy' | 'medium' | 'hard';

    let pool = WORDS_DATABASE.filter(
      w => w.difficulty === validDifficulty && (category ? w.category === category : true)
    );

    if (pool.length === 0) {
      pool = WORDS_DATABASE.filter(w => w.difficulty === validDifficulty);
    }
    if (pool.length === 0) {
      pool = WORDS_DATABASE;
    }

    const selected = pool[Math.floor(Math.random() * pool.length)];
    const gameId = 'game_' + Math.random().toString(36).substring(2, 10);
    const maxMistakes = DIFFICULTY_SETTINGS[validDifficulty].limit;

    const newSession: GameSession = {
      gameId,
      secretWord: selected.word.toLowerCase(),
      category: selected.category,
      difficulty: validDifficulty,
      guessedLetters: [],
      mistakesCount: 0,
      maxMistakes,
      status: 'PLAYING',
      hint: selected.hint,
      createdAt: Date.now()
    };

    sessions.set(gameId, newSession);

    res.status(201).json({
      gameId,
      status: 'PLAYING',
      difficulty: validDifficulty,
      maxMistakes,
      mistakesRemaining: maxMistakes,
      wordLength: selected.word.length,
      maskedWord: buildMaskedWord(selected.word, []),
      hint: selected.hint,
      category: selected.category
    });
  });

  // 4. Submit Guess
  app.post('/api/game/guess', (req: Request, res: Response) => {
    const { gameId, letter } = req.body;

    if (!gameId || typeof gameId !== 'string') {
      res.status(400).json({ error: 'Missing or invalid gameId parameter.' });
      return;
    }

    const session = sessions.get(gameId);
    if (!session) {
      res.status(404).json({ error: 'Game session not found or expired. Please start a new game via POST /api/game/new.' });
      return;
    }

    if (session.status !== 'PLAYING') {
      res.status(400).json({
        error: `Game has already ended with status: ${session.status}`,
        status: session.status,
        secretWord: session.secretWord
      });
      return;
    }

    if (!letter || typeof letter !== 'string' || letter.trim().length !== 1 || !/^[a-zA-Z]$/.test(letter)) {
      res.status(400).json({ error: 'Input must be exactly one alphabetic character (a-z).' });
      return;
    }

    const char = letter.trim().toLowerCase();

    if (session.guessedLetters.includes(char)) {
      res.status(400).json({
        error: `Letter '${char}' has already been guessed.`,
        guessedLetters: session.guessedLetters,
        maskedWord: buildMaskedWord(session.secretWord, session.guessedLetters)
      });
      return;
    }

    session.guessedLetters.push(char);
    const isCorrect = session.secretWord.includes(char);

    if (!isCorrect) {
      session.mistakesCount += 1;
    }

    const maskedWord = buildMaskedWord(session.secretWord, session.guessedLetters);
    const hasUnderscores = maskedWord.includes('_');

    if (!hasUnderscores) {
      session.status = 'WON';
    } else if (session.mistakesCount >= session.maxMistakes) {
      session.status = 'LOST';
    }

    const responsePayload: Record<string, unknown> = {
      gameId: session.gameId,
      letter: char,
      isCorrect,
      maskedWord,
      guessedLetters: session.guessedLetters,
      mistakesCount: session.mistakesCount,
      mistakesRemaining: Math.max(0, session.maxMistakes - session.mistakesCount),
      maxMistakes: session.maxMistakes,
      status: session.status,
      message: isCorrect
        ? `Great guess! '${char}' is present in the secret word.`
        : `Wrong guess! '${char}' is not in the secret word.`
    };

    if (session.status !== 'PLAYING') {
      responsePayload.secretWord = session.secretWord;
    }

    res.json(responsePayload);
  });

  // 5. Get Game Status
  app.get('/api/game/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const session = sessions.get(id);

    if (!session) {
      res.status(404).json({ error: 'Game session not found.' });
      return;
    }

    res.json({
      gameId: session.gameId,
      status: session.status,
      difficulty: session.difficulty,
      maxMistakes: session.maxMistakes,
      mistakesCount: session.mistakesCount,
      mistakesRemaining: Math.max(0, session.maxMistakes - session.mistakesCount),
      maskedWord: buildMaskedWord(session.secretWord, session.guessedLetters),
      guessedLetters: session.guessedLetters,
      hint: session.hint,
      category: session.category,
      secretWord: session.status !== 'PLAYING' ? session.secretWord : undefined
    });
  });

  // 6. Interactive OpenAPI / Schema Docs
  app.get('/api/docs', (_req: Request, res: Response) => {
    res.json({
      title: 'CodeAlpha Hangman REST API',
      version: '1.0.0',
      description: 'RESTful API backend for the CodeAlpha Hangman Web Application',
      endpoints: [
        {
          method: 'GET',
          path: '/api/health',
          description: 'Server health and active session count'
        },
        {
          method: 'GET',
          path: '/api/words',
          description: 'Fetch available word list and difficulty parameters',
          queryParams: ['category', 'difficulty']
        },
        {
          method: 'POST',
          path: '/api/game/new',
          description: 'Initialize a new game session on the server',
          body: {
            difficulty: 'easy | medium | hard',
            category: 'codealpha-task | python-core | software-eng'
          }
        },
        {
          method: 'POST',
          path: '/api/game/guess',
          description: 'Submit an alphabet letter guess against an active session',
          body: {
            gameId: 'string (from /api/game/new)',
            letter: 'single char (a-z)'
          }
        },
        {
          method: 'GET',
          path: '/api/game/:id',
          description: 'Retrieve current status of any active or finished game session'
        }
      ]
    });
  });

  // ==========================================
  // Vite Middleware (Dev) & Static Assets (Prod)
  // ==========================================
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
        watch: process.env.DISABLE_HMR === 'true' ? null : {}
      },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Hangman API & Web Server] running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
