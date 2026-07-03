import { AssessmentRepository } from "../repos/AssessmentRepository";
import { MasteryEngine } from "../engines/MasteryEngine";
import { MistakeEngine } from "../engines/MistakeEngine";
import { DifficultyLevel } from "../engines/AdaptiveDifficultyEngine";

export const AssessmentService = {
  /**
   * Processes a student answer submission, updates mastery scores, and logs mistakes if incorrect.
   */
  async submitAnswer(
    userId: string,
    subjectId: string,
    subjectCode: string,
    conceptName: string,
    questionText: string,
    userAnswer: string,
    correctAnswer: string,
    isCorrect: boolean,
    difficulty: DifficultyLevel
  ) {
    // 1. Fetch current concept mastery scores
    const currentMastery = await AssessmentRepository.findConceptMastery(
      userId,
      subjectCode,
      conceptName
    );

    const oldScore = currentMastery?.masteryScore ?? 50.0;
    const oldConfidence = currentMastery?.confidence ?? 0.50;

    // 2. Calculate updated mastery & confidence
    const updatedMastery = MasteryEngine.calculateNewMastery(
      oldScore,
      oldConfidence,
      isCorrect,
      difficulty
    );

    await AssessmentRepository.upsertConceptMastery(
      userId,
      subjectCode,
      conceptName,
      updatedMastery.newScore,
      updatedMastery.newConfidence
    );

    // 3. If incorrect, run mistake diagnosis and save recommendations
    if (!isCorrect) {
      const diagnosis = MistakeEngine.diagnoseMistake(
        questionText,
        userAnswer,
        correctAnswer
      );

      await AssessmentRepository.logStudentMistake({
        userId,
        subjectId,
        questionText,
        wrongAnswer: userAnswer,
        correctAnswer,
        reason: diagnosis.reason,
        notesRecommendation: diagnosis.notesRecommendation,
        cardsRecommendation: diagnosis.cardsRecommendation,
      });
    }

    return updatedMastery;
  },

  /**
   * Begins a timed lockdown exam session.
   */
  async startExamSession(userId: string, examId: string) {
    return AssessmentRepository.createExamSession(userId, examId);
  },

  /**
   * Completes an exam session, log scores, duration, and flags.
   */
  async submitExamSession(
    sessionId: string,
    score: number,
    durationSeconds: number,
    cheatingFlag: boolean
  ) {
    return AssessmentRepository.completeExamSession(
      sessionId,
      score,
      durationSeconds,
      cheatingFlag
    );
  },
};
