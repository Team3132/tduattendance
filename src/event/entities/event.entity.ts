import { ApiProperty } from '@nestjs/swagger';
import { Event as PrismaEvent } from '@prisma/client';
import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class Event implements PrismaEvent {
  @ApiProperty()
  id: string;
  @ApiProperty()
  description: string | null;
  @ApiProperty()
  title: string;
  @ApiProperty()
  startDate: Date;
  @ApiProperty()
  endDate: Date;
}
