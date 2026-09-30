import { WordCategory, DifficultyLevel, DifficultyConfig, WordItem } from '../types';

export const DIFFICULTY_CONFIGS: Record<DifficultyLevel, DifficultyConfig> = {
  easy: {
    id: 'easy',
    label: 'Easy',
    limit: 8,
    wordComplexity: 'Short & Simple (3-5 letters)',
    description: 'Forgiving mode with 8 incorrect guesses allowed and simple terms.'
  },
  medium: {
    id: 'medium',
    label: 'Medium',
    limit: 6,
    wordComplexity: 'Moderate (5-7 letters)',
    description: 'Standard CodeAlpha internship specification with 6 incorrect guesses.'
  },
  hard: {
    id: 'hard',
    label: 'Hard',
    limit: 4,
    wordComplexity: 'Complex (8+ letters)',
    description: 'Challenging high-stakes mode with only 4 incorrect guesses allowed.'
  }
};

export const DEFAULT_WORD_CATEGORIES: WordCategory[] = [
  {
    id: 'codealpha-task',
    name: 'CodeAlpha Internship Task',
    badge: 'Official Task',
    description: 'Task words sorted by difficulty, including core assignment words and related industry concepts.',
    words: [
      // Easy (Short & direct)
      { word: 'code', hint: 'Set of instructions written in a programming language', difficulty: 'easy' },
      { word: 'byte', hint: 'A unit of digital information consisting of eight bits', difficulty: 'easy' },
      { word: 'loop', hint: 'A programming structure that repeats a sequence of instructions', difficulty: 'easy' },
      { word: 'data', hint: 'Quantities, characters, or symbols on which operations are performed', difficulty: 'easy' },
      // Medium (Core CodeAlpha assignment words)
      { word: 'python', hint: 'The popular high-level programming language used in this project', difficulty: 'medium' },
      { word: 'alpha', hint: 'First letter of the Greek alphabet, and company name part', difficulty: 'medium' },
      { word: 'intern', hint: 'A student or trainee working to gain practical work experience', difficulty: 'medium' },
      { word: 'script', hint: 'A program or sequence of instructions carried out by another program', difficulty: 'medium' },
      // Hard (Complex words with multiple syllables/advanced terms)
      { word: 'developer', hint: 'A software engineer who builds and maintains applications', difficulty: 'hard' },
      { word: 'internship', hint: 'Period of work experience offered by an organization', difficulty: 'hard' },
      { word: 'programming', hint: 'The process of writing computer programs', difficulty: 'hard' }
    ]
  },
  {
    id: 'python-core',
    name: 'Python Programming Essentials',
    badge: 'Language Concepts',
    description: 'Fundamental data structures and syntax terms in Python.',
    words: [
      // Easy
      { word: 'list', hint: 'An ordered, mutable collection of items in Python', difficulty: 'easy' },
      { word: 'file', hint: 'An external resource read using open()', difficulty: 'easy' },
      { word: 'none', hint: 'Python keyword representing the absence of a value', difficulty: 'easy' },
      // Medium
      { word: 'syntax', hint: 'The rules defining the structure of valid language statements', difficulty: 'medium' },
      { word: 'module', hint: 'A Python file containing functions and classes imported via "import"', difficulty: 'medium' },
      { word: 'lambda', hint: 'A small anonymous inline function defined without def', difficulty: 'medium' },
      { word: 'variable', hint: 'A named memory container used to store data values', difficulty: 'medium' },
      { word: 'function', hint: 'A reusable block of organized code defined with "def"', difficulty: 'medium' },
      // Hard
      { word: 'dictionary', hint: 'An unordered key-value mapping data structure', difficulty: 'hard' },
      { word: 'generator', hint: 'A function that yields values one at a time using yield', difficulty: 'hard' },
      { word: 'inheritance', hint: 'Mechanism where a new class adopts attributes from a base class', difficulty: 'hard' },
      { word: 'polymorphism', hint: 'Ability of different classes to respond to the same method call', difficulty: 'hard' }
    ]
  },
  {
    id: 'software-eng',
    name: 'Software Engineering & CS',
    badge: 'Industry Terms',
    description: 'Standard software development concepts and tooling.',
    words: [
      // Easy
      { word: 'test', hint: 'Procedure to verify code correctness', difficulty: 'easy' },
      { word: 'node', hint: 'A basic unit of a data structure, such as a linked list or tree', difficulty: 'easy' },
      { word: 'git', hint: 'Distributed version control system created by Linus Torvalds', difficulty: 'easy' },
      // Medium
      { word: 'compiler', hint: 'Translates high-level source code into machine code', difficulty: 'medium' },
      { word: 'database', hint: 'An organized collection of structured data or records', difficulty: 'medium' },
      { word: 'terminal', hint: 'The command-line text interface to run scripts and programs', difficulty: 'medium' },
      // Hard
      { word: 'algorithm', hint: 'A step-by-step procedure to solve a problem or calculation', difficulty: 'hard' },
      { word: 'framework', hint: 'A platform providing pre-built foundation for software', difficulty: 'hard' },
      { word: 'debugging', hint: 'The process of finding and resolving bugs or defects', difficulty: 'hard' },
      { word: 'asynchronous', hint: 'Operations that run independently of the primary program flow', difficulty: 'hard' }
    ]
  }
];

export function getWordsForDifficulty(
  words: WordItem[],
  difficulty: DifficultyLevel
): WordItem[] {
  const filtered = words.filter(w => w.difficulty === difficulty);
  return filtered.length > 0 ? filtered : words;
}

export const MAX_INCORRECT_GUESSES = 6;

