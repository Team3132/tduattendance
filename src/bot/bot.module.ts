import { DiscordModule } from '@discord-nestjs/core';
import { Module } from '@nestjs/common';
import { EventService } from '@event/event.service';
import { RsvpModule } from '@rsvp/rsvp.module';
import { RsvpService } from '@rsvp/rsvp.service';
import { ScancodeModule } from '@scancode/scancode.module';
import { ScancodeService } from '@scancode/scancode.service';
import { BotGateway } from './bot.gateway';

@Module({
  imports: [DiscordModule.forFeature()],
  providers: [BotGateway],
})
export class BotModule {}
