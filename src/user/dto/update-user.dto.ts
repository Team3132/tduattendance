import { ApiProperty } from '@nestjs/swagger';
import { Prisma, RSVPStatus, User } from '@prisma/client';
import { IsEmpty, IsEnum, IsOptional, IsString } from 'class-validator';

/**
 * The data used to update a user
 */
export class UpdateUserDto {
  @IsOptional()
  @IsEnum(RSVPStatus)
  @IsEmpty()
  @ApiProperty({ required: false, enum: RSVPStatus, nullable: true })
  defaultStatus: RSVPStatus | null;
}
