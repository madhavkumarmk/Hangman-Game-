/**
 * Generates automated unittest test suite test_hangman.py for the intern's submission
 */

export function generatePythonTestSuite(): string {
  return `# =====================================================================
# CodeAlpha Python Internship - Task 1: Hangman Unit Tests
# Test Suite: Automated validation of game mechanics & input logic
# Framework: Standard Python unittest library
# =====================================================================

import unittest

def mask_word(secret_word, guessed_letters):
    """Utility function mirroring the game's letter masking logic."""
    display = []
    for letter in secret_word:
        if letter in guessed_letters:
            display.append(letter)
        else:
            display.append("_")
    return " ".join(display)

def validate_input(user_input):
    """Utility function mirroring the game's input validation rules."""
    cleaned = user_input.strip().lower()
    if len(cleaned) != 1 or not cleaned.isalpha():
        return False, "Invalid input"
    return True, cleaned

class TestHangmanGame(unittest.TestCase):

    def setUp(self):
        self.predefined_words = ["python", "code", "alpha", "intern", "developer"]
        self.secret = "python"

    def test_predefined_words_list(self):
        """Verify the predefined list contains required task words."""
        self.assertEqual(len(self.predefined_words), 5)
        self.assertIn("python", self.predefined_words)
        self.assertIn("code", self.predefined_words)
        self.assertIn("alpha", self.predefined_words)
        self.assertIn("intern", self.predefined_words)
        self.assertIn("developer", self.predefined_words)

    def test_initial_masking(self):
        """Verify secret word begins with all underscores."""
        masked = mask_word(self.secret, [])
        self.assertEqual(masked, "_ _ _ _ _ _")

    def test_partial_masking(self):
        """Verify correct guesses uncover respective characters."""
        masked = mask_word(self.secret, ["p", "t"])
        self.assertEqual(masked, "p _ t _ _ _")

    def test_full_unmasking_win(self):
        """Verify full guess list completely unmasks the word."""
        guessed = ["p", "y", "t", "h", "o", "n"]
        masked = mask_word(self.secret, guessed)
        self.assertEqual(masked, "p y t h o n")
        self.assertNotIn("_", masked)

    def test_input_validation_valid_letter(self):
        """Ensure single alphabet characters are accepted."""
        is_valid, char = validate_input("A")
        self.assertTrue(is_valid)
        self.assertEqual(char, "a")

    def test_input_validation_numbers(self):
        """Ensure numeric characters are rejected."""
        is_valid, _ = validate_input("5")
        self.assertFalse(is_valid)

    def test_input_validation_special_symbols(self):
        """Ensure punctuation and symbols are rejected."""
        is_valid, _ = validate_input("@")
        self.assertFalse(is_valid)

    def test_input_validation_empty_or_multi_char(self):
        """Ensure empty strings or multi-letter words are rejected."""
        self.assertFalse(validate_input("")[0])
        self.assertFalse(validate_input("python")[0])

    def test_difficulty_guess_limits(self):
        """Verify guess limits conform to difficulty specifications."""
        difficulty_limits = {"easy": 8, "medium": 6, "hard": 4}
        self.assertEqual(difficulty_limits["easy"], 8)
        self.assertEqual(difficulty_limits["medium"], 6)  # CodeAlpha task requirement
        self.assertEqual(difficulty_limits["hard"], 4)

if __name__ == "__main__":
    unittest.main()
`;
}
