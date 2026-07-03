import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST() {
  try {
    // 1. Provision Test Subject
    const subject = await prisma.subject.upsert({
      where: { code: "21CS52" },
      update: { name: "Computer Networks", branch: "CSE", semester: 5 },
      create: {
        code: "21CS52",
        name: "Computer Networks",
        branch: "CSE",
        semester: 5,
      },
    });

    // 2. Provision Test Academic Term
    const startDate = new Date("2026-09-01T00:00:00Z");
    const endDate = new Date("2026-12-31T23:59:59Z");
    
    // Find first term or create
    let term = await prisma.academicTerm.findFirst();
    if (!term) {
      term = await prisma.academicTerm.create({
        data: {
          name: "Odd Semester 2026",
          startDate,
          endDate,
          examPeriodStart: new Date("2026-12-15T00:00:00Z"),
          examPeriodEnd: new Date("2026-12-30T23:59:59Z"),
        },
      });
    }

    // 3. Provision Test Feature Flags
    const aiMentorFlag = await prisma.featureFlag.upsert({
      where: { key: "AI_MENTOR" },
      update: {
        status: "BETA",
        rules: { roles: ["STUDENT"], semesters: [5] },
      },
      create: {
        key: "AI_MENTOR",
        status: "BETA",
        rules: { roles: ["STUDENT"], semesters: [5] },
      },
    });

    // 4. Provision Test Exam Simulator
    const exam = await prisma.exam.create({
      data: {
        subjectId: subject.id,
        title: "Computer Networks VTU Practice Simulator",
        description: "Adaptive MCQ and code simulation parameters",
        examType: "VTU_EXTERNAL",
        durationMinutes: 30,
        negativeMarking: 0.25,
      },
    });

    return NextResponse.json(
      {
        message: "Development testing mock records seeded successfully.",
        seeded: {
          subjectId: subject.id,
          termId: term.id,
          examId: exam.id,
          flagKey: aiMentorFlag.key,
        },
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Database mock seeding failed:", err);
    return NextResponse.json(
      { error: "Database mock seeding failed", details: String(err) },
      { status: 500 }
    );
  }
}
