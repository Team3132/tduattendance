import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { RsvpModule } from '@rsvp/rsvp.module';
import { AuthModule } from '@auth/auth.module';
import { AuthService } from '@auth/auth.service';
import { ScancodeModule } from '@scancode/scancode.module';
import { ScancodeService } from '@scancode/scancode.service';

@Module({
  imports: [RsvpModule, AuthModule, ScancodeModule],
  controllers: [UserController],
  providers: [UserService, AuthService, ScancodeService],
})
export class UserModule {}
