/* bot-slash-commands.module.ts */

import {
  DiscordClientProvider,
  DiscordCommandProvider,
  DiscordModule,
  ReflectMetadataProvider,
} from '@discord-nestjs/core';
import { Module } from '@nestjs/common';
import { InjectDynamicProviders } from 'nestjs-dynamic-providers';
import { EventModule } from '@event/event.module';
import { EventService } from '@event/event.service';
import { RsvpModule } from '@rsvp/rsvp.module';
import { RsvpService } from '@rsvp/rsvp.service';
import { ScancodeModule } from '@scancode/scancode.module';
import { PingCommand } from './commands/ping.command';

@Module({
  imports: [
    RsvpModule,
    ScancodeModule,
    EventModule,
    DiscordModule.forFeature(),
  ],
  providers: [PingCommand, RsvpService, EventService],
})
export class BotSlashCommands {}
