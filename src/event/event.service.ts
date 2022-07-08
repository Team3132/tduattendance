import { Injectable, Logger } from '@nestjs/common';
import { Event, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Injectable()
export class EventService {
  constructor(private readonly prismaService: PrismaService) {}
  private readonly logger = new Logger(EventService.name);

  createEvent(data: Prisma.EventCreateInput) {
    return this.prismaService.event.create({
      data,
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

  deleteEvent(where: Prisma.EventWhereUniqueInput) {
    return this.prismaService.event.delete({ where });
  }
}
