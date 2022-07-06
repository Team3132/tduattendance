import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AttendanceModule } from 'src/attendance/attendance.module';
import { RsvpController } from 'src/rsvp/rsvp.controller';
import { RsvpModule } from 'src/rsvp/rsvp.module';

@Module({
  imports: [AttendanceModule, RsvpModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
