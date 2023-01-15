import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Profile as DiscordProfile } from 'passport-discord';
import { PrismaService } from '../prisma/prisma.service';
import { BotService } from '@/bot/bot.service';
@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
    private readonly botService: BotService,
  ) {}
  private readonly logger = new Logger(AuthService.name);

  async validateDiscordUser(access_token: string, user: DiscordProfile) {
    const { guilds } = user;
    if (
      !guilds
        .map((guild) => guild.id)
        .includes(this.configService.getOrThrow('GUILD_ID'))
    )
      throw new UnauthorizedException('You are not in the TDU Discord Server');

    this.logger.debug(`${user.username}#${user.discriminator} logged in!`);
    const discordUser = await this.botService.getGuildMember(user.id);

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
        ...getName(discordUser.nickname ?? discordUser.user.username),
        roles: [...discordUser.roles.cache.mapValues((v) => v.id).values()],
      },
      update: {
        roles: [...discordUser.roles.cache.mapValues((v) => v.id).values()],
      },
    });
  }
}
