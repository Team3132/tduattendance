import { EventModule } from '@/event/event.module';
import { EventService } from '@/event/event.service';
import { PrismaService } from '@/prisma/prisma.service';
import { bold, EmbedBuilder, userMention } from '@discordjs/builders';
import { Injectable, UseInterceptors } from '@nestjs/common';
import { Event, RSVPStatus } from '@prisma/client';
import { Embed } from 'discord.js';
import { Context, Options, SlashCommand, SlashCommandContext } from 'necord';
import { Client } from 'discord.js';
import { ConfigService } from '@nestjs/config';
import { LengthDto } from './dto/length.dto';
import { EventAutocompleteInterceptor } from './interceptors/event.interceptor';
import { AttendanceDto } from './dto/attendance.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { DateTime } from 'luxon';

@Injectable()
export class BotService {
  constructor(
    private readonly db: PrismaService,
    private readonly client: Client,
    private readonly config: ConfigService,
  ) {}

  async getGuild() {
    const guildId = this.config.getOrThrow<string>('GUILD_ID');
    console.log(guildId);
    const cachedGuild = this.client.guilds.cache.get(guildId);

    if (!cachedGuild || !cachedGuild.available) {
      return this.client.guilds.fetch(guildId);
    } else {
      return cachedGuild;
    }
  }

  async getRoles() {
    const guild = await this.getGuild();
    return guild.roles.cache.size ? guild.roles.cache : guild.roles.fetch();
  }

  @SlashCommand({
    name: 'meetings',
    description: 'Get the next few meetings (guild)',
    guilds: [process.env['GUILD_ID']],
  })
  public async onMeetings(@Context() [interaction]: SlashCommandContext) {
    const nextFive = await this.db.event.findMany({
      where: {
        startDate: {
          gte: new Date(),
        },
        endDate: {
          gte: new Date(),
        },
      },
      orderBy: {
        startDate: 'asc',
      },
      take: 5,
    });

    const eventEmbed = (event: Event) =>
      new EmbedBuilder({
        description: event.description,
        title: event.title,
        timestamp: event.startDate.toISOString(),
      });

    const embededEvents = nextFive.map(eventEmbed);

    const noEventEmbed = new EmbedBuilder()
      .setTitle('No upcoming events')
      .setDescription('No upcoming events were found to display.');

    return interaction.reply({
      content: embededEvents
        ? 'Here are the upcoming events'
        : 'No upcoming events',
      embeds: embededEvents ?? [noEventEmbed],
    });
  }

  @UseInterceptors(EventAutocompleteInterceptor)
  @SlashCommand({
    name: 'rsvps',
    description: 'Get the rsvps for a meeting.',
    guilds: [process.env['GUILD_ID']],
  })
  public async onRSVPs(
    @Context() [interaction]: SlashCommandContext,
    @Options() { meeting }: AttendanceDto,
  ) {
    const fetchedMeeting = await this.db.event.findUnique({
      where: {
        id: meeting,
      },
      include: {
        RSVP: {
          where: {
            status: {
              not: null,
            },
          },
          select: {
            userId: true,
            status: true,
          },
        },
      },
    });

    if (!fetchedMeeting)
      return interaction.reply({ content: 'Unknown event', ephemeral: true });

    if (!fetchedMeeting.RSVP.length)
      return interaction.reply({ content: 'No RSVPs', ephemeral: true });

    const rsvpToDescription = (rsvp: { status: RSVPStatus; userId: string }) =>
      `${userMention(rsvp.userId)} - ${bold(rsvp.status)}`;

    const description = fetchedMeeting.RSVP.map(rsvpToDescription).join(`\n`);

    const rsvpEmbed = new EmbedBuilder()
      .setTitle(
        `RSVPs for ${fetchedMeeting.title} at ${DateTime.fromJSDate(
          fetchedMeeting.startDate,
        ).toLocaleString(DateTime.DATETIME_MED_WITH_WEEKDAY)}`,
      )
      .setDescription(description)
      .setTimestamp(new Date())
      .setURL(`${this.config.get('FRONTEND_URL')}/event/${fetchedMeeting.id}`);

    return interaction.reply({
      embeds: [rsvpEmbed],
    });
  }

  @UseInterceptors(EventAutocompleteInterceptor)
  @SlashCommand({
    name: 'attendance',
    description: 'Get the attendance for a meeting.',
    guilds: [process.env['GUILD_ID']],
  })
  public async onAttendance(
    @Context() [interaction]: SlashCommandContext,
    @Options() { meeting }: AttendanceDto,
  ) {
    const fetchedMeeting = await this.db.event.findUnique({
      where: {
        id: meeting,
      },
      include: {
        RSVP: {
          select: {
            userId: true,
            attended: true,
          },
        },
      },
    });

    if (!fetchedMeeting)
      return interaction.reply({ content: 'Unknown event', ephemeral: true });

    if (!fetchedMeeting.RSVP.length)
      return interaction.reply({ content: 'No responses', ephemeral: true });

    const rsvpToDescription = (rsvp: { attended: boolean; userId: string }) =>
      `${userMention(rsvp.userId)} - ${bold(
        rsvp.attended ? 'Attended' : 'Not Attended',
      )}`;

    const description = fetchedMeeting.RSVP.map(rsvpToDescription).join(`\n`);

    const attendanceEmbed = new EmbedBuilder()
      .setTitle(
        `Attendance for ${fetchedMeeting.title} at ${DateTime.fromJSDate(
          fetchedMeeting.startDate,
        ).toLocaleString(DateTime.DATETIME_MED_WITH_WEEKDAY)}`,
      )
      .setDescription(description)
      .setTimestamp(new Date())
      .setURL(`${this.config.get('FRONTEND_URL')}/event/${fetchedMeeting.id}`);

    return interaction.reply({
      embeds: [attendanceEmbed],
    });
  }
}
