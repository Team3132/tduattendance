import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
  CACHE_MANAGER,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { REST } from '@discordjs/rest';
import { RESTGetAPIGuildMemberResult, Routes } from 'discord-api-types/v10';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { ROLES } from 'src/constants';
import { Cache } from 'cache-manager';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const apiRoles = this.reflector.get<ROLES[]>(
        'roles',
        context.getHandler(),
      );
      if (!apiRoles) {
        return true;
      }
      const request = context.switchToHttp().getRequest();
      const user = request.user;
      const prismaUser = await this.prismaService.user.findUnique({
        where: { id: user.id },
      });

      const cachedUser =
        await this.cacheManager.get<RESTGetAPIGuildMemberResult>(
          `discorduser/guild/${user.id}`,
        );
      if (cachedUser) {
        // console.log('Used Cache');
        return cachedUser.roles.some((discordRole) =>
          apiRoles.some((apiRole) => apiRole === discordRole),
        );
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

        return data.roles.some((discordRole) =>
          apiRoles.some((apiRole) => apiRole === discordRole),
        );
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}
