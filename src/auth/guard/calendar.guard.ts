import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { DiscordService } from 'src/discord/discord.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthService } from '../auth.service';

@Injectable()
export class CalendarGuard implements CanActivate {
  constructor(private readonly prismaService: PrismaService) {}
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>();
    const secret = request.query['secret'] as string;
    if (!secret) {
      return false;
    }
    const user = await this.prismaService.user.findUnique({
      where: { calendarSecret: secret },
    });
    return !!user;
  }
}
