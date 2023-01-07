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
import { PrismaService } from '@/prisma/prisma.service';

@Command({
  name: 'meetings',
  description: 'Get the next 5 meetings',
  defaultMemberPermissions: [PermissionFlagsBits.SendMessages],
})
export class MeetingsCommand implements DiscordCommand {
  constructor(
    private readonly eventService: EventService,
    private readonly configService: ConfigService,
    private readonly db: PrismaService,
  ) {}

  async handler(interaction: CommandInteraction) {
    const logger = new Logger(MeetingsCommand.name);

    logger.log(`Bot pinged by ${interaction.user.username}`);

    const meetings = await this.db.event.findMany({
      take: 5,
      where: {
        startDate: {
          gte: new Date(),
        },
      },
      include: {
        _count: {
          select: {
            RSVP: true,
          },
        },
      },
    });

    const meetingEmbed = (
      meeting: Event & {
        _count: {
          RSVP: number;
        };
      },
    ) =>
      new EmbedBuilder({ description: meeting.description ?? undefined })
        // .setDescription(meeting.description)
        .setTimestamp(meeting.startDate)
        .setTitle(meeting.title)
        .addFields([
          { value: meeting.allDay ? 'Yes' : 'No', name: 'All Day' },
          { value: meeting.type, name: 'Meeting Type' },
          { value: meeting._count.RSVP.toString(), name: 'RSVPs' },
        ])
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
