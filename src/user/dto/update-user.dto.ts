import { ApiProperty } from '@nestjs/swagger';
import { Prisma, RSVPStatus, User } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';

/**
 * The data used to update a user
 */
export class UpdateUserDto {
  @IsOptional()
  @IsEnum(RSVPStatus)
  @ApiProperty({ required: false, enum: RSVPStatus, nullable: true })
  defaultStatus: RSVPStatus | null;
}
