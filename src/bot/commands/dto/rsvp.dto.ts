import { Choice, Param } from '@discord-nestjs/core';
import { RSVPStatus } from '@prisma/client';

export class RsvpDto {
  @Param({ autocomplete: true, description: 'The event you want to rsvp to.' })
  event: string;

  @Choice(RSVPStatus)
  @Param({ description: 'Your response.' })
  status: RSVPStatus;
}
