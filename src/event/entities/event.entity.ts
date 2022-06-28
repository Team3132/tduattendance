import { Event as PrismaEvent } from '@prisma/client';

export class Event implements PrismaEvent {
  id: string;
  description: string | null;
  title: string;
  startDate: Date;
  endDate: Date;
}
