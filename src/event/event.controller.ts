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
  ClassSerializerInterceptor,
  UseInterceptors,
  NotFoundException,
  CacheInterceptor,
  BadRequestException,
  Res,
  Redirect,
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
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
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
import { RSVP } from '@prisma/client';
import { EventResponse, EventResponseType } from './dto/event-response.dto';
import { EventSecret } from './dto/event-secret.dto';
import { ApiReponseTypeNotFound } from 'src/standard-error.entity';
import { AuthenticatorService } from 'src/authenticator/authenticator.service';
import { ConfigService } from '@nestjs/config';

@ApiTags('Event')
@ApiCookieAuth()
@UseGuards(SessionGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Controller('event')
export class EventController {
  constructor(
    private readonly eventService: EventService,
    private readonly rsvpService: RsvpService,
    private readonly scancodeService: ScancodeService,
    private readonly authenticatorService: AuthenticatorService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Get all events
   * @returns {Event[]}
   */
  @ApiOkResponse({ type: [EventResponseType] })
  @ApiOperation({ description: 'Get all events', operationId: 'getEvents' })
  @Get()
  async findAll(@Query() eventsGet: GetEventsDto) {
    const { from, to, take } = eventsGet;
    const events = await this.eventService.events({
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

    return events.map((event) => new EventResponse(event));
  }

  /**
   * Create a new event
   * @param createEventDto The event creation data
   * @returns {Event}
   */
  @ApiOperation({
    description: 'Create a new event',
    operationId: 'createEvent',
  })
  @ApiCreatedResponse({ type: EventResponseType })
  @Roles([ROLES.MENTOR])
  @Post()
  async create(@Body() createEventDto: CreateEventDto) {
    const event = await this.eventService.createEvent(createEventDto);
    return new EventResponse(event);
  }

  /**
   * Get a specific event
   * @returns {Event}
   */
  @ApiOperation({
    description: 'Get a specific event',
    operationId: 'getEvent',
  })
  @ApiNotFoundResponse({ type: ApiReponseTypeNotFound })
  @ApiOkResponse({ type: EventResponseType })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const event = await this.eventService.event({ id });
    if (!event) {
      throw new NotFoundException('Event not found');
    }
    return new EventResponse(event);
  }

  /**
   * Get a specific event secret
   * @returns {EventSecret}
   */
  @ApiOperation({
    description: 'Get a specific event secret',
    operationId: 'getEventSecret',
  })
  @Roles([ROLES.MENTOR])
  @ApiOkResponse({ type: EventSecret })
  @ApiNotFoundResponse({ type: ApiReponseTypeNotFound })
  @Get(':eventId/token')
  async getEventSecret(@Param('eventId') eventId: string) {
    const event = await this.eventService.event({ id: eventId });
    if (!event) {
      throw new NotFoundException('Event not found');
    }

    return new EventSecret(event);
  }

  /**
   * Callback for the successful token
   */
  @ApiOperation({
    description: 'Callback for a successful token',
    operationId: 'getEventSecretCallback',
  })
  @Get(':eventId/token/callback')
  @Redirect()
  async eventTokenCallback(
    @Query('code') code: string,
    @Param('eventId') eventId: string,
    @GetUser('id') userId: string,
  ) {
    await this.eventService.verifyUserEventToken(eventId, userId, code);
    return {
      url:
        this.configService.get('NODE_ENV') === 'production'
          ? `https://attendance.team3132.com/calendar`
          : `https://localhost:4000/calendar`,
    };
  }

  /**
   * Update an event.
   * @param updateEventDto Event Update Data
   * @returns {EventResponseType}
   */
  @ApiOperation({ description: 'Update an event', operationId: 'updateEvent' })
  @ApiOkResponse({ type: EventResponseType })
  @Roles([ROLES.MENTOR])
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateEventDto: UpdateEventDto,
  ) {
    const event = await this.eventService.updateEvent({
      data: updateEventDto,
      where: { id },
    });
    return new EventResponse(event);
  }

  /**
   * Delete an event
   * @returns {EventResponseType}
   */
  @ApiOperation({ description: 'Delete an event', operationId: 'deleteEvent' })
  @ApiOkResponse({ type: EventResponseType })
  @Roles([ROLES.MENTOR])
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const event = await this.eventService.deleteEvent(id);
    return new EventResponse(event);
  }

  /**
   * Get a user's rsvp status for an event.
   * @returns {Rsvp}
   */
  @ApiOperation({
    description: "Get a user's rsvp status for an event",
    operationId: 'getEventRsvp',
  })
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
   * @returns {Rsvp}
   */
  @ApiOperation({
    description: "Set a logged in user's RSVP status for an event",
    operationId: 'setEventRsvp',
  })
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
   * @returns {Rsvp[]}
   */
  @ApiOperation({
    description: 'Update RSVP Status of Events in range',
    operationId: 'updateEventRsvpRange',
  })
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
   * @returns {Rsvp[]}
   */
  @ApiOperation({
    description: "Get an event's asociated RSVPs",
    operationId: 'getEventRsvps',
  })
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
   * @returns {Rsvp}
   */
  @ApiOperation({
    description: 'RSVP to an event by using a scancode',
    operationId: 'scaninEvent',
  })
  @ApiCreatedResponse({ type: Rsvp })
  @ApiBadRequestResponse({ description: 'Invalid Scancode' })
  @Post(':eventId/scanin')
  scanin(@Param('eventId') eventId: string, @Body() scanin: ScaninDto) {
    const { code } = scanin;
    return this.rsvpService.scanin({ eventId, code });
  }
}
