/**
 * Provides the standalone single-file HTML/CSS/JS Hangman Game provided by the user
 */

export function generateClassicHtmlGame(customWords: string[] = ["PYTHON", "CODE", "ALPHA", "INTERN", "DEVELOPER"], livesLimit = 6): string {
  const wordsJson = JSON.stringify(customWords.map(w => w.toUpperCase()));

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CodeAlpha - Hangman Game</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f9;
            color: #333;
            text-align: center;
            padding: 40px 15px;
            margin: 0;
        }
        .container {
            max-width: 500px;
            margin: 0 auto;
            background: #fff;
            padding: 30px;
            border-radius: 12px;
            box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.1);
        }
        h1 {
            color: #4a90e2;
            margin-top: 0;
            font-size: 26px;
        }
        p {
            color: #666;
            font-size: 14px;
        }
        .word-display {
            font-size: 32px;
            letter-spacing: 8px;
            margin: 25px 0;
            font-weight: bold;
            font-family: monospace;
            min-height: 40px;
        }
        .message {
            font-size: 16px;
            margin: 15px 0;
            font-weight: bold;
            color: #444;
        }
        .keyboard {
            margin-top: 20px;
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 4px;
        }
        .btn {
            background-color: #4a90e2;
            color: white;
            border: none;
            padding: 8px 12px;
            font-size: 15px;
            cursor: pointer;
            border-radius: 6px;
            transition: 0.15s ease-in-out;
            min-width: 36px;
            font-weight: bold;
        }
        .btn:hover:not(:disabled) {
            background-color: #357abd;
            transform: scale(1.05);
        }
        .btn:disabled {
            background-color: #ccc;
            cursor: not-allowed;
            transform: none;
        }
        .restart-btn {
            background-color: #27ae60;
            margin-top: 20px;
            display: none;
            padding: 10px 20px;
            font-size: 16px;
        }
        .restart-btn:hover {
            background-color: #219653;
        }
    </style>
</head>
<body>

    <div class="container">
        <h1>CodeAlpha Hangman Game</h1>
        <p>Guess the hidden Python-related word!</p>
        
        <div class="word-display" id="wordDisplay">_ _ _ _ _</div>
        <div class="message" id="message">Incorrect guesses left: <span id="lives">${livesLimit}</span></div>
        
        <div class="keyboard" id="keyboard"></div>
        
        <button class="btn restart-btn" id="restartBtn" onclick="startGame()">Play Again</button>
    </div>

    <script>
        const words = ${wordsJson};
        let selectedWord = "";
        let guessedLetters = [];
        let lives = ${livesLimit};

        const wordDisplay = document.getElementById("wordDisplay");
        const message = document.getElementById("message");
        const livesSpan = document.getElementById("lives");
        const keyboard = document.getElementById("keyboard");
        const restartBtn = document.getElementById("restartBtn");

        function startGame() {
            selectedWord = words[Math.floor(Math.random() * words.length)];
            guessedLetters = [];
            lives = ${livesLimit};
            livesSpan.textContent = lives;
            restartBtn.style.display = "none";
            message.innerHTML = 'Incorrect guesses left: <span id="lives">' + lives + '</span>';
            
            updateWordDisplay();
            createKeyboard();
        }

        function updateWordDisplay() {
            let displayString = "";
            let win = true;
            for (let letter of selectedWord) {
                if (guessedLetters.includes(letter)) {
                    displayString += letter + " ";
                } else {
                    displayString += "_ ";
                    win = false;
                }
            }
            wordDisplay.textContent = displayString.trim();

            if (win) {
                message.textContent = "🎉 Congratulations! You Won!";
                disableKeyboard();
                restartBtn.style.display = "inline-block";
            }
        }

        function createKeyboard() {
            keyboard.innerHTML = "";
            for (let i = 65; i <= 90; i++) {
                let letter = String.fromCharCode(i);
                let button = document.createElement("button");
                button.textContent = letter;
                button.classList.add("btn");
                button.id = "btn-" + letter;
                button.onclick = () => handleGuess(letter, button);
                keyboard.appendChild(button);
            }
        }

        function handleGuess(letter, button) {
            button.disabled = true;
            guessedLetters.push(letter);

            if (selectedWord.includes(letter)) {
                updateWordDisplay();
            } else {
                lives--;
                livesSpan.textContent = lives;
                if (lives === 0) {
                    wordDisplay.textContent = selectedWord.split("").join(" ");
                    message.textContent = "❌ Game Over! The word was: " + selectedWord;
                    disableKeyboard();
                    restartBtn.style.display = "inline-block";
                }
            }
        }

        function disableKeyboard() {
            const buttons = keyboard.getElementsByClassName("btn");
            for (let btn of buttons) {
                btn.disabled = true;
            }
        }

        // Initialize game on load
        startGame();
    </script>
</body>
</html>`;
}
