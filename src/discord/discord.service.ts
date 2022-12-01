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
import { PrismaService } from 'src/prisma/prisma.service';

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
    if (token !== null) {
      return token;
    } else {
      const prismaUser = await this.prismaService.user.findUnique({
        where: { id: userId },
      });

      const discordSecret = await this.configService.getOrThrow<string>(
        'DISCORD_SECRET',
      );

      const discordclient = await this.configService.getOrThrow<string>(
        'DISCORD_CLIENT_ID',
      );

      const rest = new REST({ version: '10' }).setToken('fake token');

      const tokenExchangeResponse = (await rest.post(
        Routes.oauth2TokenExchange(),
        {
          body: {
            client_id: discordclient,
            client_secret: discordSecret,
            grant_type: 'refresh_token',
            refresh_token: prismaUser?.discordRefreshToken,
            scope: ['identify', 'guilds', 'guilds.members.read'].join(' '),
          },
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      )) as RESTPostOAuth2RefreshTokenResult;

      // const nodeFetched = await fetch(
      //   `https://discord.com/api/v10/oauth2/token`,
      //   {
      //     method: 'POST',
      //     body: new URLSearchParams({
      //       client_id: discordclient,
      //       client_secret: discordSecret,
      //       grant_type: 'refresh_token',
      //       refresh_token: prismaUser.discordRefreshToken,
      //     }),
      //     headers: {
      //       'Content-Type': 'application/x-www-form-urlencoded',
      //     },
      //   },
      // );

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

    const rest = new REST({ version: '10', authPrefix: 'Bearer' }).setToken(
      token,
    );

    const cachedUser = await this.cacheManager.get<RESTGetAPIGuildMemberResult>(
      `discorduser/guild/${userId}`,
    );

    if (cachedUser) {
      this.logger.debug('cached user');
      return cachedUser;
    } else {
      this.logger.debug(`Fetching Guild Member ${userId}`);

      const guildId = this.configService.getOrThrow('GUILD_ID');

      const discordUser = (await rest.get(
        Routes.userGuildMember(guildId),
      )) as RESTGetAPIGuildMemberResult;

      await this.cacheManager.set(
        `discorduser/guild/${userId}`,
        discordUser,
        3600,
      );

      this.logger.debug('fetched user', discordUser);

      return discordUser;
    }
  }
}
