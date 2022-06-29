import { PartialType, PickType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDateString, IsOptional } from 'class-validator';
import { CreateEventDto } from './create-event.dto';

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
}
