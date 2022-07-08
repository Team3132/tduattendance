import { ApiProperty } from '@nestjs/swagger';
import { Prisma, User as PrismaUser } from '@prisma/client';

/**
 * The user object.
 */
export class User implements PrismaUser {
  @ApiProperty()
  id: string;
  @ApiProperty()
  firstName: string | null;
  @ApiProperty()
  lastName: string | null;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  updatedAt: Date;
  @ApiProperty()
  discordRefreshToken: string;
  @ApiProperty()
  calendarSecret: string;
  @ApiProperty()
  email: string;
}
