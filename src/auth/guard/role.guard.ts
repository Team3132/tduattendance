import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
  CACHE_MANAGER,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { REST } from '@discordjs/rest';
import { RESTGetAPIGuildMemberResult, Routes } from 'discord-api-types/v10';
import { PrismaService } from '../../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { ROLE, ROLES } from '@/constants';
import { Cache } from 'cache-manager';
import { AuthService } from '@auth/auth.service';
import { DiscordService } from '@discord/discord.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,

    private readonly authService: AuthService,
    private readonly discordService: DiscordService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const logger = new Logger('RoleGuard');
    try {
      const apiRoles = this.reflector
        .get<ROLE[]>('roles', context.getHandler())
        ?.map((role) => ROLES[role]);
      if (!apiRoles) {
        return true;
      }
      const request = context.switchToHttp().getRequest();
      const user = request.user;
      const { roles: fetchedRoles } =
        await this.discordService.getDiscordMemberDetails(user['id']);

      return fetchedRoles.some((discordRole) =>
        apiRoles.some((apiRole) => apiRole === discordRole),
      );
    } catch (error) {
      logger.error(error);
      return false;
    }
  }
}
