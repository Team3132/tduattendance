import { PartialType, PickType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDateString, IsOptional, IsBoolean } from 'class-validator';
import { CreateEventDto } from './create-event.dto';

/**
 * The data used to update an event
 */
export class UpdateEventDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  description?: string;
  @ApiProperty()
  @IsString()
  @IsOptional()
  title?: string;
  @ApiProperty()
  @IsDateString()
  @IsOptional()
  startDate?: Date;
  @IsDateString()
  @ApiProperty()
  @IsOptional()
  endDate?: Date;
  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  allDay?: boolean;
}
