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
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Event')
@ApiCookieAuth()
@UseGuards(SessionGuard)
@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Roles([ROLES.MANAGEMENT])
  @Post()
  create(@Body() createEventDto: CreateEventDto) {
    return this.eventService.create(createEventDto);
  }

  @Get()
  findAll() {
    return this.eventService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventService.findOne(id);
  }

  @Roles([ROLES.MANAGEMENT])
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
    return this.eventService.update(id, updateEventDto);
  }

  @Roles([ROLES.MANAGEMENT])
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.eventService.remove(id);
  }
}
