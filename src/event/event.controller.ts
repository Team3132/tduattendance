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
  BadGatewayException,
} from '@nestjs/common';
import { EventService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { SessionGuard } from '../auth/guard/session.guard';
import { Roles } from '../auth/decorators/DiscordRoleDecorator.decorator';
import { ROLES } from '../constants';
import {
  ApiBadRequestResponse,
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Event } from './entities/event.entity';
import { RsvpService } from '../rsvp/rsvp.service';
import { Rsvp } from '../rsvp/entities/rsvp.entity';
import { GetUser } from '../auth/decorators/GetUserDecorator.decorator';
import { UpdateOrCreateRSVP } from './dto/update-rsvp.dto';
import { ScancodeService } from 'src/scancode/scancode.service';
import { ScaninDto } from './dto/scanin.dto';
import { GetEventsDto } from './dto/get-events.dto';
import { UpdateRangeRSVP } from './dto/update-rsvp-range';

@ApiTags('Event')
@ApiCookieAuth()
@UseGuards(SessionGuard)
@Controller('event')
export class EventController {
  constructor(
    private readonly eventService: EventService,
    private readonly rsvpService: RsvpService,
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
  @ApiCreatedResponse({ type: Event })
  @Roles([ROLES.MENTOR])
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
  @Roles([ROLES.MENTOR])
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
  @Roles([ROLES.MENTOR])
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
    @GetUser('id') userId: Express.User['id'],
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
    @GetUser('id') userId: Express.User['id'],
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
   * Update RSVP Status of Events in range
   */
  @ApiCreatedResponse({ type: [Rsvp] })
  @Post('rsvps')
  async setEventsRsvp(
    @Body() updateRangeRSVP: UpdateRangeRSVP,
    @GetUser('id') userId: Express.User['id'],
  ) {
    const { from, to, status } = updateRangeRSVP;
    const events = await this.eventService.events({
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
    return this.rsvpService.upsertManyRSVP(
      userId,
      events.map((event) => event.id),
      status,
    );
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
   * RSVP to an event by using a scancode
   * @param eventId The event id
   * @param scanin The scanin data (code)
   * @returns RSVP
   */
  @ApiCreatedResponse({ type: Rsvp })
  @ApiBadRequestResponse({ description: 'Invalid Scancode' })
  @Post(':eventId/scanin')
  scanin(@Param('eventId') eventId: string, @Body() scanin: ScaninDto) {
    const { code } = scanin;
    return this.rsvpService.scanin({ eventId, code });
  }
}
