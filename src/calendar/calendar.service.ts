import { CACHE_MANAGER, Inject, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import ical, { ICalAttendeeStatus, ICalCalendarJSONData } from 'ical-generator';
import type { Cache } from 'cache-manager';
import { RedisCache } from 'cache-manager-redis-yet';
@Injectable()
export class CalendarService {
  constructor(
    private readonly prismaService: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: RedisCache,
  ) {}
  private readonly logger = new Logger(CalendarService.name);
  async generateCalendar() {
    const cachedCalendar = await this.cacheManager.get<ICalCalendarJSONData>(
      'calendar',
    );
    if (cachedCalendar) {
      return ical({ ...cachedCalendar });
    } else {
      this.logger.log('Generating Calendar');
      const events = await this.prismaService.event.findMany({
        include: {
          RSVP: {
            include: {
              user: true,
            },
          },
        },
      });
      const calendar = ical({
        name: 'TDU Attendance',
        description: 'The TDU Attendance Calendar',
        events: events.map((event) => {
          return {
            start: event.startDate,
            end: event.endDate,
            description: event.title,
            allDay: event.allDay,
            attendees: event.RSVP.map((rsvp) => {
              const status: ICalAttendeeStatus =
                rsvp.status === 'YES'
                  ? ICalAttendeeStatus.ACCEPTED
                  : rsvp.status === 'MAYBE'
                  ? ICalAttendeeStatus.TENTATIVE
                  : rsvp.status === 'NO'
                  ? ICalAttendeeStatus.DECLINED
                  : ICalAttendeeStatus.NEEDSACTION;

              return {
                name: `${rsvp.user.firstName} ${rsvp.user.lastName}`,
                status,
              };
            }),
          };
        }),
      });
      await this.cacheManager.set('calendar', calendar.toJSON(), 7200);
      return calendar;
    }
  }
}
