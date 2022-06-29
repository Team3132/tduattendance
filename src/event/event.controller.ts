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
import { EventService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { SessionGuard } from 'src/auth/guard/session.guard';
import { Roles } from 'src/auth/decorators/DiscordRoleDecorator.decorator';
import { ROLES } from 'src/constants';
import { ApiCookieAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Event } from './entities/event.entity';

@ApiTags('Event')
@ApiCookieAuth()
@UseGuards(SessionGuard)
@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @ApiOkResponse({ type: Event })
  @Roles([ROLES.STUDENT])
  @Post()
  create(@Body() createEventDto: CreateEventDto) {
    return this.eventService.createEvent(createEventDto);
  }

  @ApiOkResponse({ type: [Event] })
  @Get()
  findAll() {
    return this.eventService.events({});
  }

  @ApiOkResponse({ type: Event })
  @Get(':id')
  findOne(@Param('id') id: string) {
    console.log(id);
    return this.eventService.event({ id });
  }

  @ApiOkResponse({ type: Event })
  @Roles([ROLES.STUDENT])
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
    return this.eventService.updateEvent({
      data: updateEventDto,
      where: { id },
    });
  }

  @ApiOkResponse({ type: Event })
  @Roles([ROLES.STUDENT])
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.eventService.deleteEvent({ id });
  }
}
