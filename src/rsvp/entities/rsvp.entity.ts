import { ApiProperty } from '@nestjs/swagger';
import { RSVP as PrismaRSVP, RSVPStatus } from '@prisma/client';

export class Rsvp implements PrismaRSVP {
  @ApiProperty()
  id: string;
  @ApiProperty()
  eventId: string;
  @ApiProperty()
  userId: string;
  @ApiProperty({ enum: RSVPStatus, name: 'RSVPStatus' })
  status: RSVPStatus;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  updatedAt: Date;
}
