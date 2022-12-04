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
import { CreateEventCommand } from './commands/create-event.command';
import { EventsCommand } from './commands/events.command';
import { PingCommand } from './commands/ping.command';

@Module({
  imports: [
    RsvpModule,
    ScancodeModule,
    EventModule,
    DiscordModule.forFeature(),
  ],
  providers: [PingCommand, EventsCommand, RsvpService, EventService],
})
export class BotSlashCommands {}
