import {
  Controller,
  Get,
  Redirect,
  Req,
  Res,
  Session,
  UseGuards,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { Request, Response as ExpressResponse, Response } from 'express';
import { ROLES } from 'src/constants';
import { DiscordService } from 'src/discord/discord.service';
import { AuthService } from './auth.service';
import { GetUser } from './decorators/GetUserDecorator.decorator';
import { AuthStatusDto } from './dto/AuthStatus.dto';
import { DiscordAuthGuard } from './guard/discord.guard';
import { SessionGuard } from './guard/session.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly discordService: DiscordService,
  ) {}
  /**
   * Auth Status
   * @returns Session metadata (if it exists)
   */
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
  @UseGuards(DiscordAuthGuard)
  @Get('discord')
  discordSignin() {}

  /**
   * Sign in using discord (callback)
   * @returns close window script
   */
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
