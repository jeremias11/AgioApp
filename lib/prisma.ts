import { PrismaClient } from "@prisma/client"

// PrismaClient é anexado ao objeto global para evitar múltiplas instâncias
// durante hot reloading em desenvolvimento

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma = globalForPrisma.prisma || new PrismaClient()

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma

export default prisma
