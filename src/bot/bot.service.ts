import { PrismaService } from '@/prisma/prisma.service';
import {
  bold,
  EmbedBuilder,
  hyperlink,
  time,
  userMention,
} from '@discordjs/builders';
import { Injectable, Logger, UseInterceptors } from '@nestjs/common';
import { Event, RSVP, RSVPStatus } from '@prisma/client';
import {
  ActionRowBuilder,
  BaseMessageOptions,
  ButtonBuilder,
  ButtonStyle,
  GuildMember,
  MessagePayload,
  PermissionFlagsBits,
} from 'discord.js';
import {
  Button,
  ButtonContext,
  ComponentParam,
  Context,
  ContextOf,
  On,
  Options,
  SlashCommand,
  SlashCommandContext,
} from 'necord';
import { Client } from 'discord.js';
import { ConfigService } from '@nestjs/config';
import { EventAutocompleteInterceptor } from './interceptors/event.interceptor';
import { AttendanceDto } from './dto/attendance.dto';
import { DateTime } from 'luxon';
import { RsvpDto } from './dto/rsvp.dto';
import { RequestRSVPDto } from './dto/requestRSVP.dto';

@Injectable()
export class BotService {
  constructor(
    private readonly db: PrismaService,
    private readonly client: Client,
    private readonly config: ConfigService,
  ) {}

  private readonly logger = new Logger(BotService.name);

