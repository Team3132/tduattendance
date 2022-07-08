import {
  CacheInterceptor,
  Controller,
  Get,
  Header,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { CalendarService } from './calendar.service';

@ApiTags('Calendar')
@Controller('calendar')
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}
  @Get()
  async calendar(@Res() res: Response) {
    const calendar = await this.calendarService.generateCalendar();
    calendar.serve(res);
  }
}
