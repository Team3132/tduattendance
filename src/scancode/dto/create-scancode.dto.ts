import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateScancodeDto {
  @IsString()
  @ApiProperty()
  userId: string;
  @IsString()
  @ApiProperty()
  code: string;
}
