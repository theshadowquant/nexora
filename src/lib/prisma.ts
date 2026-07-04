import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalRef = global as unknown as {
  prisma: PrismaClient | undefined;
  pool: Pool | undefined;
};

function createPrismaClient(): PrismaClient {
  if (!process.env.DATABASE_URL) {
    // Build-time safety: return a client that will fail gracefully at runtime
    // This prevents static page generation from crashing when no DB is available
    return new PrismaClient();
  }
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
}

export const prisma =
  globalRef.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalRef.prisma = prisma;
}
