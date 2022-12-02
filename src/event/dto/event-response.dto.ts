import { OmitType } from '@nestjs/mapped-types';
import { Event, EventTypes, Prisma } from '@prisma/client';
import { Exclude } from 'class-transformer';
// import { Event } from '../entities/event.entity';

export class EventResponse implements Event {
  id: string;
  description: string;
  title: string;
  startDate: Date;
  endDate: Date;
  allDay: boolean;
  type: EventTypes;

  @Exclude()
  secret: string;

  constructor(event: Event) {
    Object.assign(this, event);
  }
}

export class EventResponseType extends OmitType(EventResponse, ['secret']) {}
