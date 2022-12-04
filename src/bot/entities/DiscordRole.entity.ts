import { ApiProperty } from '@nestjs/swagger';
import { Role } from 'discord.js';

export class DiscordRole {
  @ApiProperty()
  name: string;
  @ApiProperty()
  id: string;

  constructor(role: Role) {
    Object.assign(this, role);
  }
}
