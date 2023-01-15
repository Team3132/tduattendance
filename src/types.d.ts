// Override express user

import { User as PrismaUser } from '@prisma/client';

declare global {
  namespace Express {
    interface User extends PrismaUser {
      id: string;
      firstName: string | null;
      lastName: string | null;
      createdAt: Date;
      updatedAt: Date;
      calendarSecret: string;
      defaultStatus: RSVPStatus;
      roles: string[];
    }
  }
}
