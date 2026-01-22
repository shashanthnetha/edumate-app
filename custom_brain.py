class SimpleBKT:
    def __init__(self):
        # --- THE "BRAIN" SETTINGS ---
        # These are standard starting probabilities for a generic skill
        self.p_known = 0.50   # Probability they know it before starting
        self.p_learn = 0.20   # Probability they learn it after one step
        self.p_guess = 0.10   # Chance they guess right even if they don't know it
        self.p_slip  = 0.05   # Chance they slip up even if they DO know it
    
    def update(self, is_correct):
        """
        Updates the probability of mastery based on whether the student
        got the answer correct (1) or incorrect (0).
        """
        prior = self.p_known
        
        if is_correct == 1:
            # Formula if they got it RIGHT
            # Likelihood they actually knew it vs. just guessed
            likelihood = (prior * (1 - self.p_slip)) / \
                         (prior * (1 - self.p_slip) + (1 - prior) * self.p_guess)
        else:
            # Formula if they got it WRONG
            # Likelihood they actually didn't know it vs. just slipped
            likelihood = (prior * self.p_slip) / \
                         (prior * self.p_slip + (1 - prior) * (1 - self.p_guess))
        
        # Add the "Learning" factor (they might have learned it just now)
        self.p_known = likelihood + (1 - likelihood) * self.p_learn
        
        return self.p_known

# --- SIMULATION (Only run if this file is run directly) ---
if __name__ == "__main__":
    # Let's test our Custom Brain
    brain = SimpleBKT()

    print(f"Initial Mastery: {brain.p_known:.2%}")
    print("-" * 30)

    # Simulate a student answering 5 questions
    # Pattern: Wrong, Wrong, Right, Right, Right
    student_answers = [0, 0, 1, 1, 1]

    for i, answer in enumerate(student_answers):
        new_mastery = brain.update(answer)
        result_str = "CORRECT" if answer == 1 else "WRONG  "
        print(f"Q{i+1}: {result_str} -> AI Confidence: {new_mastery:.2%}")

    print("-" * 30)
    if brain.p_known > 0.85:
        print("STATUS: MASTERED. Moving to next topic.")
    else:
        print("STATUS: STRUGGLING. Suggesting remediation.")