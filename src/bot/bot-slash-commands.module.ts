/* bot-slash-commands.module.ts */

import { EventModule } from '@/event/event.module';
import { DiscordModule } from '@discord-nestjs/core';
import { Module } from '@nestjs/common';
import { MeetingsCommand } from './commands/meetings.command';
import { PingCommand } from './commands/ping.command';

@Module({
  imports: [DiscordModule.forFeature(), EventModule],
  providers: [PingCommand, MeetingsCommand],
})
export class BotSlashCommands {}
