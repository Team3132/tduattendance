import {
  CacheInterceptor,
  Controller,
  Get,
  Header,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { CalendarGuard } from 'src/auth/guard/calendar.guard';
import { CalendarService } from './calendar.service';

@ApiTags('Calendar')
@Controller('calendar')
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  /**
   * Download calendar
   * @returns iCal file
   */
  @Get()
  @ApiOperation({
    description: 'Download calendar',
    operationId: 'downloadCalendar',
  })
  @UseGuards(CalendarGuard)
  async calendar(@Res() res: Response) {
    const calendar = await this.calendarService.generateCalendar();
    calendar.serve(res);
  }
}
