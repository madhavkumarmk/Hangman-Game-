/**
 * Generates an executive, submission-grade README.md for the intern's GitHub repository
 */

export function generateReadmeContent(internName = 'Madhav', taskTrack = 'Python Development'): string {
  return `# CodeAlpha Python Internship — Task 1: Hangman Game

![Python Version](https://img.shields.io/badge/Python-3.8%2B-blue?logo=python)
![Code Style](https://img.shields.io/badge/Code%20Style-PEP%208-green)
![Task Status](https://img.shields.io/badge/Task%20Status-Completed%20%26%20Verified-success)
![License](https://img.shields.io/badge/License-MIT-purple)

---

## 📌 Project Overview
This repository contains the official submission for **Task 1: Hangman Game** of the **CodeAlpha ${taskTrack} Internship**.

The project is a robust, text-based interactive console application built according to industry standards, featuring defensive input validation, dynamic difficulty scaling, and a full-stack RESTful API companion.

### 👤 Intern Details
- **Intern Name**: ${internName}
- **Internship Domain**: ${taskTrack}
- **Organization**: CodeAlpha
- **Task**: Task 1 — Hangman Console Game & Web Service

---

## 🎯 Task Requirements & Compliance Matrix

| Requirement | Specification | Implementation Status |
| :--- | :--- | :---: |
| **Word Pool** | Predefined list of 5 task words | ✅ Completed (\`python\`, \`code\`, \`alpha\`, \`intern\`, \`developer\`) |
| **Guess Limit** | Maximum 6 incorrect guesses allowed | ✅ Completed (Configured with dynamic Easy/Medium/Hard tiers) |
| **Masking Logic** | Display word with masked unguessed letters (\`_ _ _ _\`) | ✅ Completed (Real-time iteration with \`.strip()\` output) |
| **Input Validation** | Validate single character & prevent duplicate guesses | ✅ Completed (Strict \`isalpha()\` & \`len()\` checks) |
| **Win/Loss States** | Clear conditional win/loss messaging | ✅ Completed (Evaluates membership & limits) |
| **Core Constructs** | Standard Python without unnecessary 3P libraries | ✅ Completed (\`while\`, \`if-elif-else\`, \`random\`, \`list\`, \`dict\`) |
| **Bonus Features** | RESTful API & Interactive UI | ✅ Completed (Express backend + React interface) |

---

## 🚀 How to Run the Python Game

### Prerequisites
- Python 3.8 or higher installed on your system.

### Execution
Clone this repository and run the standalone script:

\`\`\`bash
# 1. Clone the repository
git clone https://github.com/your-username/CodeAlpha_Hangman_Game.git

# 2. Navigate to project directory
cd CodeAlpha_Hangman_Game

# 3. Run the Python Hangman Game
python3 hangman.py
\`\`\`

### Sample Gameplay Session
\`\`\`text
=========================================
   Welcome to Hangman Game by CodeAlpha! 
=========================================
Select Difficulty Level:
1. Easy   (8 incorrect guesses · Short & Simple words)
2. Medium (6 incorrect guesses · CodeAlpha task standard)
3. Hard   (4 incorrect guesses · Advanced complex words)
Enter choice (1/2/3) [Default 2]: 2

Starting in [MEDIUM] Mode!
You have up to 6 incorrect guesses allowed.

Word: _ _ _ _ _ _
Incorrect guesses left: 6

Guess a letter: p
Good job! 'p' is present in the secret word.

Word: p _ _ _ _ _
Incorrect guesses left: 6
\`\`\`

---

## 🧪 Running Unit Tests
To verify the core game mechanics and masking algorithms, execute the unit test suite:

\`\`\`bash
python3 -m unittest test_hangman.py -v
\`\`\`

---

## 🌐 Full-Stack Web & REST API Architecture
The project also provides a production-grade full-stack web interface with Express.js REST API endpoints:
- \`GET /api/health\`: Service status check
- \`GET /api/words\`: Word database by difficulty
- \`POST /api/game/new\`: Start a session on the server
- \`POST /api/game/guess\`: Server-side guess validation

---

## 📂 Project Structure
\`\`\`text
├── hangman.py          # Standalone Python game implementation
├── test_hangman.py     # Automated unittest test suite
├── README.md           # Professional project documentation
└── server.ts           # Full-stack REST API server
\`\`\`

---

## 📜 License
This project is open-source under the MIT License — created for educational and internship evaluation purposes.
`;
}
