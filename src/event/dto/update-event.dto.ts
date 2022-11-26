import { PartialType, PickType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDateString, IsOptional, IsBoolean } from 'class-validator';
import { CreateEventDto } from './create-event.dto';

/**
 * The data used to update an event
 */
export class UpdateEventDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  title?: string;
  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  startDate?: Date;
  @IsDateString()
  @ApiProperty({ required: false })
  @IsOptional()
  endDate?: Date;
  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  allDay?: boolean;
}
