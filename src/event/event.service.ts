import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Event, Prisma } from '@prisma/client';
import { AuthenticatorService } from 'src/authenticator/authenticator.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EventService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
    private readonly authenticatorService: AuthenticatorService,
  ) {}
  private readonly logger = new Logger(EventService.name);

  createEvent(data: Prisma.EventCreateInput) {
    const secret = this.authenticatorService.generateSecret();
    return this.prismaService.event.create({
      data: {
        ...data,
        secret,
      },
    });
  }

  events(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.EventWhereUniqueInput;
    where?: Prisma.EventWhereInput;
    orderBy?: Prisma.EventOrderByWithRelationInput;
  }) {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prismaService.event.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  event(eventWhereUniqueInput: Prisma.EventWhereUniqueInput): Promise<Event> {
    return this.prismaService.event.findUnique({
      where: eventWhereUniqueInput,
    });
  }

  eventSecret(eventWhereUniqueInput: Prisma.EventWhereUniqueInput) {
    return this.prismaService.event.findUnique({
      where: eventWhereUniqueInput,
      select: {
        secret: true,
      },
    });
  }

  updateEvent(params: {
    where: Prisma.EventWhereUniqueInput;
    data: Prisma.EventUpdateInput;
  }) {
    const { data, where } = params;
    return this.prismaService.event.update({
      data,
      where,
    });
  }

  deleteEvent(id: Event['id']) {
    return this.prismaService.event.delete({ where: { id } });
  }
}
