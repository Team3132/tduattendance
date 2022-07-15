import { TransformPipe } from '@discord-nestjs/common';
import { Command, DiscordCommand } from '@discord-nestjs/core';
import { ApplicationCommandTypes } from 'discord.js/typings/enums';
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
  InteractionReplyOptions,
  MessageEmbed,
} from 'discord.js';
import { AttendanceService } from 'src/attendance/attendance.service';
import { EventService } from 'src/event/event.service';
import { RsvpService } from 'src/rsvp/rsvp.service';
import { ScancodeService } from 'src/scancode/scancode.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { Event } from '@prisma/client';
import { DateTime } from 'luxon';

@Command({
  name: 'events',
  description: 'Get the next 5 upcoming events',
})
export class EventsCommand implements DiscordCommand {
  constructor(
    private readonly eventService: EventService,
    private readonly rsvpService: RsvpService,
    private readonly attendanceService: AttendanceService,
    private readonly scancodeService: ScancodeService,
    private readonly prismaService: PrismaService,
  ) {}
  async handler(interaction: CommandInteraction) {
    const logger = new Logger(EventsCommand.name);

    logger.log(`Bot pinged by ${interaction.user.username}`);

    const events = await this.eventService.events({
      take: 5,
      where: {
        startDate: {
          gte: new Date(),
        },
      },
    });

    const eventEmbed = (event: Event) =>
      new MessageEmbed()
        .setTitle(event.title)
        .setDescription(event.description)
        .setURL(`http://localhost:4000/event/${event.id}/view`)
        .addFields([
          { name: 'All Day', value: event.allDay ? 'Yes' : 'No' },
          {
            name: 'Start Time',
            value: `<t:${DateTime.fromJSDate(event.startDate).toSeconds()}:f>`,
          },
          {
            name: 'End Time',
            value: `<t:${DateTime.fromJSDate(event.endDate).toSeconds()}:f>`,
          },
        ]);

    interaction.reply({
      embeds: events.map(eventEmbed),
      ephemeral: true,
    });
  }
}
