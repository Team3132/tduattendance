import { Module } from '@nestjs/common';
import { BotController } from './bot.controller';
import { EventModule } from '@/event/event.module';
import { EventService } from '@/event/event.service';
import { AuthenticatorModule } from '@/authenticator/authenticator.module';
import { AuthenticatorService } from '@/authenticator/authenticator.service';
import { RsvpModule } from '@/rsvp/rsvp.module';
import { RsvpService } from '@/rsvp/rsvp.service';
import { CommandsService, NecordModule } from 'necord';
import { ConfigService } from '@nestjs/config';
import { GatewayIntentBits } from 'discord.js';
import { BotService } from './bot.service';

@Module({
  controllers: [BotController],
  imports: [EventModule, AuthenticatorModule, RsvpModule],
  providers: [
    BotService,
    // CommandsService,
    // EventService,
    // RsvpService,
    // AuthenticatorService,
    // RsvpCommand,
    // PlayCommand,
  ],
  exports: [BotService],
})
export class BotModule {}
