import { AcademicRepository } from "../repos/AcademicRepository";
import { AttendancePredictor } from "../engines/AttendancePredictor";
import { SyllabusEngine } from "../engines/SyllabusEngine";
import { GradingEngine } from "../engines/GradingEngine";
import { prisma } from "@/lib/prisma";

export const AcademicService = {
  /**
   * Tracks class attendance logs and recalculates predictive risk indicators.
   */
  async logAttendance(userId: string, subjectId: string, status: "PRESENT" | "ABSENT" | "LATE") {
    // 1. Create log
    const log = await prisma.attendanceLog.create({
      data: {
        userId,
        subjectId,
        status,
      },
    });

    // 2. Fetch overall logs count for prediction
    const presentCount = await prisma.attendanceLog.count({
      where: { userId, subjectId, status: { in: ["PRESENT", "LATE"] } },
    });

    const totalCount = await prisma.attendanceLog.count({
      where: { userId, subjectId },
    });

    // Compute prediction
    const prediction = AttendancePredictor.predictAttendanceRisk(presentCount, totalCount);

    return { log, prediction };
  },

  /**
   * Evaluates overall syllabus coverage progress including child topic checkpoints.
   */
  async getSyllabusProgress(subjectId: string) {
    const topics = await AcademicRepository.getSyllabusTopics(subjectId);
    
    // Map topics to engine format
    const flatInputs = topics.map((t) => ({
      id: t.id,
      isCompleted: t.isCompleted,
      parentId: t.parentId,
    }));

    const progress = SyllabusEngine.calculateCoverage(flatInputs);
    return { topics, progress };
  },

  /**
   * Computes SGPA score based on university strategy.
   */
  async calculateTermSgpa(userId: string, strategy: "VTU" | "NEP" | "CBSE" = "VTU") {
    // Fetch marks
    const marks = await prisma.internalMark.findMany({
      where: { userId, examType: "SEMESTER_END" },
      include: {
        subject: true,
      },
    });

    // Map marks to credits (assuming defaults credit weight = 4)
    const courses = marks.map((m) => {
      // Map percentage to grade bounds
      let grade = "F";
      const percentage = (m.marksObtained / m.maxMarks) * 100;
      if (percentage >= 90) grade = "S";
      else if (percentage >= 80) grade = "A";
      else if (percentage >= 70) grade = "B";
      else if (percentage >= 60) grade = "C";
      else if (percentage >= 50) grade = "D";
      else if (percentage >= 40) grade = "E";

      return {
        grade,
        credits: m.subject.semester === 5 ? 4 : 3, // Mock credits
      };
    });

    const gradingStrategy = GradingEngine.getStrategy(strategy);
    return gradingStrategy.calculateSgpa(courses);
  },

  /**
   * Registers a student target academic goal.
   */
  async createGoal(
    userId: string,
    targetCgpa: number,
    targetAttendance: number,
    targetRevisionHours: number,
    targetCompletionDate: Date
  ) {
    return AcademicRepository.createAcademicGoal({
      userId,
      targetCgpa,
      targetAttendance,
      targetRevisionHours,
      targetCompletionDate,
    });
  },

  /**
   * Completes a focus study session, recording duration and distraction limits.
   */
  async endStudySession(sessionId: string, durationMinutes: number, distractionCount: number) {
    return AcademicRepository.completeStudySession(sessionId, durationMinutes, distractionCount);
  },
};
