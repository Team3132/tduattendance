import { PartialType, PickType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';
import { User } from '../entities/user.entity';

/**
 * The data used to update a user
 */
export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @ApiProperty()
  firstName?: string;
  @ApiProperty()
  @IsOptional()
  @IsString()
  lastName?: string;
  @ApiProperty()
  @IsOptional()
  @IsEmail()
  email?: string;
}
