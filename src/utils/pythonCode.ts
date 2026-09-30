import { DifficultyLevel } from '../types';
import { DIFFICULTY_CONFIGS } from './words';

export function generatePythonCode(
  words: string[] = ['python', 'code', 'alpha', 'intern', 'developer'],
  mode: 'english' | 'hinglish' = 'english',
  difficulty: DifficultyLevel = 'medium'
): string {
  const formattedWords = JSON.stringify(words.map(w => w.toLowerCase()));
  const defaultLimit = DIFFICULTY_CONFIGS[difficulty].limit;

  if (mode === 'hinglish') {
    return `# =====================================================================
# CodeAlpha Python Internship - Task 1: Hangman Game (With Difficulty)
# Author: CodeAlpha Intern
# Description: Console-based text Hangman game featuring:
#              - Difficulty modes: Easy (8 tries), Medium (6 tries), Hard (4 tries)
#              - Word complexity tiers & input validation
# =====================================================================

import random

def play_hangman():
    # Difficulty settings dictionary: tries limit aur word categories map karte hain
    difficulty_levels = {
        "1": {"name": "Easy", "limit": 8, "words": ["code", "byte", "loop", "data", "list", "file"]},
        "2": {"name": "Medium", "limit": 6, "words": ${formattedWords}},
        "3": {"name": "Hard", "limit": 4, "words": ["developer", "algorithm", "framework", "debugging", "asynchronous"]}
    }

    print("=========================================")
    print("   Welcome to Hangman Game by CodeAlpha! ")
    print("=========================================")
    print("Select Difficulty Level:")
    print("1. Easy   (8 incorrect guesses · Simple words)")
    print("2. Medium (6 incorrect guesses · CodeAlpha task standard)")
    print("3. Hard   (4 incorrect guesses · Advanced complex words)")
    
    choice = input("Enter choice (1/2/3) [Default 2]: ").strip()
    if choice not in difficulty_levels:
        choice = "2"
        
    selected_diff = difficulty_levels[choice]
    words_list = selected_diff["words"]
    incorrect_guesses_limit = selected_diff["limit"]
    
    # Randomly secret word choose karte hain
    secret_word = random.choice(words_list)
    guessed_letters = []
    incorrect_guesses = 0
    
    print(f"\\nStarting in [{selected_diff['name'].upper()}] Mode!")
    print(f"You have up to {incorrect_guesses_limit} incorrect guesses allowed.\\n")
    
    # Main game loop
    while incorrect_guesses < incorrect_guesses_limit:
        # Masked word display create karte hain
        display_word = ""
        for letter in secret_word:
            if letter in guessed_letters:
                display_word += letter + " "
            else:
                display_word += "_ "
                
        print(f"\\nWord: {display_word.strip()}")
        print(f"Incorrect guesses left: {incorrect_guesses_limit - incorrect_guesses}")
        
        # Win condition check
        if "_" not in display_word:
            print("\\n-------------------------------------------------")
            print(f"Congratulations! You guessed the word correctly: {secret_word.upper()}")
            print(f"Solved in {selected_diff['name']} mode!")
            print("-------------------------------------------------")
            break
            
        # User input
        guess = input("Guess a letter: ").strip().lower()
        
        # Validation 1: Single alphabet letter
        if len(guess) != 1 or not guess.isalpha():
            print("Invalid input! Please enter a single valid alphabet letter (a-z).")
            continue
            
        # Validation 2: Duplicate guess
        if guess in guessed_letters:
            print(f"You have already guessed the letter '{guess}'. Try another one!")
            continue
            
        guessed_letters.append(guess)
        
        # Letter check
        if guess in secret_word:
            print(f"Good job! '{guess}' is present in the secret word.")
        else:
            incorrect_guesses += 1
            print(f"Wrong guess! '{guess}' is not in the word.")
            
    # Lose condition
    if incorrect_guesses == incorrect_guesses_limit:
        print("\\n-------------------------------------------------")
        print("Game Over! You ran out of incorrect guesses.")
        print(f"The secret word was: {secret_word.upper()}")
        print("Better luck next time!")
        print("-------------------------------------------------")

if __name__ == "__main__":
    play_hangman()
`;
  }

  // English version
  return `# =====================================================================
# CodeAlpha Python Internship - Task 1: Hangman Game (With Difficulty)
# Project: Text-Based Hangman Console Application with Difficulty Tiers
# Requirements:
#   1. Adjustable difficulty levels (Easy: 8 tries, Medium: 6 tries, Hard: 4 tries)
#   2. Word complexity scaling based on difficulty
#   3. Console-based I/O using while-loop, if-else, random, and dictionaries
# =====================================================================

import random

def play_hangman():
    # Difficulty configuration map with limits and tailored word pools
    difficulty_levels = {
        "1": {"name": "Easy", "limit": 8, "words": ["code", "byte", "loop", "data", "list", "file"]},
        "2": {"name": "Medium", "limit": 6, "words": ${formattedWords}},
        "3": {"name": "Hard", "limit": 4, "words": ["developer", "algorithm", "framework", "debugging", "asynchronous"]}
    }

    print("=========================================")
    print("   Welcome to Hangman Game by CodeAlpha! ")
    print("=========================================")
    print("Select Difficulty Level:")
    print("1. Easy   (8 incorrect guesses · Short & Simple words)")
    print("2. Medium (6 incorrect guesses · CodeAlpha task standard)")
    print("3. Hard   (4 incorrect guesses · Advanced complex words)")
    
    choice = input("Enter choice (1/2/3) [Default 2]: ").strip()
    if choice not in difficulty_levels:
        choice = "2"
        
    selected_diff = difficulty_levels[choice]
    words_list = selected_diff["words"]
    incorrect_guesses_limit = selected_diff["limit"]
    
    # Randomly select secret word from difficulty pool
    secret_word = random.choice(words_list)
    guessed_letters = []
    incorrect_guesses = 0
    
    print(f"\\nStarting in [{selected_diff['name'].upper()}] Mode!")
    print(f"You have up to {incorrect_guesses_limit} incorrect guesses allowed.\\n")
    
    # Main game loop
    while incorrect_guesses < incorrect_guesses_limit:
        # Build masked word representation
        display_word = ""
        for letter in secret_word:
            if letter in guessed_letters:
                display_word += letter + " "
            else:
                display_word += "_ "
                
        print(f"\\nWord: {display_word.strip()}")
        print(f"Incorrect guesses left: {incorrect_guesses_limit - incorrect_guesses}")
        
        # Check Win Condition
        if "_" not in display_word:
            print("\\n-------------------------------------------------")
            print(f"Congratulations! You guessed the word correctly: {secret_word.upper()}")
            print(f"Mastered in {selected_diff['name']} mode!")
            print("-------------------------------------------------")
            break
            
        # User input prompt
        guess = input("Guess a letter: ").strip().lower()
        
        # Validation: Exactly one alphabetic character
        if len(guess) != 1 or not guess.isalpha():
            print("Invalid input! Please enter a single valid alphabet letter (a-z).")
            continue
            
        # Validation: Prevent duplicate attempts
        if guess in guessed_letters:
            print(f"You have already guessed the letter '{guess}'. Try another one!")
            continue
            
        guessed_letters.append(guess)
        
        # Check if guess is correct or incorrect
        if guess in secret_word:
            print(f"Good job! '{guess}' is in the secret word.")
        else:
            incorrect_guesses += 1
            print(f"Wrong guess! '{guess}' is not in the word.")
            
    # Check Lose Condition
    if incorrect_guesses == incorrect_guesses_limit:
        print("\\n-------------------------------------------------")
        print("Game Over! You ran out of incorrect guesses.")
        print(f"The secret word was: {secret_word.upper()}")
        print("Better luck next time!")
        print("-------------------------------------------------")

if __name__ == "__main__":
    play_hangman()
`;
}

