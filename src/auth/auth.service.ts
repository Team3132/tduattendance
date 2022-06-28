import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Profile as DiscordProfile } from 'passport-discord';
import { PrismaService } from 'src/prisma/prisma.service';
@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
  ) {}
  validateDiscordUser(
    accessToken: string,
    refreshToken: string,
    user: DiscordProfile,
  ) {
    const { guilds } = user;
    if (
      !guilds
        .map((guild) => guild.id)
        .includes(this.configService.getOrThrow('GUILD_ID'))
    )
      throw new UnauthorizedException('You are not in the TDU Discord Server');

    return this.prismaService.user.upsert({
      where: {
        id: user.id,
      },
      create: {
        id: user.id,
        discordRefreshToken: refreshToken,
        discordToken: accessToken,
      },
      update: {
        discordRefreshToken: refreshToken,
        discordToken: accessToken,
      },
    });
  }
}
