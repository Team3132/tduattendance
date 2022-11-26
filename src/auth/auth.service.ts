import {
  CACHE_MANAGER,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { Cache } from 'cache-manager';
import {
  RESTGetAPIGuildMemberResult,
  RESTPostOAuth2RefreshTokenResult,
} from 'discord-api-types/v10';
import { Profile as DiscordProfile } from 'passport-discord';
import { DiscordService } from 'src/discord/discord.service';
import { PrismaService } from '../prisma/prisma.service';
@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
    private readonly discordService: DiscordService,
  ) {}
  private readonly logger = new Logger(AuthService.name);

  async validateDiscordUser(
    refreshToken: string,
    access_token: string,
    user: DiscordProfile,
  ) {
    const { guilds } = user;
    if (
      !guilds
        .map((guild) => guild.id)
        .includes(this.configService.getOrThrow('GUILD_ID'))
    )
      throw new UnauthorizedException('You are not in the TDU Discord Server');

    this.logger.debug(`${user.username}#${user.discriminator} logged in!`);
    const discordUser = await this.discordService.getDiscordMemberDetails(
      user.id,
      access_token,
    );

    const getName = (
      nick: string,
    ): { firstName: string; lastName: string | undefined } => {
      const fullSplitName = nick.split(/(?=[A-Z])/);

      return {
        firstName: nick ? fullSplitName[0] : undefined,
        lastName: nick
          ? fullSplitName.length > 1
            ? fullSplitName[1]
            : undefined
          : undefined,
      };
    };

    return this.prismaService.user.upsert({
      where: {
        id: user.id,
      },
      create: {
        id: user.id,
        discordRefreshToken: refreshToken,
        ...getName(discordUser?.nick ?? discordUser.user.username),
      },
      update: {
        discordRefreshToken: refreshToken,
      },
    });
  }
}
