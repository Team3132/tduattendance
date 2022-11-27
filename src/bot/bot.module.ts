import { DiscordModule } from '@discord-nestjs/core';
import { Module } from '@nestjs/common';
import { EventService } from 'src/event/event.service';
import { RsvpModule } from 'src/rsvp/rsvp.module';
import { RsvpService } from 'src/rsvp/rsvp.service';
import { ScancodeModule } from 'src/scancode/scancode.module';
import { ScancodeService } from 'src/scancode/scancode.service';
import { BotGateway } from './bot.gateway';

@Module({
  imports: [DiscordModule.forFeature()],
  providers: [BotGateway],
})
export class BotModule {}
