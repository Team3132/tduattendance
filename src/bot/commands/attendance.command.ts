import { TransformPipe } from '@discord-nestjs/common';
import { Command } from '@discord-nestjs/core';
import {
  DiscordTransformedCommand,
  Payload,
  TransformedCommandExecutionContext,
  UsePipes,
} from '@discord-nestjs/core';
import { Injectable, Logger } from '@nestjs/common';
import { PermissionFlagsBits } from 'discord.js';
import { EventNameDto } from './dto/event-name.dto';

@Command({
  name: 'attendance',
  description: 'Get Attendance for upcoming events',
  defaultMemberPermissions: [PermissionFlagsBits.SendMessages],
})
@Injectable()
@UsePipes(TransformPipe)
export class AttendanceCommand
  implements DiscordTransformedCommand<EventNameDto>
{
  handler(
    @Payload() dto: EventNameDto,
    { interaction }: TransformedCommandExecutionContext,
  ) {
    const logger = new Logger(AttendanceCommand.name);

    logger.log(
      `Bot pinged by ${interaction.user.username}`,
      JSON.stringify(dto),
    );
    // return 'wadwad';
    return {
      content: `Pong! Bot Latency ${Math.round(interaction.client.ws.ping)}ms.`,
      ephemeral: true,
    };
  }
}
