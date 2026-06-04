import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

type PrismaClientInstance = ReturnType<typeof createPrismaClient>;

function createPrismaClient() {
  if (!process.env.DATABASE_URL) {
    return new PrismaClient();
  }
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
}

declare global {
  // eslint-disable-next-line no-var
  var prismaGlobal: PrismaClientInstance | undefined;
}

const prisma: PrismaClientInstance =
  globalThis.prismaGlobal ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalThis.prismaGlobal = prisma;
}

export default prisma;
