import { ApiProperty } from '@nestjs/swagger';
import { AttendanceStatus, RSVPStatus } from '@prisma/client';
import { IsEnum, IsNotEmpty, isNotEmpty } from 'class-validator';

/**
 * The data used to edit or create a new attendance.
 */
export class UpdateOrCreateAttendance {
  @IsNotEmpty()
  @ApiProperty({ enum: AttendanceStatus })
  status: AttendanceStatus;
}
