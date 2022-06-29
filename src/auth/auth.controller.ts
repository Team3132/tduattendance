import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { GetUser } from './decorators/GetUserDecorator.decorator';
import { AuthStatusDto } from './dto/AuthStatus.dto';
import { DiscordAuthGuard } from './guard/discord.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  /** Auth Status */
  @ApiOkResponse({ type: AuthStatusDto })
  @Get('status')
  status(@GetUser() user: Express.User): AuthStatusDto {
    return {
      isAuthenticated: !!user,
    };
  }

  /** Sign in using discord */
  @UseGuards(DiscordAuthGuard)
  @Get('discord')
  discordSignin() {}

  /** Sign in using discord (callback) */
  @UseGuards(DiscordAuthGuard)
  @Get('discord/callback')
  discordSigninCallback() {
    return '<script>window.close();</script >';
  }
}
