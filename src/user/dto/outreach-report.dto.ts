import { PartialType, PickType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNumber, IsOptional, IsString } from 'class-validator';
import { User } from '../entities/user.entity';

/**
 * The data used to update a user
 */
export class OutreachReport {
  @IsNumber()
  @ApiProperty({ type: 'number' })
  eventCount: number;
  @ApiProperty({ type: 'number' })
  @IsNumber()
  hourCount: number;
}
