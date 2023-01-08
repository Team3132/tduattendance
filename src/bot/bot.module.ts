import { DiscordModule } from '@discord-nestjs/core';
import { Module } from '@nestjs/common';
import { BotGateway } from './bot.gateway';
import { BotController } from './bot.controller';
import { BotService } from './bot.service';
import { MeetingsCommand } from './commands/meetings.command';
import { PingCommand } from './commands/ping.command';
import { RsvpCommand } from './commands/rsvp.command';
import { EventModule } from '@/event/event.module';
import { EventService } from '@/event/event.service';
import { AuthenticatorModule } from '@/authenticator/authenticator.module';
import { AuthenticatorService } from '@/authenticator/authenticator.service';
import { RsvpModule } from '@/rsvp/rsvp.module';
import { RsvpService } from '@/rsvp/rsvp.service';
import { PlayCommand } from './commands/play.command';

@Module({
  controllers: [BotController],
  imports: [
    DiscordModule.forFeature(),
    EventModule,
    AuthenticatorModule,
    RsvpModule,
  ],
  providers: [
    BotService,
    BotGateway,
    EventService,
    RsvpService,
    AuthenticatorService,
    PingCommand,
    MeetingsCommand,
    // RsvpCommand,
    // PlayCommand,
  ],
  exports: [BotService],
})
export class BotModule {}
