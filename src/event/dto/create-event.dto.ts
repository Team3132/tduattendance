import { ApiProperty } from '@nestjs/swagger';
import { Event } from '@prisma/client';
import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

/**
 * The data used to create an event
 */
export class CreateEventDto {
  @ApiProperty()
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
  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  allDay?: boolean;
}
