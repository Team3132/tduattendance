import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import {
  ApiCookieAuth,
  ApiOkResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { SessionGuard } from 'src/auth/guard/session.guard';
import { GetUser } from 'src/auth/decorators/GetUserDecorator.decorator';
import { Attendance } from './entities/attendance.entity';
import { Roles } from 'src/auth/decorators/DiscordRoleDecorator.decorator';
import { ROLES } from 'src/constants';

@ApiTags('Attendance')
@ApiCookieAuth()
@UseGuards(SessionGuard)
@Roles([ROLES.STUDENT])
@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  /**
   * Create a new Attendance
   * @param createAttendanceDto Attendance Data
   * @returns Attendance
   */
  @ApiOkResponse({ type: Attendance })
  @Post()
  create(
    @Body() createAttendanceDto: CreateAttendanceDto,
    @GetUser('id') userId: string,
  ) {
    return this.attendanceService.createAttendance({
      event: {
        connect: { id: createAttendanceDto.eventId },
      },
      user: {
        connect: { id: userId },
      },
      status: createAttendanceDto.status,
    });
  }

  /**
   * Get a list of all Attendances
   * @returns List of Attendance
   */
  @ApiOkResponse({ type: [Attendance] })
  @Get()
  findAll() {
    return this.attendanceService.attendances({ where: {} });
  }

  /**
   * Get a specific attendance status
   * @returns Attendance
   */
  @ApiOkResponse({ type: Attendance })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.attendanceService.attendance({ id });
  }

  /**
   * Update an Attendance status
   * @param updateAttendanceDto Attendance Data
   * @returns Attendance
   */
  @ApiOkResponse({ type: Attendance })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAttendanceDto: UpdateAttendanceDto,
  ) {
    return this.attendanceService.updateAttendance({
      where: { id },
      data: updateAttendanceDto,
    });
  }

  /**
   * Delete an attendance
   * @returns Attendance
   */
  @ApiOkResponse({ type: Attendance })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.attendanceService.deleteAttendance({ id });
  }
}
