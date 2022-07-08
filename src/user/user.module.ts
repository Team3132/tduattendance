import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AttendanceModule } from '../attendance/attendance.module';
import { RsvpController } from '../rsvp/rsvp.controller';
import { RsvpModule } from '../rsvp/rsvp.module';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/auth.service';
import { DiscordModule } from 'src/discord/discord.module';
import { DiscordService } from 'src/discord/discord.service';

@Module({
  imports: [AttendanceModule, RsvpModule, AuthModule],
  controllers: [UserController],
  providers: [UserService, AuthService],
})
export class UserModule {}
