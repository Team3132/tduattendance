import { ApiProperty } from '@nestjs/swagger';
import { RSVPStatus, User as PrismaUser } from '@prisma/client';
import { Exclude } from 'class-transformer';

/**
 * The user object.
 */
export class User implements Partial<PrismaUser> {
  @ApiProperty()
  id: string;
  @ApiProperty()
  username?: string | null;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  updatedAt: Date;
  @ApiProperty({ enum: RSVPStatus })
  defaultStatus: RSVPStatus;
  @ApiProperty()
  @Exclude()
  calendarSecret: string;
  @ApiProperty()
  roles: string[];
}
