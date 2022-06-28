import { RSVP } from '@prisma/client';

export class CreateRsvpDto {
  eventId: string;
  userId: string;
}
