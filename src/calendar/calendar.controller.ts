import {
  CacheInterceptor,
  Controller,
  Get,
  Header,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { CalendarGuard } from 'src/auth/guard/calendar.guard';
import { CalendarService } from './calendar.service';

@ApiTags('Calendar')
@Controller('calendar')
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}
  @Get()
  @UseGuards(CalendarGuard)
  async calendar(@Res() res: Response) {
    const calendar = await this.calendarService.generateCalendar();
    calendar.serve(res);
  }
}
