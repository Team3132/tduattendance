import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

/**
 * The data used to update a user
 */
export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  firstName?: string;
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  lastName?: string;
}
