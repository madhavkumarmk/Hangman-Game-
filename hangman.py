# =====================================================================
# CodeAlpha Python Internship - Task 1: Hangman Game (With Difficulty)
# Author: CodeAlpha Intern
# Description: Console-based text Hangman game featuring:
#              - Difficulty modes: Easy (8 tries), Medium (6 tries), Hard (4 tries)
#              - Word complexity tiers & input validation
# =====================================================================

import random

def play_hangman():
    # Difficulty settings dictionary
    difficulty_levels = {
        "1": {"name": "Easy", "limit": 8, "words": ["code", "byte", "loop", "data", "list", "file"]},
        "2": {"name": "Medium", "limit": 6, "words": ["python", "code", "alpha", "intern", "developer"]},
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
    
    print(f"\nStarting in [{selected_diff['name'].upper()}] Mode!")
    print(f"You have up to {incorrect_guesses_limit} incorrect guesses allowed.\n")
    
    # Main game loop
    while incorrect_guesses < incorrect_guesses_limit:
        # Masked word display create karte hain
        display_word = ""
        for letter in secret_word:
            if letter in guessed_letters:
                display_word += letter + " "
            else:
                display_word += "_ "
                
        print(f"\nWord: {display_word.strip()}")
        print(f"Incorrect guesses left: {incorrect_guesses_limit - incorrect_guesses}")
        
        # Win condition check
        if "_" not in display_word:
            print("\n-------------------------------------------------")
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
        print("\n-------------------------------------------------")
        print("Game Over! You ran out of incorrect guesses.")
        print(f"The secret word was: {secret_word.upper()}")
        print("Better luck next time!")
        print("-------------------------------------------------")

if __name__ == "__main__":
    play_hangman()
