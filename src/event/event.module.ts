import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { RsvpService } from '../rsvp/rsvp.service';
import { RsvpModule } from '../rsvp/rsvp.module';
import { AttendanceModule } from '../attendance/attendance.module';
import { AttendanceService } from '../attendance/attendance.service';

@Module({
  controllers: [EventController],
  providers: [EventService, RsvpService, AttendanceService],
  imports: [RsvpModule, AttendanceModule],
})
export class EventModule {}
