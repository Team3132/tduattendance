import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsNegative,
  IsNumber,
  IsNumberString,
  IsOptional,
} from 'class-validator';

export class GetEventsDto {
  @ApiProperty()
  @IsOptional()
  @IsDateString()
  from?: string;
  @ApiProperty()
  @IsOptional()
  @IsDateString()
  to?: string;
  @ApiProperty()
  @IsOptional()
  @IsNumber()
  take?: number;
}
