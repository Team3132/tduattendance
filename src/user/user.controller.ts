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
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/DiscordRoleDecorator.decorator';
import { ROLES } from 'src/constants';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiCookieAuth()
  @UseGuards(SessionGuard)
  @Get('me')
  me(@GetUser('id') id: string) {
    return this.userService.findOne(id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @ApiCookieAuth()
  @UseGuards(SessionGuard)
  @Patch('me')
  update(@GetUser('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @ApiCookieAuth()
  @UseGuards(SessionGuard)
  @Delete('me')
  remove(@GetUser('id') id: string) {
    return this.userService.remove(id);
  }
}
