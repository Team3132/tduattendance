import {
  CacheInterceptor,
  Controller,
  Get,
  Request,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('App')
@Controller()
@UseInterceptors(CacheInterceptor)
export class AppController {
  /**
   * A simple hello world just for you.
   * @returns "Hello World!"
   */
  @Get()
  helloWorld() {
    return `Welcome to the TDU Attendance API. It's only accessible to TDU members. If you're a TDU member, please visit https://attendance.team3132.com/ to get started.`;
  }
}
