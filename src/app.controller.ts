import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('App')
@Controller()
export class AppController {
  constructor() {}

  /**
   * A simple hello world just for you.
   * @returns "Hello World!"
   */
  @Get('')
  helloWorld() {
    return 'Hello World!';
  }
}
