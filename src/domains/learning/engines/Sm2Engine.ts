export interface Sm2Input {
  rating: number; // Quality rating (0 to 5)
  previousRepetitions: number;
  previousInterval: number; // in days
  previousEaseFactor: number;
}

export interface Sm2Output {
  repetitions: number;
  interval: number; // next interval in days
  easeFactor: number;
  nextReviewDate: Date;
}

export const Sm2Engine = {
  /**
   * Evaluates the SM-2 algorithm on rating inputs to determine scheduling properties.
   */
  calculateNextReview(input: Sm2Input): Sm2Output {
    const { rating, previousRepetitions, previousInterval, previousEaseFactor } = input;

    // Validate rating range
    if (rating < 0 || rating > 5) {
      throw new Error("Rating score must be between 0 and 5 inclusive.");
    }

    let easeFactor = previousEaseFactor;
    let repetitions = previousRepetitions;
    let interval = previousInterval;

    // 1. Calculate new Ease Factor (EF)
    // Formula: EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
    const q = rating;
    const efDelta = 0.1 - (5 - q) * (0.08 + (5 - q) * 0.02);
    easeFactor = parseFloat((previousEaseFactor + efDelta).toFixed(3));

    // Ensure easeFactor is never below 1.3
    if (easeFactor < 1.3) {
      easeFactor = 1.3;
    }

    // 2. Calculate repetitions and interval based on rating
    if (q < 3) {
      // Failed recall - reset repetitions, interval is 1 day
      repetitions = 0;
      interval = 1;
    } else {
      // Successful recall
      repetitions = previousRepetitions + 1;

      if (repetitions === 1) {
        interval = 1;
      } else if (repetitions === 2) {
        interval = 6;
      } else {
        interval = Math.round(previousInterval * easeFactor);
      }
    }

    // 3. Compute next review datetime
    const nextReviewDate = new Date();
    nextReviewDate.setDate(nextReviewDate.getDate() + interval);
    // Standardize to midnight for unified queue checks
    nextReviewDate.setHours(0, 0, 0, 0);

    return {
      repetitions,
      interval,
      easeFactor,
      nextReviewDate,
    };
  },
};
