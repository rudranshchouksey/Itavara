export * from '@prisma/client';
import { PrismaClient, Prisma } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Patch Decimal toJSON to ensure it serializes as a clean number in API responses
(Prisma.Decimal.prototype as any).toJSON = function () {
  return Number(this);
};
