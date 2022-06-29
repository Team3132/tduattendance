import { ApiProperty } from '@nestjs/swagger';
import { Event } from '@prisma/client';
import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

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
}
