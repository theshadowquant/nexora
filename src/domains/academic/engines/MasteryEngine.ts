import { DifficultyLevel, AdaptiveDifficultyEngine } from "./AdaptiveDifficultyEngine";

export interface MasteryUpdateOutput {
  newScore: number;      // 0.0 to 100.0
  newConfidence: number; // 0.0 to 1.00
}

export const MasteryEngine = {
  /**
   * Evaluates quiz results to shift mastery score values.
   * Hard questions yield higher reward coefficients and lower penalty scales.
   */
  calculateNewMastery(
    currentScore: number,
    currentConfidence: number,
    isCorrect: boolean,
    difficulty: DifficultyLevel
  ): MasteryUpdateOutput {
    const diffWeight = AdaptiveDifficultyEngine.getDifficultyWeight(difficulty);
    
    let newScore = currentScore;
    let newConfidence = currentConfidence;

    if (isCorrect) {
      // Correct answer reward: scaled by difficulty weight and distance to perfect score
      const delta = 8 * diffWeight * (1 - currentScore / 100);
      newScore = Math.min(100.0, currentScore + delta);

      // Boost confidence
      newConfidence = Math.min(1.0, currentConfidence + 0.04 * diffWeight);
    } else {
      // Incorrect answer penalty: scaled inversely by difficulty weight
      const penaltyScale = 1 / diffWeight; // 1 for EASY, 0.5 for MEDIUM, 0.33 for HARD
      const delta = 10 * penaltyScale * (currentScore / 100);
      newScore = Math.max(0.0, currentScore - delta);

      // Lower confidence
      newConfidence = Math.max(0.1, currentConfidence - 0.05 * penaltyScale);
    }

    return {
      newScore: parseFloat(newScore.toFixed(3)),
      newConfidence: parseFloat(newConfidence.toFixed(3)),
    };
  },
};
