import { PartialType, PickType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { User } from '../entities/user.entity';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @ApiProperty()
  firstName?: string;
  @ApiProperty()
  @IsOptional()
  @IsString()
  lastName?: string;
}
