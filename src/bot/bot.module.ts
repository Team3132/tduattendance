import { AuthenticatorModule } from '@/authenticator/authenticator.module';
import { AuthenticatorService } from '@/authenticator/authenticator.service';
import { EventModule } from '@/event/event.module';
import { EventService } from '@/event/event.service';
import { RsvpModule } from '@/rsvp/rsvp.module';
import { Module } from '@nestjs/common';
import { BotController } from './bot.controller';
import { BotService } from './bot.service';

@Module({
  controllers: [BotController],
  imports: [AuthenticatorModule],
  providers: [BotService, AuthenticatorService],
  exports: [BotService],
})
export class BotModule {}
