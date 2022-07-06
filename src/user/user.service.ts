import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma } from '@prisma/client';
import axios from 'axios';
import { Cache } from 'cache-manager';
import {
  APIGuildMember,
  RESTGetAPIGuildMemberResult,
} from 'discord-api-types/v10';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly prismaService: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly configService: ConfigService,
  ) {}

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
    return this.prismaService.user.findUnique({ where: userWhereUniqueInput });
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

  deleteUser(where: Prisma.UserWhereUniqueInput) {
    return this.prismaService.user.delete({ where });
  }

  async discordProfile(userId: string): Promise<APIGuildMember> {
    const prismaUser = await this.prismaService.user.findUnique({
      where: { id: userId },
    });

    const cachedUser = await this.cacheManager.get<RESTGetAPIGuildMemberResult>(
      `discorduser/guild/${userId}`,
    );
    if (cachedUser) {
      return cachedUser;
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
        `discorduser/guild/${userId}`,
        data,
        { ttl: 3600 },
      );
      return data;
    }
  }
}
