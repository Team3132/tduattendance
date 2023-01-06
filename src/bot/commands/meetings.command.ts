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
import {
  CommandInteraction,
  EmbedBuilder,
  PermissionFlagsBits,
} from 'discord.js';
import { EventService } from '@event/event.service';
import { RsvpService } from '@rsvp/rsvp.service';
import { ScancodeService } from '@scancode/scancode.service';
import { Event } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

@Command({
  name: 'meetings',
  description: 'Get the next 5 meetings',
  // defaultMemberPermissions: [PermissionFlagsBits.Administrator],
})
export class MeetingsCommand implements DiscordCommand {
  constructor(
    private readonly eventService: EventService,
    private readonly configService: ConfigService,
  ) {}

  async handler(interaction: CommandInteraction) {
    const logger = new Logger(MeetingsCommand.name);

    logger.log(`Bot pinged by ${interaction.user.username}`);

    const meetings = await this.eventService.events({
      take: 5,
      where: {
        startDate: {
          gte: new Date(),
        },
      },
    });

    const meetingEmbed = (meeting: Event) =>
      new EmbedBuilder()
        .setDescription(meeting.description)
        .setTimestamp(meeting.startDate)
        .setTitle(meeting.title)
        .addFields(
          { value: meeting.allDay ? 'Yes' : 'No', name: 'All Day' },
          { value: meeting.type, name: 'Meeting Type' },
        )
        .setURL(
          `${this.configService.getOrThrow('FRONTEND_URL')}/event/${
            meeting.id
          }`,
        );

    return {
      content: `Here are the next 5 meetings.`,
      embeds: meetings.map(meetingEmbed),
    };
  }
}
