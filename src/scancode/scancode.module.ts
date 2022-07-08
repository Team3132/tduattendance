import { Module } from '@nestjs/common';
import { ScancodeService } from './scancode.service';
import { ScancodeController } from './scancode.controller';

@Module({
  controllers: [ScancodeController],
  providers: [ScancodeService]
})
export class ScancodeModule {}
