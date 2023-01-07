import {
  CacheModule,
  CacheModuleAsyncOptions,
  CacheModuleOptions,
  CacheStore,
  Module,
} from '@nestjs/common';
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
import { CalendarModule } from './calendar/calendar.module';
import { DiscordModule } from './discord/discord.module';
import { ScancodeModule } from './scancode/scancode.module';
// import { RedisStore, redisStore } from 'cache-manager-redis-store';
import { DiscordModule as DiscordBotModule } from '@discord-nestjs/core';
import { redisStore } from 'cache-manager-redis-yet';
import { RedisClientOptions } from 'redis';
import { AuthenticatorModule } from './authenticator/authenticator.module';
import { GatewayIntentBits, Snowflake } from 'discord.js';
import { BotSlashCommands } from './bot/bot-slash-commands.module';
import { BotModule } from './bot/bot.module';
import { GcalService } from './gcal/gcal.service';
import { TaskService } from './task/task.service';
import { ScheduleModule } from '@nestjs/schedule';
import { TaskModule } from './task/task.module';
import { GcalModule } from './gcal/gcal.module';

@Module({
  imports: [
    AuthModule,
    PrismaModule,
    ConfigModule.forRoot({ isGlobal: true, cache: true }),
    ScheduleModule.forRoot(),
    // CacheModule.registerAsync<RedisClientOptions>({
    //   isGlobal: true,
    //   imports: [ConfigModule],

    //   useFactory: async (configService: ConfigService) => {
    //     const store = await redisStore({
    //       socket: {
    //         host: configService.getOrThrow<string>('REDIS_HOST'),
    //         port: 6379,
    //       },
    //       database: 1,
    //     });

    //     return {
    //       store: {
    //         create: (opts) => store,
    //       },
    //       ttl: 60 * 60 * 24 * 7 * 1000,
    //     };
    //   },

    //   //   //   // return {
    //   //   //   //   store: redisStore({
    //   //   //   //     socket: {
    //   //   //   //       host: configService.getOrThrow<string>('REDIS_HOST'),
    //   //   //   //       port: 6379,
    //   //   //   //     },
    //   //   //   //     database: 1,
    //   //   //   //   }),
    //   //   //   // };
    //   inject: [ConfigService],
    // }),
    CacheModule.register({
      isGlobal: true,
    }),
    PrismaModule,
    UserModule,
    EventModule,
    RsvpModule,
    CalendarModule,
    DiscordModule,
    ScancodeModule,
    AuthenticatorModule,
    BotModule,
    DiscordBotModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        token: configService.getOrThrow<string>('DISCORD_TOKEN'),
        discordClientOptions: {
          intents: [GatewayIntentBits.GuildMembers, GatewayIntentBits.Guilds],
        },
        registerCommandOptions: [
          {
            forGuilds: configService.getOrThrow<Snowflake>('GUILD_ID'),
            removeCommandsBefore: true,
            /** Remove to deploy commands */
            // allowFactory: () => true,
          },
        ],
      }),
    }),
    BotSlashCommands,
    TaskModule,
    GcalModule,
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
