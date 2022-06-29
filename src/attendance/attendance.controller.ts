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
import { ApiCookieAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { SessionGuard } from 'src/auth/guard/session.guard';
import { AttendanceService } from './attendance.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { Attendance } from './entities/attendance.entity';

@ApiTags('Attendance')
@ApiCookieAuth()
@UseGuards(SessionGuard)
@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @ApiOkResponse({ type: Attendance })
  @Post()
  create(@Body() createAttendanceDto: CreateAttendanceDto) {
    return this.attendanceService.create(createAttendanceDto);
  }

  @ApiOkResponse({ type: [Attendance] })
  @Get()
  findAll() {
    return this.attendanceService.findAll();
  }

  @ApiOkResponse({ type: Attendance })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.attendanceService.findOne(id);
  }

  @ApiOkResponse({ type: Attendance })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAttendanceDto: UpdateAttendanceDto,
  ) {
    return this.attendanceService.update(id, updateAttendanceDto);
  }

  @ApiOkResponse({ type: Attendance })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.attendanceService.remove(id);
  }
}
