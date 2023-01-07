import { AuthenticatorService } from '@/authenticator/authenticator.service';
import { EventService } from '@/event/event.service';
import { GcalService } from '@/gcal/gcal.service';
import { PrismaService } from '@/prisma/prisma.service';
import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { DateTime } from 'luxon';

@Injectable()
export class TaskService {
  constructor(
    private readonly gcal: GcalService,
    private readonly db: PrismaService,
    private readonly authenticatorService: AuthenticatorService,
  ) {}

  private readonly logger = new Logger(TaskService.name);

  // @Cron('45 * * * * *')
  @Cron('45 10 * * *')
  async handleCron() {
    this.logger.debug('Updating events');
    const events = await this.gcal.events();
    const databaseEvents = await Promise.all(
      events.items.map((event) => {
        const secret = this.authenticatorService.generateSecret();
        return this.db.event.upsert({
          where: {
            id: event.id,
          },
          update: {
            title: event.summary,
            allDay: !event.start.dateTime && !event.end.dateTime,
            startDate:
              event.start.dateTime ??
              DateTime.fromISO(event.start.date).startOf('day').toJSDate(),
            endDate:
              event.end.dateTime ??
              DateTime.fromISO(event.end.date).endOf('day').toJSDate(),
            description: event.description,
          },
          create: {
            id: event.id,
            title: event.summary,
            allDay: !event.start.dateTime && !event.end.dateTime,
            startDate:
              event.start.dateTime ??
              DateTime.fromISO(event.start.date).startOf('day').toJSDate(),
            endDate:
              event.end.dateTime ??
              DateTime.fromISO(event.end.date).endOf('day').toJSDate(),
            description: event.description,
            secret,
          },
        });
      }),
    );
    this.logger.log(`${databaseEvents.length} events updated/created`);
  }
}
