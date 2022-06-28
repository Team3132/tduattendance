import { PartialType, PickType } from '@nestjs/mapped-types';
import { CreateEventDto } from './create-event.dto';

export class UpdateEventDto extends PartialType(
  PickType(CreateEventDto, ['title', 'description', 'startDate', 'endDate']),
) {}
