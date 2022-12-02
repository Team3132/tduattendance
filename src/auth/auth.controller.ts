import {
  Controller,
  ForbiddenException,
  Get,
  Redirect,
  Res,
  Session,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import type { Response } from 'express';
import { ROLES } from 'src/constants';
import { DiscordService } from 'src/discord/discord.service';
import { GetUser } from './decorators/GetUserDecorator.decorator';
import { AuthStatusDto } from './dto/AuthStatus.dto';
import { DiscordAuthGuard } from './guard/discord.guard';
import { SessionGuard } from './guard/session.guard';
import {
  ApiReponseTypeBadRequest,
  ApiReponseTypeForbidden,
} from '../standard-error.entity';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly discordService: DiscordService) {}

  /**
   * Auth Status
   * @returns {AuthStatusDto}
   */
  @ApiOperation({ description: 'Get auth status', operationId: 'authStatus' })
  @ApiOkResponse({ type: AuthStatusDto })
  @Get('status')
  async status(@GetUser() user: Express.User): Promise<AuthStatusDto> {
    const getRoles = async () => {
      if (!user) {
        return [];
      }
      const discordUser = await this.discordService.getDiscordMemberDetails(
        user['id'],
      );
      return discordUser.roles;
    };
    const roles = await getRoles();
    const isAdmin = roles.includes(ROLES.MENTOR);

    return {
      isAuthenticated: !!user,
      roles,
      isAdmin,
    };
  }

  /**
   * Sign in using discord
   */
  @ApiOperation({
    description: 'Sign in using discord',
    operationId: 'discordSignin',
  })
  @UseGuards(DiscordAuthGuard)
  @Get('discord')
  discordSignin() {
    // Operation handled by the discord auth guard
  }

  /**
   * Sign in using discord (callback)
   * @returns close window script
   */
  @ApiOperation({
    description: 'Sign in using discord (callback)',
    operationId: 'discordSigninCallback',
  })
  @Redirect(
    process.env.NODE_ENV === 'production'
      ? 'https://attendance.team3132.com/calendar'
      : 'https://localhost:4000/calendar',
  )
  @UseGuards(DiscordAuthGuard)
  @Get('discord/callback')
  discordSigninCallback() {
    // res.redirect('back');
  }

  @ApiOperation({
    description: 'Sign out',
    operationId: 'signout',
  })
  @UseGuards(SessionGuard)
  @Get('logout')
  async logout(
    @Session() session: Express.Request['session'],
    @Res() res: Response,
  ) {
    session.destroy(() => {
      res.redirect(
        process.env.NODE_ENV === 'production'
          ? 'https://attendance.team3132.com'
          : 'https://localhost:4000',
      );
    });
  }
}
