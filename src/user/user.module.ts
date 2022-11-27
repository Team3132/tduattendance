import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { RsvpController } from '../rsvp/rsvp.controller';
import { RsvpModule } from '../rsvp/rsvp.module';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/auth.service';
import { DiscordModule } from 'src/discord/discord.module';
import { DiscordService } from 'src/discord/discord.service';
import { ScancodeModule } from 'src/scancode/scancode.module';
import { ScancodeService } from 'src/scancode/scancode.service';

@Module({
  imports: [RsvpModule, AuthModule, ScancodeModule],
  controllers: [UserController],
  providers: [UserService, AuthService, ScancodeService],
})
export class UserModule {}
