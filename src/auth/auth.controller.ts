import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DiscordAuthGuard } from './guard/discord.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  /** Sign in using github */
  @UseGuards(DiscordAuthGuard)
  @Get('discord')
  discordSignin() {}

  /** Sign in using github (callback) */
  @UseGuards(DiscordAuthGuard)
  @Get('discord/callback')
  async discordSigninCallback() {
    return '<script>window.close();</script >';
  }
}
