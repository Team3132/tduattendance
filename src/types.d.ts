// Override express user

import { User as PrismaUser } from '@prisma/client';

declare global {
  namespace Express {
    interface User {
      id: string;
      firstName: string | null;
      lastName: string | null;
      createdAt: Date;
      updatedAt: Date;
      discordRefreshToken: string;
      calendarSecret: string;
      email: string | null;
      roles: string[];
    }
  }
}
