import { ApiProperty } from '@nestjs/swagger';
import {
  Attendance as PrismaAttendance,
  AttendanceStatus,
} from '@prisma/client';

/**
 * The Attendance object
 */
export class Attendance implements PrismaAttendance {
  @ApiProperty()
  id: string;
  @ApiProperty()
  eventId: string;
  @ApiProperty()
  userId: string;
  @ApiProperty({ enum: AttendanceStatus })
  status: AttendanceStatus;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  updatedAt: Date;
}
