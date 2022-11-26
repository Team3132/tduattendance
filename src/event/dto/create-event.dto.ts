import { ApiProperty } from '@nestjs/swagger';
import { Event, EventTypes } from '@prisma/client';
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

/**
 * The data used to create an event
 */
export class CreateEventDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;
  @ApiProperty()
  @IsString()
  title: string;
  @ApiProperty()
  @IsDateString()
  startDate: Date;
  @IsDateString()
  @ApiProperty()
  endDate: Date;
  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  allDay?: boolean;
  @IsOptional()
  @IsEnum(EventTypes)
  @ApiProperty({ enum: EventTypes })
  type?: EventTypes;
}
