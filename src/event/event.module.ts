import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { RsvpService } from 'src/rsvp/rsvp.service';
import { RsvpModule } from 'src/rsvp/rsvp.module';
import { AttendanceModule } from 'src/attendance/attendance.module';
import { AttendanceService } from 'src/attendance/attendance.service';

@Module({
  controllers: [EventController],
  providers: [EventService, RsvpService, AttendanceService],
  imports: [RsvpModule, AttendanceModule],
})
export class EventModule {}
