import { User as PrismaUser } from '@prisma/client';

export class User {
  id: string;
  firstName: string | null;
  lastName: string | null;
  createdAt: Date;
  updatedAt: Date;
  discordToken: string;
  discordRefreshToken: string;
}
