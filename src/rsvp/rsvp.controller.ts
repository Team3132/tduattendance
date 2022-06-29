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
import { RsvpService } from './rsvp.service';
import { CreateRsvpDto } from './dto/create-rsvp.dto';
import { UpdateRsvpDto } from './dto/update-rsvp.dto';
import { ApiCookieAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { SessionGuard } from 'src/auth/guard/session.guard';
import { GetUser } from 'src/auth/decorators/GetUserDecorator.decorator';
import { Rsvp } from './entities/rsvp.entity';

@ApiTags('RSVP')
@ApiCookieAuth()
@UseGuards(SessionGuard)
@Controller('rsvp')
export class RsvpController {
  constructor(private readonly rsvpService: RsvpService) {}

  @ApiOkResponse({ type: Rsvp })
  @Post()
  create(@Body() createRsvpDto: CreateRsvpDto, @GetUser('id') userId: string) {
    return this.rsvpService.createRSVP({
      event: {
        connect: { id: createRsvpDto.eventId },
      },
      user: {
        connect: { id: userId },
      },
      status: createRsvpDto.status,
    });
  }

  @ApiOkResponse({ type: [Rsvp] })
  @Get()
  findAll() {
    return this.rsvpService.rsvps({ where: {} });
  }

  @ApiOkResponse({ type: Rsvp })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rsvpService.rsvp({ id });
  }

  // Owner or admin only
  @ApiOkResponse({ type: Rsvp })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRsvpDto: UpdateRsvpDto) {
    return this.rsvpService.updateRSVP({ where: { id }, data: updateRsvpDto });
  }

  // Owner or admin only
  @ApiOkResponse({ type: Rsvp })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rsvpService.deleteRSVP({ id });
  }
}
