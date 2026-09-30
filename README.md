# CodeAlpha Python Internship — Task 1: Hangman Game

![Python Version](https://img.shields.io/badge/Python-3.8%2B-blue?logo=python)
![Code Style](https://img.shields.io/badge/Code%20Style-PEP%208-green)
![Task Status](https://img.shields.io/badge/Task%20Status-Completed%20%26%20Verified-success)
![License](https://img.shields.io/badge/License-MIT-purple)

---

## 📌 Project Overview
This repository contains the official submission for **Task 1: Hangman Game** of the **CodeAlpha Python Development Internship**.

The project is a robust, text-based interactive console application built according to industry standards, featuring defensive input validation, dynamic difficulty scaling, automated unit tests, and a full-stack RESTful API companion.

### 👤 Intern Details
- **Intern Name**: Madhav
- **Internship Domain**: Python Development
- **Organization**: CodeAlpha
- **Task**: Task 1 — Hangman Console Game & Architecture

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

### Execution
Run the standalone script:

\`\`\`bash
python3 hangman.py
\`\`\`

---

## 🧪 Running Unit Tests
To verify the core game mechanics and masking algorithms, execute the unit test suite:

\`\`\`bash
python3 -m unittest test_hangman.py -v
\`\`\`
*(Result: 9 tests passed in 0.001s)*

---

## 📜 License
This project is open-source under the MIT License — created for CodeAlpha internship evaluation purposes.
