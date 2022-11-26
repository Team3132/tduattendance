import { PartialType, PickType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { User } from '../entities/user.entity';

/**
 * The data used to update a user
 */
export class GetOutreachReport {
  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  from?: string;
  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  to?: string;
}