  async getGuild() {
    const guildId = this.config.getOrThrow<string>('GUILD_ID');
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

  async getGuildMember(userId: string) {
    const guild = await this.getGuild();
    const guildMember =
      guild.members.cache.get(userId) ?? guild.members.fetch(userId);

    return guildMember;
  }

  @On('warn')
  public onWarn(@Context() [message]: ContextOf<'warn'>) {
    this.logger.warn(message);
  }

  @On('error')
  public onError(@Context() [message]: ContextOf<'error'>) {
    this.logger.error(message);
  }

  @SlashCommand({
    name: 'meetings',
    description: 'Get the next few meetings',
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
        url: `${this.config.get('FRONTEND_URL')}/event/${event.id}`,
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
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    });

    if (!fetchedMeeting)
      return interaction.reply({ content: 'Unknown event', ephemeral: true });

    if (!fetchedMeeting.RSVP.length)
      return interaction.reply({ content: 'No RSVPs', ephemeral: true });

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

    const description = fetchedMeeting.RSVP.map(attendanceToDescription).join(
      `\n`,
    );

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

  @UseInterceptors(EventAutocompleteInterceptor)
  @SlashCommand({
    name: 'rsvp',
    description: 'RSVP to an event',
    guilds: [process.env['GUILD_ID']],
  })
  public async onRSVP(
    @Context() [interaction]: SlashCommandContext,
    @Options() { meeting, status }: RsvpDto,
  ) {
    const fetchedEvent = this.db.event.findUnique({
      where: {
        id: meeting,
      },
    });

    if (!fetchedEvent)
      return interaction.reply({
        ephemeral: true,
        content: "This meeting doesn't exist.",
      });

    const user = interaction.member;

    if (!(user instanceof GuildMember)) {
      return interaction.reply('Not a guild member');
    }

    const userId = user.id;

    const rsvp = await this.db.rSVP.upsert({
      where: {
        eventId_userId: {
          eventId: meeting,
          userId,
        },
      },
      create: {
        event: {
          connect: { id: meeting },
        },
        user: {
          connectOrCreate: connectOrCreateGuildMember(user),
        },
        status,
      },
      update: {
        event: {
          connect: { id: meeting },
        },
        user: {
          connectOrCreate: connectOrCreateGuildMember(user),
        },
        status,
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    const embed = new EmbedBuilder()
      .setDescription(rsvpToDescription(rsvp))
      .setTitle('Successfully Updated')
      .setColor([0, 255, 0]);
    // interaction.channel.send()
    return interaction.reply({
      ephemeral: true,
      embeds: [embed],
    });
  }

  @UseInterceptors(EventAutocompleteInterceptor)
  @SlashCommand({
    name: 'requestrsvp',
    description: 'Send a message for people to RSVP to a specific event.',
    defaultMemberPermissions: PermissionFlagsBits.ManageRoles,
    guilds: [process.env['GUILD_ID']],
  })
  public async onRequestRSVP(
    @Context() [interaction]: SlashCommandContext,
    @Options() { meeting }: RequestRSVPDto,
  ) {
    const event = await this.db.event.findUnique({
      where: {
        id: meeting,
      },
      include: {
        RSVP: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    });

    if (!event)
      return interaction.reply({
        ephemeral: true,
        content: 'No meeting with that Id',
      });

    return interaction.reply(
      rsvpReminderMessage(event, event.RSVP, this.config.get('FRONTEND_URL')),
    );
  }

  @Button('event/:eventId/rsvps')
  public async onRsvpsButton(
    @Context() [interaction]: ButtonContext,
    @ComponentParam('eventId') eventId: string,
  ) {
    const fetchedMeeting = await this.db.event.findUnique({
      where: {
        id: eventId,
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
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    });

    if (!fetchedMeeting)
      return interaction.reply({ content: 'Unknown event', ephemeral: true });

    if (!fetchedMeeting.RSVP.length)
      return interaction.reply({ content: 'No RSVPs', ephemeral: true });

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
      ephemeral: true,
      embeds: [rsvpEmbed],
    });
  }

  @Button('event/:eventId/rsvp/:rsvpStatus')
  public async onRsvpButton(
    @Context() [interaction]: ButtonContext,
    @ComponentParam('eventId') eventId: string,
    @ComponentParam('rsvpStatus') rsvpStatus: RSVPStatus,
  ) {
    const fetchedEvent = this.db.event.findUnique({
      where: {
        id: eventId,
      },
    });

    if (!fetchedEvent)
      return interaction.reply({
        ephemeral: true,
        content: "This meeting doesn't exist.",
      });

    const userId = interaction.user.id;

    const user = interaction.member;

    if (!(user instanceof GuildMember)) {
      return interaction.reply('Not a guild member');
    }

    const rsvp = await this.db.rSVP.upsert({
      where: {
        eventId_userId: {
          eventId,
          userId,
        },
      },
      create: {
        event: {
          connect: { id: eventId },
        },
        user: {
          connectOrCreate: connectOrCreateGuildMember(user),
        },
        status: rsvpStatus,
      },
      update: {
        event: {
          connect: { id: eventId },
        },
        user: {
          connectOrCreate: connectOrCreateGuildMember(user),
        },
        status: rsvpStatus,
      },
      include: {
        event: {
          include: {
            RSVP: {
              include: {
                user: {
                  select: {
                    firstName: true,
                    lastName: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    const event = rsvp.event;
    const rsvps = event.RSVP;
    const frontendUrl = this.config.getOrThrow('FRONTEND_URL');

    return interaction.update({
      ...rsvpReminderMessage(rsvp.event, rsvps, frontendUrl),
    });
  }
}

const connectOrCreateGuildMember = (guildMember: GuildMember) => {
  return {
    where: { id: guildMember.id },
    create: {
      id: guildMember.id,
      ...getName(guildMember.nickname ?? guildMember.user.username),
      roles: [...guildMember.roles.cache.mapValues((role) => role.id).values()],
    },
  };
};

const rsvpToDescription = (rsvp: {
  status: RSVPStatus;
  userId: string;
  user: { firstName?: string; lastName?: string };
}) =>
  `${rsvp.user.firstName ?? ''} ${rsvp.user.lastName ?? ''} - ${userMention(
    rsvp.userId,
  )} - ${bold(readableStatus(rsvp.status))}`;

const attendanceToDescription = (rsvp: { attended: boolean; userId: string }) =>
  `${userMention(rsvp.userId)} - ${bold(
    rsvp.attended ? 'Attended' : 'Not Attended',
  )}`;

const getName = (
  nick: string,
): { firstName: string; lastName: string | undefined } => {
  const fullSplitName = nick.split(/(?=[A-Z])/);

  return {
    firstName: nick ? fullSplitName[0] : undefined,
    lastName: nick
      ? fullSplitName.length > 1
        ? fullSplitName[1]
        : undefined
      : undefined,
  };
};

function readableStatus(status: RSVPStatus) {
  if (status === 'YES') {
    return 'Coming';
  } else if (status === 'MAYBE') {
    return 'Maybe';
  } else {
    return 'Not Coming';
  }
}

export const rsvpReminderMessage = (
  event: Event,
  rsvp: (RSVP & {
    user: {
      firstName?: string;
      lastName?: string;
    };
  })[],
  frontendUrl: string,
): BaseMessageOptions => {
  const description = rsvp.map(rsvpToDescription).join('\n');

  const meetingEmbed = new EmbedBuilder({
    description: event.description ?? undefined,
  })
    .setTitle(event.title)
    .addFields(
      { name: 'Type', value: event.type },
      { name: 'All Day', value: event.allDay ? 'Yes' : 'No' },
      { name: 'Start Time', value: time(event.startDate) },
      { name: 'End Time', value: time(event.endDate) },
    )
    .setDescription(description)
    .setURL(`${frontendUrl}/event/${event.id}`);

  const messageComponent = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId(`event/${event.id}/rsvp/${RSVPStatus.YES}`)
      .setStyle(ButtonStyle.Success)
      .setLabel('Coming'),
    new ButtonBuilder()
      .setCustomId(`event/${event.id}/rsvp/${RSVPStatus.MAYBE}`)
      .setStyle(ButtonStyle.Secondary)
      .setLabel('Maybe'),
    new ButtonBuilder()
      .setCustomId(`event/${event.id}/rsvp/${RSVPStatus.NO}`)
      .setStyle(ButtonStyle.Danger)
      .setLabel('Not Coming'),
    // new ButtonBuilder()
    //   .setCustomId(`event/${event.id}/rsvps`)
    //   .setStyle(ButtonStyle.Primary)
    //   .setLabel('RSVPs'),
  );

  return {
    embeds: [meetingEmbed],
    components: [messageComponent],
  };
};
