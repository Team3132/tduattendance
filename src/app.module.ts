import { CacheModule, Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { EventModule } from './event/event.module';
import { RsvpModule } from './rsvp/rsvp.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './auth/guard/role.guard';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import type { ClientOpts } from 'redis';
import { CalendarModule } from './calendar/calendar.module';
import { DiscordModule as DiscordBotModule } from '@discord-nestjs/core';
import { DiscordModule } from './discord/discord.module';
import { ScancodeModule } from './scancode/scancode.module';
import * as redisStore from 'cache-manager-redis-store';
import { Intents } from 'discord.js';
import { BotModule } from './bot/bot.module';

@Module({
  imports: [
    AuthModule,
    PrismaModule,
    ConfigModule.forRoot({ isGlobal: true, cache: true }),
    CacheModule.registerAsync<ClientOpts>({
      isGlobal: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        store: redisStore,
        host: configService.getOrThrow<string>('REDIS_HOST'),
        port: 6379,
        db: 1,
      }),
    }),
    PrismaModule,
    UserModule,
    EventModule,
    RsvpModule,
    CalendarModule,
    DiscordModule,
    ScancodeModule,
    // DiscordBotModule.forRootAsync({
    //   imports: [ConfigModule],
    //   useFactory: (configService: ConfigService) => ({
    //     token: configService.get('DISCORD_TOKEN'),

    //     discordClientOptions: {
    //       intents: [Intents.FLAGS.GUILDS],
    //     },
    //     registerCommandOptions: [
    //       {
    //         forGuild: configService.get('GUILD_ID'),
    //         removeCommandsBefore: true,

    //       },
    //     ],
    //   }),
    //   inject: [ConfigService],
    // }),
    // BotModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
