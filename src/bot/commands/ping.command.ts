import { TransformPipe } from '@discord-nestjs/common';
import { Command, DiscordCommand } from '@discord-nestjs/core';
import {
  DiscordTransformedCommand,
  Payload,
  TransformedCommandExecutionContext,
  CommandExecutionContext,
  UsePipes,
} from '@discord-nestjs/core';
import { Logger } from '@nestjs/common';
import { CommandInteraction, PermissionFlagsBits } from 'discord.js';
import { EventService } from '@event/event.service';
import { RsvpService } from '@rsvp/rsvp.service';
import { ScancodeService } from '@scancode/scancode.service';

@Command({
  name: 'ping',
  description: 'Pings the bot',
  // defaultMemberPermissions: [PermissionFlagsBits.Administrator],
})
export class PingCommand implements DiscordCommand {
  constructor(
    private readonly eventService: EventService,
    private readonly rsvpService: RsvpService,
    private readonly scancodeService: ScancodeService,
  ) {}
  handler(interaction: CommandInteraction) {
    const logger = new Logger(PingCommand.name);

    logger.log(`Bot pinged by ${interaction.user.username}`);

    return {
      content: `Pong from JavaScript! Bot Latency ${Math.round(
        interaction.client.ws.ping,
      )}ms.`,
      ephemeral: true,
    };
  }
}
