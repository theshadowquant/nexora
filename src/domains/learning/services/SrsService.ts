import { FlashcardRepository } from "../repos/FlashcardRepository";
import { Sm2Engine } from "../engines/Sm2Engine";

export const SrsService = {
  /**
   * Fetches all flashcards due for study.
   */
  async getDailyQueue(deckId: string) {
    return FlashcardRepository.findCardsDueForReview(deckId);
  },

  /**
   * Evaluates user review feedback, updates spaced repetition parameters, and updates database records.
   */
  async submitReview(userId: string, cardId: string, rating: number) {
    const card = await FlashcardRepository.findCardById(cardId);
    noteExists(card);

    // 1. Run SM-2 algorithm calculations
    const srsOutput = Sm2Engine.calculateNextReview({
      rating,
      previousRepetitions: card.repetitions,
      previousInterval: card.interval,
      previousEaseFactor: card.easeFactor,
    });

    // 2. Update card spaced repetition state in database
    await FlashcardRepository.updateCardSrsState(cardId, {
      interval: srsOutput.interval,
      easeFactor: srsOutput.easeFactor,
      repetitions: srsOutput.repetitions,
      nextReview: srsOutput.nextReviewDate,
    });

    // 3. Log review transaction details in history
    await FlashcardRepository.logReview({
      flashcardId: cardId,
      userId,
      rating,
      previousInterval: card.interval,
      newInterval: srsOutput.interval,
      previousEaseFactor: card.easeFactor,
      newEaseFactor: srsOutput.easeFactor,
    });

    // 4. Update retention scores for the matching subject
    const deck = await FlashcardRepository.findDeckById(card.deckId);
    if (deck) {
      await this.recalculateSubjectRetention(userId, deck.subjectId, card.deckId);
    }

    return srsOutput;
  },

  /**
   * Recalculates the student's cognitive memory retention percentage for a specific subject.
   * Formula: retention = 100 * (1 - (OverdueCards / TotalCards))
   */
  async recalculateSubjectRetention(userId: string, subjectId: string, deckId: string) {
    const deck = await FlashcardRepository.findDeckById(deckId);
    if (!deck || deck.flashcards.length === 0) return;

    const totalCards = deck.flashcards.length;
    const now = new Date();
    
    // Count cards whose next review date is in the past (overdue)
    const overdueCards = deck.flashcards.filter((c) => c.nextReview <= now).length;
    
    // Calculate retention percentage
    const retention = Math.max(0, Math.min(100, Math.round(100 * (1 - overdueCards / totalCards))));

    await FlashcardRepository.updateRetentionScore(userId, subjectId, retention);
  },
};

// Helper boundary check
function noteExists<T>(card: T | null | undefined): asserts card is T {
  if (card === null || card === undefined) {
    throw new Error("Card does not exist");
  }
}
