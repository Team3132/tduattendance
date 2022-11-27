import { Field, TextInputValue } from '@discord-nestjs/core';
import { TextInputModalData } from 'discord.js';

export class NewEventDto {
  @TextInputValue()
  title: string;

  // @TextInputValue('description')
  // description: string;

  @TextInputValue()
  eventType: string;

  @TextInputValue()
  allday: string;

  @TextInputValue()
  startDate: string;

  // @TextInputValue('endDate')
  // endDate: string;
}
