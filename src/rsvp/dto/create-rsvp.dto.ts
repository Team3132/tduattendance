import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty, ApiQuery } from '@nestjs/swagger';
import { RSVP, RSVPStatus } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreateRsvpDto {
  @IsString()
  @ApiProperty()
  eventId: string;
  @IsEnum(RSVPStatus)
  @ApiProperty({ enum: RSVPStatus, name: 'RSVPStatus' })
  status: RSVPStatus;
}
