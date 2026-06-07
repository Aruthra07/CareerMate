import { PrismaClient } from '@prisma/client';

let prisma: PrismaClient;

try {
  if (process.env.NODE_ENV === 'production') {
    prisma = new PrismaClient();
  } else {
    // Prevent multiple instances of Prisma Client in development
    const globalRef = global as unknown as { prisma: PrismaClient };
    if (!globalRef.prisma) {
      globalRef.prisma = new PrismaClient({
        log: ['error'],
      });
    }
    prisma = globalRef.prisma;
  }
} catch (e) {
  console.warn('Prisma client initialization failed. Falling back to Mock DB engine.', e);
}

// In-Memory Mock Store for zero-setup fallback
export const mockDbStore = {
  users: [] as any[],
  profiles: [] as any[],
  careerMatches: [] as any[],
  ikigais: [] as any[],
  roadmaps: [] as any[],
  studyTasks: [] as any[],
  studyMetrics: [] as any[],
  chats: [] as any[],
  posts: [] as any[],
};

// Check if database is active (helper for admin dashboard)
export async function checkDatabaseConnection(): Promise<{ connected: boolean; provider: string; error?: string }> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return { connected: true, provider: 'SQLite/PostgreSQL' };
  } catch (err: any) {
    return { 
      connected: false, 
      provider: 'SQLite (Fallback Mode Active)', 
      error: err.message || 'Could not connect' 
    };
  }
}

export { prisma };
