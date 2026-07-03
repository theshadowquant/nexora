import { prisma } from "@/lib/prisma";

export interface CreateCardInput {
  deckId: string;
  front: string;
  back: string;
}

export interface UpdateCardSrsInput {
  interval: number;
  easeFactor: number;
  repetitions: number;
  nextReview: Date;
}

export interface CreateReviewLogInput {
  flashcardId: string;
  userId: string;
  rating: number;
  previousInterval: number;
  newInterval: number;
  previousEaseFactor: number;
  newEaseFactor: number;
}

export const FlashcardRepository = {
  async createDeck(subjectId: string, title: string, description?: string) {
    return prisma.flashcardDeck.create({
      data: {
        subjectId,
        title,
        description,
      },
    });
  },

  async findDeckById(id: string) {
    return prisma.flashcardDeck.findUnique({
      where: { id },
      include: {
        flashcards: true,
      },
    });
  },

  async findDecksBySubject(subjectId: string) {
    return prisma.flashcardDeck.findMany({
      where: { subjectId },
      include: {
        _count: {
          select: { flashcards: true },
        },
      },
    });
  },

  async createFlashcard(data: CreateCardInput) {
    return prisma.flashcard.create({
      data: {
        deckId: data.deckId,
        front: data.front,
        back: data.back,
      },
    });
  },

  async findCardById(id: string) {
    return prisma.flashcard.findUnique({
      where: { id },
    });
  },

  /**
   * Fetches cards that are due for study (nextReview is less than or equal to current timestamp).
   */
  async findCardsDueForReview(deckId: string) {
    const now = new Date();
    return prisma.flashcard.findMany({
      where: {
        deckId,
        nextReview: {
          lte: now,
        },
      },
      orderBy: {
        nextReview: "asc",
      },
    });
  },

  async updateCardSrsState(cardId: string, data: UpdateCardSrsInput) {
    return prisma.flashcard.update({
      where: { id: cardId },
      data: {
        interval: data.interval,
        easeFactor: data.easeFactor,
        repetitions: data.repetitions,
        nextReview: data.nextReview,
      },
    });
  },

  async logReview(data: CreateReviewLogInput) {
    return prisma.flashcardReview.create({
      data: {
        flashcardId: data.flashcardId,
        userId: data.userId,
        rating: data.rating,
        previousInterval: data.previousInterval,
        newInterval: data.newInterval,
        previousEaseFactor: data.previousEaseFactor,
        newEaseFactor: data.newEaseFactor,
      },
    });
  },

  async getReviewLogsByUser(userId: string) {
    return prisma.flashcardReview.findMany({
      where: { userId },
      orderBy: { reviewedAt: "desc" },
    });
  },

  async updateRetentionScore(userId: string, subjectId: string, score: number) {
    return prisma.retentionScore.upsert({
      where: {
        userId_subjectId: { userId, subjectId },
      },
      update: { score },
      create: { userId, subjectId, score },
    });
  },
};
