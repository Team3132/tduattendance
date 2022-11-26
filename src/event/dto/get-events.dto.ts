import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsNegative,
  IsNumber,
  IsNumberString,
  IsOptional,
} from 'class-validator';

export class GetEventsDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  from?: string;
  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  to?: string;
  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  take?: number;
}
