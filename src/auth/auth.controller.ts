import { Controller, Get, Session, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { AuthService } from './auth.service';
import { GetUser } from './decorators/GetUserDecorator.decorator';
import { AuthStatusDto } from './dto/AuthStatus.dto';
import { DiscordAuthGuard } from './guard/discord.guard';
import { SessionGuard } from './guard/session.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  /**
   * Auth Status
   * @returns Session metadata (if it exists)
   */
  @ApiOkResponse({ type: AuthStatusDto })
  @Get('status')
  async status(@GetUser() user: Express.User): Promise<AuthStatusDto> {
    return {
      isAuthenticated: !!user,
      roles: !!user ? await this.authService.getRoles(user) : [],
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
  @UseGuards(DiscordAuthGuard)
  @Get('discord/callback')
  discordSigninCallback() {
    return '<script>window.close();</script >';
  }

  @UseGuards(SessionGuard)
  @Get('logout')
  async logout(@Session() session: Express.Request['session']) {
    session.destroy(() => {
      return;
    });
  }
}
