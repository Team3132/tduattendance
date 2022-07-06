import { ApiProperty } from '@nestjs/swagger';
import { Attendance, AttendanceStatus } from '@prisma/client';
import { IsEnum, IsString } from 'class-validator';

/**
 * The data used to create an attendance object
 */
export class CreateAttendanceDto {
  @ApiProperty()
  @IsString()
  eventId: string;
  @IsString()
  @ApiProperty()
  userId: string;
  @IsEnum(AttendanceStatus)
  @ApiProperty({ enum: AttendanceStatus })
  status: AttendanceStatus;
}
