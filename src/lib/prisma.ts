import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

let prisma: PrismaClient;
let pool: Pool;

if (process.env.NODE_ENV === "production") {
  pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  prisma = new PrismaClient({ adapter });
} else {
  const globalRef = global as unknown as { prisma: PrismaClient; pool: Pool };
  if (!globalRef.pool) {
    globalRef.pool = new Pool({ connectionString: process.env.DATABASE_URL });
  }
  if (!globalRef.prisma) {
    const adapter = new PrismaPg(globalRef.pool);
    globalRef.prisma = new PrismaClient({ adapter });
  }
  pool = globalRef.pool;
  prisma = globalRef.prisma;
}

export { prisma, pool };
