import {
  CACHE_MANAGER,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { Cache } from 'cache-manager';
import { RESTGetAPIGuildMemberResult } from 'discord-api-types/v10';
import { Profile as DiscordProfile } from 'passport-discord';
import { PrismaService } from 'src/prisma/prisma.service';
@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
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

  async getRoles(user: any): Promise<string[]> {
    const prismaUser = await this.prismaService.user.findUnique({
      where: { id: user.id },
    });

    const cachedUser = await this.cacheManager.get<RESTGetAPIGuildMemberResult>(
      `discorduser/guild/${user.id}`,
    );
    if (cachedUser) {
      // console.log('Used Cache');
      return cachedUser.roles;
    } else {
      console.log('Getting Roles Again');
      const guildId = this.configService.getOrThrow('GUILD_ID');
      const { data } = await axios.get<RESTGetAPIGuildMemberResult>(
        `https://discord.com/api/users/@me/guilds/${guildId}/member`,
        {
          headers: {
            Authorization: `Bearer ${prismaUser.discordToken}`,
          },
        },
      );
      await this.cacheManager.set<RESTGetAPIGuildMemberResult>(
        `discorduser/guild/${user.id}`,
        data,
        { ttl: 3600 },
      );
      return data.roles;
    }
  }
}
