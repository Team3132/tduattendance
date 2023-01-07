import { Choice, Param, ParamType } from '@discord-nestjs/core';

enum Boolchoice {
  Yes,
  No,
}

export class EventNameDto {
  @Param({
    description: 'Event Name',
    required: true,
    autocomplete: true,
    type: ParamType.STRING,
    name: 'event',
  })
  event: string;

  @Choice(Boolchoice)
  @Param({ description: 'Show RSVPs', type: ParamType.INTEGER })
  choice: Boolchoice;
}
