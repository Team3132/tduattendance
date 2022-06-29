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
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { SessionGuard } from 'src/auth/guard/session.guard';
import { GetUser } from 'src/auth/decorators/GetUserDecorator.decorator';
import { ApiCookieAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/DiscordRoleDecorator.decorator';
import { ROLES } from 'src/constants';
import { User } from './entities/user.entity';

@ApiTags('User')
@ApiCookieAuth()
@UseGuards(SessionGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiCookieAuth()
  @UseGuards(SessionGuard)
  @ApiOkResponse({ type: User })
  @Get('me')
  me(@GetUser('id') id: string) {
    return this.userService.user({ id });
  }

  @ApiOkResponse({ type: User })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.user({ id });
  }

  @ApiOkResponse({ type: User })
  @ApiCookieAuth()
  @UseGuards(SessionGuard)
  @Patch('me')
  update(@GetUser('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateUser({ where: { id }, data: updateUserDto });
  }

  @ApiOkResponse({ type: User })
  @ApiCookieAuth()
  @UseGuards(SessionGuard)
  @Delete('me')
  remove(@GetUser('id') id: string) {
    return this.userService.deleteUser({ id });
  }
}
