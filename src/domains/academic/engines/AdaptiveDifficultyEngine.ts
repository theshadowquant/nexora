export type DifficultyLevel = "EASY" | "MEDIUM" | "HARD";

export const AdaptiveDifficultyEngine = {
  /**
   * Evaluates the accuracy result of the current question and shifts difficulty accordingly.
   */
  calculateNextDifficulty(
    currentDifficulty: DifficultyLevel,
    isCorrect: boolean
  ): DifficultyLevel {
    const diff = currentDifficulty.toUpperCase() as DifficultyLevel;

    if (isCorrect) {
      // Shift upwards if user answered correctly
      if (diff === "EASY") {
        return "MEDIUM";
      }
      if (diff === "MEDIUM" || diff === "HARD") {
        return "HARD";
      }
    } else {
      // Shift downwards if user got it incorrect
      if (diff === "HARD") {
        return "MEDIUM";
      }
      if (diff === "MEDIUM" || diff === "EASY") {
        return "EASY";
      }
    }

    return "MEDIUM";
  },

  /**
   * Translates a string rating representation to numeric weights.
   */
  getDifficultyWeight(difficulty: DifficultyLevel): number {
    const weightMap: Record<DifficultyLevel, number> = {
      EASY: 1.0,
      MEDIUM: 2.0,
      HARD: 3.0,
    };
    return weightMap[difficulty] || 2.0;
  },
};
