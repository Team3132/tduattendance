import { ApiProperty } from '@nestjs/swagger';
import {
  Attendance as PrismaAttendance,
  AttendanceStatus,
} from '@prisma/client';

export class Attendance implements PrismaAttendance {
  @ApiProperty()
  id: string;
  @ApiProperty()
  eventId: string;
  @ApiProperty()
  userId: string;
  @ApiProperty({ enum: AttendanceStatus, name: 'AttendanceStatus' })
  status: AttendanceStatus;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  updatedAt: Date;
}