export function downloadPythonFile(filename = 'hangman_codealpha.py', content: string) {
  const blob = new Blob([content], { type: 'text/x-python;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export interface VivaQuestion {
  question: string;
  hindiSummary: string;
  answer: string;
  codeSnippet: string;
  keyConcepts: string[];
}

export const CODEALPHA_VIVA_QUESTIONS: VivaQuestion[] = [
  {
    question: "How are difficulty levels (Easy, Medium, Hard) implemented in Python?",
    hindiSummary: "Ek nested dictionary banate hain jisme har difficulty key ke andar uske tries limit aur tailored word pool store hote hain.",
    answer: "We use a dictionary mapping difficulty tiers ('1', '2', '3') to configuration objects containing the allowed incorrect_guesses_limit (8 for Easy, 6 for Medium, 4 for Hard) and difficulty-appropriate word lists. When the user selects a difficulty, the limit and word pool dynamically configure the game loop.",
    codeSnippet: `difficulty_levels = {
    "1": {"name": "Easy", "limit": 8, "words": ["code", "loop", "byte"]},
    "2": {"name": "Medium", "limit": 6, "words": ["python", "intern", "alpha"]},
    "3": {"name": "Hard", "limit": 4, "words": ["developer", "algorithm", "framework"]}
}`,
    keyConcepts: ["Dictionary mapping", "State parametrization", "Dynamic limits"]
  },
  {
    question: "Why do we use random.choice() instead of random.randint() to select the secret word?",
    hindiSummary: "random.choice() direct list me se random item return karta hai bina index calculate kiye.",
    answer: "random.choice(sequence) is the Pythonic way to retrieve a random element directly from a sequence (like a list). While random.randint(0, len(words) - 1) works, random.choice() is cleaner, avoids off-by-one index errors, and makes the code more readable.",
    codeSnippet: "secret_word = random.choice(words_list)",
    keyConcepts: ["random module", "Pythonic idioms", "Sequence access"]
  },
  {
    question: "How does the display_word masking logic work?",
    hindiSummary: "Secret word ke har character ko iterate karte hain, agar guessed_letters me hai to character show karo, warna underscore '_'.",
    answer: "We loop through each character in secret_word. If the character exists in guessed_letters, we append the character followed by a space ('c '). Otherwise, we append an underscore ('_ '). The .strip() method is then called to clean any trailing whitespace when printing.",
    codeSnippet: `display_word = ""
for letter in secret_word:
    if letter in guessed_letters:
        display_word += letter + " "
    else:
        display_word += "_ "`,
    keyConcepts: ["String concatenation", "Membership test (in operator)", "Iteration"]
  },
  {
    question: "Why do we check 'len(guess) != 1 or not guess.isalpha()'?",
    hindiSummary: "Taaki user khali enter na kare, multiple characters ya numbers/symbols na daale.",
    answer: "This is strict input validation. len(guess) != 1 ensures the user entered exactly one single character (rejecting blank returns or entire word guesses). not guess.isalpha() ensures the character is an English alphabet letter, ignoring numbers, punctuation, or special symbols.",
    codeSnippet: `if len(guess) != 1 or not guess.isalpha():
    print("Please enter a single valid alphabet letter.")
    continue`,
    keyConcepts: ["Input sanitation", "String methods", "Defensive programming"]
  },
  {
    question: "How is the winning condition determined in this program?",
    hindiSummary: "Agar masked word me ek bhi underscore '_' nahi bacha, iska matlab saare letters guess ho chuke hain.",
    answer: "In each iteration, we check if '_' not in display_word. Since an underscore is added for any unguessed letter, the absence of underscores confirms all letters of secret_word have been successfully revealed.",
    codeSnippet: `if "_" not in display_word:
    print(f"Congratulations! You guessed: {secret_word}")
    break`,
    keyConcepts: ["Membership operator", "Loop termination", "State verification"]
  },
  {
    question: "What is the time and space complexity of this implementation?",
    hindiSummary: "Time complexity linear O(N * M) hai jahan N word length hai aur M guesses count hai.",
    answer: "Time complexity per guess is O(N) where N is the length of the secret word (typically 4-10 characters), making it nearly instantaneous O(1) in practical terms. Space complexity is O(N + K) where K is the number of guessed letters (max 26 letters in English alphabet).",
    codeSnippet: "# Max memory usage is bounded by 26 letters and small word list",
    keyConcepts: ["Big-O Complexity", "Memory efficiency", "Algorithm analysis"]
  }
];

