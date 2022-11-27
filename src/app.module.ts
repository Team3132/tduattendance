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
import { redisStore } from 'cache-manager-redis-yet';
import { RedisClientOptions } from 'redis';

@Module({
  imports: [
    AuthModule,
    PrismaModule,
    ConfigModule.forRoot({ isGlobal: true, cache: true }),
    CacheModule.registerAsync<RedisClientOptions>({
      isGlobal: true,
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const store = await redisStore({
          socket: {
            host: configService.getOrThrow<string>('REDIS_HOST'),
            port: 6379,
          },
          database: 1,
        });
        return {
          store: {
            create: () => store,
          },
        };
      },

      inject: [ConfigService],
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
    //   inject: [ConfigService],
    //   useFactory: async (configService: ConfigService) => ({
    //     token: configService.getOrThrow<string>('DISCORD_TOKEN'),
    //     discordClientOptions: {
    //       intents: [GatewayIntentBits.GuildMembers],
    //     },
    //     registerCommandOptions: [
    //       {
    //         forGuilds: configService.getOrThrow<Snowflake>('GUILD_ID'),
    //         removeCommandsBefore: true,
    //       },
    //     ],
    //   }),
    // }),
    // BotSlashCommands,
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
