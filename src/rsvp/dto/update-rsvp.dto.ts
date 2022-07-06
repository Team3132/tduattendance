import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { RSVPStatus } from '@prisma/client';
import { IsString, IsEnum, IsOptional } from 'class-validator';
import { CreateRsvpDto } from './create-rsvp.dto';

/**
 * The data used to update an RSVP
 */
export class UpdateRsvpDto {
  @IsString()
  @ApiProperty()
  @IsOptional()
  eventId?: string;
  @IsEnum(RSVPStatus)
  @ApiProperty({ enum: RSVPStatus })
  @IsOptional()
  status?: RSVPStatus;
}
