import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Ping database to confirm readiness
    await prisma.$queryRaw`SELECT 1`;

    return NextResponse.json(
      {
        status: "READY",
        timestamp: new Date().toISOString(),
        dependencies: {
          database: "UP",
        },
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Health ready check failed:", err);
    return NextResponse.json(
      {
        status: "DOWN",
        timestamp: new Date().toISOString(),
        dependencies: {
          database: "DOWN",
        },
      },
      { status: 503 }
    );
  }
}
