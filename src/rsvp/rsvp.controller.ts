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
import {
  ApiCookieAuth,
  ApiOkResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { SessionGuard } from '../auth/guard/session.guard';
import { GetUser } from '../auth/decorators/GetUserDecorator.decorator';
import { Rsvp } from './entities/rsvp.entity';
import { Roles } from '../auth/decorators/DiscordRoleDecorator.decorator';
import { ROLES } from '../constants';

@ApiTags('RSVP')
@ApiCookieAuth()
@UseGuards(SessionGuard)
@Controller('rsvp')
export class RsvpController {
  constructor(private readonly rsvpService: RsvpService) {}

  /**
   * Create an RSVP
   * @param createRsvpDto RSVP Create Data
   * @returns
   */
  @Roles([ROLES.ADMIN])
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

  /**
   * Get all RSVPs
   * @returns List of RSVP
   */
  @Roles([ROLES.ADMIN])
  @ApiOkResponse({ type: [Rsvp] })
  @Get()
  findAll() {
    return this.rsvpService.rsvps({ where: {} });
  }

  /**
   * Get a specific RSVP
   * @returns RSVP
   */
  @Roles([ROLES.ADMIN])
  @ApiOkResponse({ type: Rsvp })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rsvpService.rsvp({ id });
  }

  /**
   * Edit a specific RSVP
   * @param updateRsvpDto
   * @returns RSVP
   */
  @Roles([ROLES.ADMIN])
  @ApiOkResponse({ type: Rsvp })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRsvpDto: UpdateRsvpDto) {
    return this.rsvpService.updateRSVP({ where: { id }, data: updateRsvpDto });
  }

  /**
   * Delete an RSVP
   * @returns RSVP
   */
  @Roles([ROLES.ADMIN])
  @ApiOkResponse({ type: Rsvp })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rsvpService.deleteRSVP({ id });
  }
}
