import { prisma } from "@/lib/prisma";

export interface CreateExamInput {
  subjectId: string;
  title: string;
  description?: string;
  examType?: string;
  durationMinutes?: number;
  negativeMarking?: number;
}

export interface LogMistakeInput {
  userId: string;
  subjectId: string;
  questionText: string;
  wrongAnswer: string;
  correctAnswer: string;
  reason: string;
  notesRecommendation?: string | null;
  cardsRecommendation?: string | null;
}

export const AssessmentRepository = {
  async createExam(data: CreateExamInput) {
    return prisma.exam.create({
      data: {
        subjectId: data.subjectId,
        title: data.title,
        description: data.description,
        examType: data.examType || "VTU_EXTERNAL",
        durationMinutes: data.durationMinutes || 180,
        negativeMarking: data.negativeMarking || 0.0,
      },
    });
  },

  async findExamById(id: string) {
    return prisma.exam.findUnique({
      where: { id },
    });
  },

  async findExamsBySubject(subjectId: string) {
    return prisma.exam.findMany({
      where: { subjectId },
      include: {
        _count: {
          select: { sessions: true },
        },
      },
    });
  },

  async createExamSession(userId: string, examId: string) {
    return prisma.examSession.create({
      data: {
        userId,
        examId,
        cheatingFlag: false,
      },
    });
  },

  async findExamSessionById(id: string) {
    return prisma.examSession.findUnique({
      where: { id },
      include: {
        exam: true,
      },
    });
  },

  async completeExamSession(
    sessionId: string,
    score: number,
    durationSeconds: number,
    cheatingFlag: boolean
  ) {
    return prisma.examSession.update({
      where: { id: sessionId },
      data: {
        score,
        durationSeconds,
        cheatingFlag,
        completedAt: new Date(),
      },
    });
  },

  async findConceptMastery(userId: string, subjectCode: string, conceptName: string) {
    return prisma.conceptMastery.findUnique({
      where: {
        userId_subjectCode_conceptName: { userId, subjectCode, conceptName },
      },
    });
  },

  async upsertConceptMastery(
    userId: string,
    subjectCode: string,
    conceptName: string,
    masteryScore: number,
    confidence: number
  ) {
    return prisma.conceptMastery.upsert({
      where: {
        userId_subjectCode_conceptName: { userId, subjectCode, conceptName },
      },
      update: {
        masteryScore,
        confidence,
      },
      create: {
        userId,
        subjectCode,
        conceptName,
        masteryScore,
        confidence,
      },
    });
  },

  async findUserConceptMastery(userId: string) {
    return prisma.conceptMastery.findMany({
      where: { userId },
      orderBy: { conceptName: "asc" },
    });
  },

  async logStudentMistake(data: LogMistakeInput) {
    return prisma.studentMistake.create({
      data: {
        userId: data.userId,
        subjectId: data.subjectId,
        questionText: data.questionText,
        wrongAnswer: data.wrongAnswer,
        correctAnswer: data.correctAnswer,
        reason: data.reason,
        notesRecommendation: data.notesRecommendation,
        cardsRecommendation: data.cardsRecommendation,
      },
    });
  },

  async findStudentMistakes(userId: string) {
    return prisma.studentMistake.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  },

  async resolveStudentMistake(id: string) {
    return prisma.studentMistake.update({
      where: { id },
      data: { resolved: true },
    });
  },
};
