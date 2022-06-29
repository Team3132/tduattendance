import { ApiProperty } from '@nestjs/swagger';
import { Attendance, AttendanceStatus } from '@prisma/client';
import { IsEnum, IsString } from 'class-validator';

export class CreateAttendanceDto {
  @ApiProperty()
  @IsString()
  eventId: string;
  @IsString()
  @ApiProperty()
  userId: string;
  @IsEnum(AttendanceStatus)
  @ApiProperty({ enum: AttendanceStatus, name: 'AttendanceStatus' })
  status: AttendanceStatus;
}
