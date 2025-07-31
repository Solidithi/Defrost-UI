// import { PrismaClient } from "@prisma/client";

// export const prismaClient = new PrismaClient();

import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prismaClient =
	globalForPrisma.prisma ??
	new PrismaClient({
		// log: ["query"], // Uncomment for debugging
	});

if (process.env.NODE_ENV !== "production")
	globalForPrisma.prisma = prismaClient;
