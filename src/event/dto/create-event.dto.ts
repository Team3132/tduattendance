import { Event } from '@prisma/client';

export class CreateEventDto {
  id: string;
  description: string | null;
  title: string;
  startDate: Date;
  endDate: Date;
}
