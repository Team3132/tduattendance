import { ApiProperty, PartialType } from '@nestjs/swagger';
import { AttendanceStatus } from '@prisma/client';
import { IsString, IsEnum, IsOptional } from 'class-validator';
import { CreateAttendanceDto } from './create-attendance.dto';

/**
 * The data used to update an attendance
 */
export class UpdateAttendanceDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  eventId?: string;
  @IsString()
  @ApiProperty()
  @IsOptional()
  userId?: string;
  @IsEnum(AttendanceStatus)
  @ApiProperty({ enum: AttendanceStatus })
  @IsOptional()
  status?: AttendanceStatus;
}
