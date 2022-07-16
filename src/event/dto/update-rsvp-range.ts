import { ApiProperty } from '@nestjs/swagger';
import { RSVPStatus } from '@prisma/client';
import { IsOptional, IsDateString, IsNumber, IsEnum } from 'class-validator';

export class UpdateRangeRSVP {
  @ApiProperty()
  @IsDateString()
  from: string;
  @ApiProperty()
  @IsDateString()
  to: string;
  @IsEnum(RSVPStatus)
  @ApiProperty({ enum: RSVPStatus })
  status: RSVPStatus;
}
