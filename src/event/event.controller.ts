import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Put,
  Query,
} from '@nestjs/common';
import { EventService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { SessionGuard } from '../auth/guard/session.guard';
import { Roles } from '../auth/decorators/DiscordRoleDecorator.decorator';
import { ROLES } from '../constants';
import {
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Event } from './entities/event.entity';
import { RsvpService } from '../rsvp/rsvp.service';
import { Rsvp } from '../rsvp/entities/rsvp.entity';
import { Attendance } from '../attendance/entities/attendance.entity';
import { AttendanceService } from '../attendance/attendance.service';
import { GetUser } from '../auth/decorators/GetUserDecorator.decorator';
import { UpdateOrCreateRSVP } from './dto/update-rsvp.dto';
import { UpdateOrCreateAttendance } from './dto/update-attendance.dto';
import { ScancodeService } from 'src/scancode/scancode.service';
import { AttendanceStatus } from '@prisma/client';
import { ScaninDto } from './dto/scanin.dto';
import { GetEventsDto } from './dto/get-events.dto';

@ApiTags('Event')
@ApiCookieAuth()
@UseGuards(SessionGuard)
@Controller('event')
export class EventController {
  constructor(
    private readonly eventService: EventService,
    private readonly rsvpService: RsvpService,
    private readonly attendanceService: AttendanceService,
    private readonly scancodeService: ScancodeService,
  ) {}

  /**
   * Get all events
   * @returns List of events
   */
  @ApiOkResponse({ type: [Event] })
  @Get()
  findAll(@Query() eventsGet: GetEventsDto) {
    const { from, to, take } = eventsGet;
    return this.eventService.events({
      take,
      where: {
        AND: [
          {
            OR: [
              {
                startDate: {
                  lte: to,
                },
              },
              {
                endDate: {
                  lte: to,
                },
              },
            ],
          },
          {
            OR: [
              {
                startDate: {
                  gte: from,
                },
              },
              {
                endDate: {
                  gte: from,
                },
              },
            ],
          },
        ],
      },
    });
  }

  /**
   * Create a new event
   * @param createEventDto The event creation data
   * @returns Event
   */
  @ApiOkResponse({ type: Event })
  @Roles([ROLES.ADMIN])
  @Post()
  create(@Body() createEventDto: CreateEventDto) {
    return this.eventService.createEvent(createEventDto);
  }

  /**
   * Get a specific event
   * @returns Event
   */
  @ApiOkResponse({ type: Event })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventService.event({ id });
  }

  /**
   * Update an event.
   * @param updateEventDto Event Update Data
   * @returns Event
   */
  @ApiOkResponse({ type: Event })
  @Roles([ROLES.ADMIN])
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
    return this.eventService.updateEvent({
      data: updateEventDto,
      where: { id },
    });
  }

  /**
   * Delete an event
   * @returns Event
   */
  @ApiOkResponse({ type: Event })
  @Roles([ROLES.ADMIN])
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.eventService.deleteEvent(id);
  }

  /**
   * Get a user's rsvp status for an event.
   * @returns RSVP
   */
  @ApiOkResponse({ type: Rsvp })
  @Get(':eventId/rsvp')
  getEventRsvp(
    @Param('eventId') eventId: string,
    @GetUser('id') userId: string,
  ) {
    return this.rsvpService.firstRSVP({
      eventId,
      userId,
    });
  }

  /**
   * Set a logged in user's RSVP status for an event.
   * @param setRSVPDto RSVP status
   * @returns RSVP
   */
  @ApiCreatedResponse({ type: Rsvp })
  @Post(':eventId/rsvp')
  async setEventRsvp(
    @Param('eventId') eventId: string,
    @GetUser('id') userId: string,
    @Body() setRSVPDto: UpdateOrCreateRSVP,
  ) {
    const existingRSVP = await this.rsvpService.firstRSVP({ eventId, userId });

    return this.rsvpService.upsertRSVP({
      where: {
        id: existingRSVP?.id ?? '',
      },
      create: {
        event: { connect: { id: eventId } },
        user: {
          connect: { id: userId },
        },
        ...setRSVPDto,
      },
      update: {
        ...setRSVPDto,
      },
    });
  }

  /**
   * Get an event's asociated RSVPs
   * @returns List of RSVP
   */
  @ApiOkResponse({ type: [Rsvp] })
  @Get(':eventId/rsvps')
  getEventRsvps(@Param('eventId') eventId: string) {
    return this.rsvpService.rsvps({
      where: {
        eventId,
      },
    });
  }

  /**
   * Get a user's attendance status for an event
   * @returns Attendance
   */
  @ApiOkResponse({ type: Attendance })
  @UseGuards(SessionGuard)
  @Get(':eventId/attendance')
  getEventAttendance(
    @Param('eventId') eventId: string,
    @GetUser('id') userId: string,
  ) {
    return this.attendanceService.firstAttendance({
      eventId,
      userId,
    });
  }

  /**
   * Set a user's attendance status for an event.
   * @param setRSVPDto RSVP Status Data
   * @returns Attendance
   */
  @ApiCreatedResponse({ type: Attendance })
  @Post(':eventId/attendance')
  async setEventAttendance(
    @Param('eventId') eventId: string,
    @GetUser('id') userId: string,
    @Body() setRSVPDto: UpdateOrCreateAttendance,
  ) {
    const existingAttendance = await this.attendanceService.firstAttendance({
      eventId,
      userId,
    });

    return this.attendanceService.upsertAttendance({
      where: {
        id: existingAttendance?.id ?? '',
      },
      create: {
        event: { connect: { id: eventId } },
        user: {
          connect: { id: userId },
        },
        ...setRSVPDto,
      },
      update: {
        ...setRSVPDto,
      },
    });
  }

  /**
   * Get an event's asociated attendances
   * @returns List of attendance
   */
  @ApiOkResponse({ type: [Attendance] })
  @Get(':eventId/attendances')
  getEventAttendances(@Param('eventId') eventId: string) {
    return this.attendanceService.attendances({
      where: {
        eventId,
      },
    });
  }

  @ApiCreatedResponse({ type: Attendance })
  @Post(':eventId/scanin')
  async scaninEvent(
    @Param('eventId') eventId: string,
    @Body() { code }: ScaninDto,
  ) {
    const scancode = await this.scancodeService.scancode({ code });
    const existingAttendance = await this.attendanceService.firstAttendance({
      userId: scancode.userId,
      eventId,
    });
    return this.attendanceService.upsertAttendance({
      where: {
        id: existingAttendance?.id ?? '',
      },
      create: {
        event: { connect: { id: eventId } },
        user: {
          connect: { id: scancode.userId },
        },
        status: AttendanceStatus.ATTENDED,
      },
      update: {
        status:
          existingAttendance?.status !== AttendanceStatus.ATTENDED
            ? AttendanceStatus.ATTENDED
            : AttendanceStatus.NOT_ATTENDED,
      },
    });
  }
}
