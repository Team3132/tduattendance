import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { REST } from '@discordjs/rest';
import { RESTGetAPIGuildMemberResult, Routes } from 'discord-api-types/v10';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { ROLES } from 'src/constants';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
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

      // type RefreshResponse = {
      //   access_token: string;
      //   /** 604800 */
      //   expires_in: number;
      //   refresh_token: string;
      //   scope: 'guilds identify';
      //   token_type: 'Bearer';
      // };

      // const params = new URLSearchParams();
      // params.append(
      //   'client_id',
      //   this.configService.getOrThrow('DISCORD_CLIENT_ID'),
      // );
      // params.append(
      //   'client_secret',
      //   this.configService.getOrThrow('DISCORD_SECRET'),
      // );
      // params.append('grant_type', 'refresh_token');
      // params.append('refresh_token', prismaUser.discordRefreshToken);

      // const { data } = await axios.post<RefreshResponse>(
      //   'https://discord.com/api/oauth2/token',
      //   params,
      // );

      // await this.prismaService.user.update({
      //   where: { id: user.id },
      //   data: {
      //     discordRefreshToken: data.refresh_token,
      //     discordToken: data.access_token,
      //   },
      // });
      const guildId = this.configService.getOrThrow('GUILD_ID');
      const {
        data: { roles: discordRoles },
      } = await axios.get<RESTGetAPIGuildMemberResult>(
        `https://discord.com/api/users/@me/guilds/${guildId}/member`,
        {
          headers: {
            Authorization: `Bearer ${prismaUser.discordToken}`,
          },
        },
      );

      const hasRole = discordRoles.some((discordRole) =>
        apiRoles.some((apiRole) => apiRole === discordRole),
      );
      return hasRole;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}
