/* bot-slash-commands.module.ts */

import {
  DiscordClientProvider,
  DiscordCommandProvider,
  DiscordModule,
  ReflectMetadataProvider,
} from '@discord-nestjs/core';
import { Module } from '@nestjs/common';
import { InjectDynamicProviders } from 'nestjs-dynamic-providers';
import { EventModule } from 'src/event/event.module';
import { EventService } from 'src/event/event.service';
import { RsvpModule } from 'src/rsvp/rsvp.module';
import { RsvpService } from 'src/rsvp/rsvp.service';
import { ScancodeModule } from 'src/scancode/scancode.module';
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
