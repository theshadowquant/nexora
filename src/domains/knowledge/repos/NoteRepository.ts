import { prisma } from "@/lib/prisma";

export interface CreateNoteInput {
  moduleId: string;
  title: string;
  fileUrl: string;
  uploaderId?: string;
}

export const NoteRepository = {
  async createNote(data: CreateNoteInput) {
    return prisma.note.create({
      data: {
        moduleId: data.moduleId,
        title: data.title,
        fileUrl: data.fileUrl,
        uploaderId: data.uploaderId,
      },
    });
  },

  async findNoteById(id: string) {
    return prisma.note.findUnique({
      where: { id },
      include: {
        module: {
          include: {
            subject: true,
          },
        },
      },
    });
  },

  async findNotesBySubject(subjectId: string) {
    return prisma.note.findMany({
      where: {
        module: {
          subjectId,
        },
      },
      include: {
        module: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  async updateNoteStatus(id: string, isApproved: boolean) {
    return prisma.note.update({
      where: { id },
      data: { isApproved },
    });
  },

  async updateNoteAIExplanation(id: string, summary: string, aiExplanation: string) {
    return prisma.note.update({
      where: { id },
      data: {
        summary,
        aiExplanation,
        isApproved: true, // Auto-approve once processed
      },
    });
  },

  async incrementViews(id: string) {
    return prisma.note.update({
      where: { id },
      data: {
        views: { increment: 1 },
      },
    });
  },

  async deleteNote(id: string) {
    return prisma.note.delete({
      where: { id },
    });
  },
};
