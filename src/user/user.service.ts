import { CACHE_MANAGER, Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma } from '@prisma/client';
import { Cache } from 'cache-manager';
import { randomUUID } from 'crypto';
import {
  APIGuildMember,
  RESTGetAPIGuildMemberResult,
} from 'discord-api-types/v10';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { v4 as uuid } from 'uuid';
import { AuthService } from '@auth/auth.service';
import { DiscordService } from '@discord/discord.service';
import { ROLES } from '@/constants';

@Injectable()
export class UserService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly discordService: DiscordService,
    private readonly authService: AuthService,
  ) {}
  private readonly logger = new Logger(UserService.name);

  users(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }) {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prismaService.user.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  user(userWhereUniqueInput: Prisma.UserWhereUniqueInput) {
    return this.prismaService.user.findUnique({
      where: userWhereUniqueInput,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        calendarSecret: true,
        createdAt: true,
        updatedAt: true,
        roles: true,
      },
    });
  }

  updateUser(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }) {
    const { data, where } = params;
    return this.prismaService.user.update({
      data,
      where,
    });
  }

  regenerateCalendarSecret(where: Prisma.UserWhereUniqueInput) {
    this.logger.log(
      `User with id: ${where.id} calendar secret was regenerated.`,
    );
    return this.prismaService.user.update({
      where,
      data: {
        calendarSecret: uuid(),
      },
    });
  }

  deleteUser(where: Prisma.UserWhereUniqueInput) {
    return this.prismaService.user.delete({ where });
  }

  async discordProfile(userId: string): Promise<APIGuildMember> {
    return this.discordService.getDiscordMemberDetails(userId);
  }

  async outreachReport(userId: string, from?: string, to?: string) {
    try {
      const rsvps = await this.prismaService.rSVP.findMany({
        where: {
          userId,
          createdAt: {
            gte: from ? new Date(from) : undefined,
            lte: to ? new Date(to) : undefined,
          },
          attended: {
            equals: true,
          },
          event: {
            type: {
              in: 'Outreach',
            },
          },
        },
        select: {
          event: {
            select: {
              startDate: true,
              endDate: true,
            },
          },
        },
      });

      const { eventCount, hourCount } = rsvps.reduce(
        (acc, rsvp) => {
          const { startDate, endDate } = rsvp.event;
          const hours = endDate.getTime() - startDate.getTime();
          acc.hourCount += hours;
          acc.eventCount += 1;
          return acc;
        },
        { eventCount: 0, hourCount: 0 },
      );

      return { eventCount, hourCount: hourCount / 1000 / 60 / 60 };
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
