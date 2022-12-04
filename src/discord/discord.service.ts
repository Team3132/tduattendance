import { REST } from '@discordjs/rest';
import {
  CACHE_MANAGER,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Cache } from 'cache-manager';
import { RedisCache } from 'cache-manager-redis-yet';
import {
  RESTPostOAuth2RefreshTokenResult,
  RESTGetAPIGuildMemberResult,
  Routes,
} from 'discord-api-types/v10';
import { PrismaService } from '@prisma/prisma.service';

@Injectable()
export class DiscordService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: RedisCache,
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
  ) {}
  private readonly logger = new Logger(DiscordService.name);

  async getDiscordToken(userId: string) {
    const token = await this.cacheManager.get<string>(
      `discorduser/${userId}/accesstoken`,
    );
    if (token) {
      return token;
    } else {
      this.logger.debug(`Fetching Discord Token ${userId}`);
      const prismaUser = await this.prismaService.user.findUnique({
        where: { id: userId },
      });

      const discordSecret = await this.configService.getOrThrow<string>(
        'DISCORD_SECRET',
      );

      const discordclient = await this.configService.getOrThrow<string>(
        'DISCORD_CLIENT_ID',
      );

      const fetchAlternative = await fetch(
        'https://discord.com/api/v10/oauth2/token',
        {
          method: 'POST',
          body: new URLSearchParams({
            client_id: discordclient,
            client_secret: discordSecret,
            grant_type: 'refresh_token',
            refresh_token: prismaUser?.discordRefreshToken,
            scope: ['identify', 'guilds', 'guilds.members.read'].join(' '),
          }),
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );

      const tokenExchangeResponse =
        (await fetchAlternative.json()) as RESTPostOAuth2RefreshTokenResult;

      const { refresh_token, access_token, expires_in } = tokenExchangeResponse;

      await this.cacheManager.set(
        `discorduser/${userId}/accesstoken`,
        access_token,
        expires_in,
      );

      await this.prismaService.user.update({
        where: { id: prismaUser.id },
        data: { discordRefreshToken: refresh_token },
      });

      return access_token;
    }
  }

  async getDiscordMemberDetails(userId: string, initialToken?: string) {
    const token = initialToken ?? (await this.getDiscordToken(userId));

    const cachedUser = await this.cacheManager.get<RESTGetAPIGuildMemberResult>(
      `discorduser/guild/${userId}`,
    );

    if (cachedUser) {
      // this.logger.debug(`Returning Cached User ${userId}`);
      return cachedUser;
    } else {
      this.logger.debug(`Fetching Guild Member ${userId}`);
      const guildId = this.configService.getOrThrow('GUILD_ID');

      const fetchDiscordUser = await fetch(
        `https://discord.com/api/v10/users/@me/guilds/${guildId}/member`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (fetchDiscordUser.status !== 200) {
        throw new InternalServerErrorException(
          `Discord API returned ${fetchDiscordUser.status}`,
        );
      }

      const discordUser =
        (await fetchDiscordUser.json()) as RESTGetAPIGuildMemberResult;

      await this.cacheManager.set(
        `discorduser/guild/${userId}`,
        discordUser,
        3600,
      );

      return discordUser;
    }
  }
}

export const jsonToUrlParams = (data: Record<string, any>) => {
  const params = new FormData();
  for (const key in data) {
    params.append(key, `${data[key]}`);
  }
  return params;
};
