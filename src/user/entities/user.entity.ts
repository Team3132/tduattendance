import { ApiProperty } from '@nestjs/swagger';
import { User as PrismaUser } from '@prisma/client';

/**
 * The user object.
 */
export class User {
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
  discordToken: string;
  @ApiProperty()
  discordRefreshToken: string;
}
