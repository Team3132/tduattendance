import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Session,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { SessionGuard } from 'src/auth/guard/session.guard';
import { GetUser } from 'src/auth/decorators/GetUserDecorator.decorator';
import {
  ApiCookieAuth,
  ApiOkResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/DiscordRoleDecorator.decorator';
import { ROLES } from 'src/constants';
import { User } from './entities/user.entity';
import { Attendance } from 'src/attendance/entities/attendance.entity';
import { AttendanceService } from 'src/attendance/attendance.service';
import { RsvpService } from 'src/rsvp/rsvp.service';
import { Rsvp } from 'src/rsvp/entities/rsvp.entity';

/** The user controller for controlling the user status */
@ApiTags('User')
@ApiCookieAuth()
@UseGuards(SessionGuard)
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly attendanceService: AttendanceService,
    private readonly rsvpService: RsvpService,
  ) {}

  /**
   * Get the currently authenticated user.
   * @returns User
   */
  @ApiCookieAuth()
  @UseGuards(SessionGuard)
  @ApiOkResponse({ type: User })
  @Get('me')
  me(@GetUser('id') id: string) {
    return this.userService.user({ id });
  }

  /**
   * Get the attendance of the logged in user.
   * @returns
   */
  @ApiCookieAuth()
  @UseGuards(SessionGuard)
  @ApiOkResponse({ type: [Attendance] })
  @Get('me/attendance')
  meAttendance(@GetUser('id') id: string) {
    return this.attendanceService.attendances({ where: { userId: id } });
  }

  /**
   * Get the RSVPs of the logged in user.
   * @returns RSVP
   */
  @ApiCookieAuth()
  @UseGuards(SessionGuard)
  @ApiOkResponse({ type: [Rsvp] })
  @Get('me/rsvp')
  meRSVP(@GetUser('id') id: string) {
    return this.rsvpService.rsvps({ where: { userId: id } });
  }

  /**
   * Edit the signed-in user.
   * @param updateUserDto
   * @returns
   */
  @ApiOkResponse({ type: User })
  @ApiCookieAuth()
  @UseGuards(SessionGuard)
  @Patch('me')
  update(@GetUser('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateUser({ where: { id }, data: updateUserDto });
  }

  /**
   * Delete the signed in user.
   * @returns User
   */
  @ApiOkResponse({ type: User })
  @ApiCookieAuth()
  @UseGuards(SessionGuard)
  @Delete('me')
  remove(
    @GetUser('id') id: string,
    @Session() session: Express.Request['session'],
  ) {
    session.destroy((callback) => {});
    return this.userService.deleteUser({ id });
  }

  /**
   * Get a list of all users.
   * @returns List of Users
   */
  @ApiCookieAuth()
  @UseGuards(SessionGuard)
  @ApiOkResponse({ type: [User] })
  @Roles([ROLES.STUDENT])
  @Get()
  users() {
    return this.userService.users({});
  }

  /**
   * Get a specific user.
   * @param userId The actionable user.
   * @returns List of Users
   */
  @ApiCookieAuth()
  @UseGuards(SessionGuard)
  @ApiOkResponse({ type: User })
  @Roles([ROLES.STUDENT])
  @Get(':id')
  user(@Param('id') userId: string) {
    return this.userService.user({ id: userId });
  }

  /**
   * Edit a user.
   * @param updateUserDto New user info.
   * @returns User
   */
  @ApiCookieAuth()
  @UseGuards(SessionGuard)
  @ApiOkResponse({ type: User })
  @Roles([ROLES.STUDENT])
  @Patch(':id')
  updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateUser({ where: { id }, data: updateUserDto });
  }

  /**
   * Delete a user.
   * @returns User
   */
  @ApiOkResponse({ type: User })
  @ApiCookieAuth()
  @UseGuards(SessionGuard)
  @Roles([ROLES.STUDENT])
  @Delete(':id')
  removeUser(@Param('id') id: string) {
    return this.userService.deleteUser({ id });
  }

  /**
   * Get a user's RSVPs
   * @returns List of RSVP
   */
  @ApiCookieAuth()
  @UseGuards(SessionGuard)
  @ApiOkResponse({ type: [Rsvp] })
  @Roles([ROLES.STUDENT])
  @Get(':id/rsvp')
  userRSVPs(@Param('id') userId: string) {
    return this.rsvpService.rsvps({
      where: {
        userId: userId,
      },
    });
  }

  /**
   * Get a user's attendance
   * @returns List of attendances
   */
  @ApiCookieAuth()
  @UseGuards(SessionGuard)
  @ApiOkResponse({ type: [Attendance] })
  @Roles([ROLES.STUDENT])
  @Get(':id/attendance')
  userAttendance(@Param('id') userId: string) {
    return this.attendanceService.attendances({ where: { userId: userId } });
  }
}
