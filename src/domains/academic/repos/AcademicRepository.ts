import { prisma } from "@/lib/prisma";

export interface CreateTimetableInput {
  subjectId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  classroom?: string;
  faculty?: string;
  section?: string;
  onlineMeetingLink?: string;
  color?: string;
}

export interface CreateGoalInput {
  userId: string;
  targetCgpa: number;
  targetAttendance: number;
  targetRevisionHours: number;
  targetCompletionDate: Date;
}

export const AcademicRepository = {
  async createAcademicTerm(
    name: string,
    startDate: Date,
    endDate: Date,
    examPeriodStart: Date,
    examPeriodEnd: Date
  ) {
    return prisma.academicTerm.create({
      data: { name, startDate, endDate, examPeriodStart, examPeriodEnd },
    });
  },

  async getActiveTerms() {
    return prisma.academicTerm.findMany({
      orderBy: { startDate: "desc" },
    });
  },

  async createTimetableEntry(data: CreateTimetableInput) {
    return prisma.timetableEntry.create({
      data: {
        subjectId: data.subjectId,
        dayOfWeek: data.dayOfWeek,
        startTime: data.startTime,
        endTime: data.endTime,
        classroom: data.classroom,
        faculty: data.faculty,
        section: data.section,
        onlineMeetingLink: data.onlineMeetingLink,
        color: data.color,
      },
    });
  },

  async getTimetableBySubject(subjectId: string) {
    return prisma.timetableEntry.findMany({
      where: { subjectId },
      orderBy: { dayOfWeek: "asc" },
    });
  },

  async createSyllabusTopic(subjectId: string, moduleNo: number, topicName: string, parentId?: string) {
    return prisma.syllabusTopic.create({
      data: {
        subjectId,
        moduleNo,
        topicName,
        parentId,
      },
    });
  },

  async getSyllabusTopics(subjectId: string) {
    return prisma.syllabusTopic.findMany({
      where: { subjectId },
      include: {
        subtopics: true,
      },
      orderBy: { topicName: "asc" },
    });
  },

  async updateSyllabusTopicStatus(topicId: string, isCompleted: boolean) {
    return prisma.syllabusTopic.update({
      where: { id: topicId },
      data: {
        isCompleted,
        completedAt: isCompleted ? new Date() : null,
      },
    });
  },

  async createAssignment(subjectId: string, title: string, description: string, dueDate: Date) {
    return prisma.assignment.create({
      data: { subjectId, title, description, dueDate },
    });
  },

  async getAssignmentsBySubject(subjectId: string) {
    return prisma.assignment.findMany({
      where: { subjectId },
      include: {
        submissions: true,
      },
      orderBy: { dueDate: "asc" },
    });
  },

  async submitAssignment(assignmentId: string, userId: string, fileUrl: string) {
    return prisma.assignmentSubmission.create({
      data: { assignmentId, userId, fileUrl },
    });
  },

  async gradeAssignmentSubmission(submissionId: string, marks: number, feedback?: string) {
    return prisma.assignmentSubmission.update({
      where: { id: submissionId },
      data: { marks, feedback },
    });
  },

  async createAcademicGoal(data: CreateGoalInput) {
    return prisma.academicGoal.create({
      data: {
        userId: data.userId,
        targetCgpa: data.targetCgpa,
        targetAttendance: data.targetAttendance,
        targetRevisionHours: data.targetRevisionHours,
        targetCompletionDate: data.targetCompletionDate,
      },
    });
  },

  async getGoalsByUser(userId: string) {
    return prisma.academicGoal.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  },

  async createStudySession(userId: string, subjectId: string, mode = "SOLO") {
    return prisma.studySession.create({
      data: { userId, subjectId, mode },
    });
  },

  async completeStudySession(sessionId: string, durationMinutes: number, distractionCount: number) {
    return prisma.studySession.update({
      where: { id: sessionId },
      data: {
        durationMinutes,
        distractionCount,
        completedAt: new Date(),
      },
    });
  },
};
