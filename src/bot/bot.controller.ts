import { SessionGuard } from '@auth/guard/session.guard';
import { InjectDiscordClient } from '@discord-nestjs/core';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Client } from 'discord.js';
import { BotService } from './bot.service';
import { DiscordRole } from './entities/DiscordRole.entity';

@Controller('bot')
@UseGuards(SessionGuard)
@ApiTags('Bot')
export class BotController {
  constructor(
    @InjectDiscordClient() private readonly client: Client,
    private readonly botService: BotService,
  ) {}

  @ApiOperation({
    description: 'Get the status of the bot',
    operationId: 'getStatus',
  })
  @ApiOkResponse({ type: Boolean })
  @Get('status')
  getStatus() {
    return this.client.isReady();
  }

  @ApiOperation({
    description: 'Get the roles in the guild',
    operationId: 'getRoles',
  })
  @ApiOkResponse({ type: [DiscordRole] })
  @Get('roles')
  async getRoles() {
    const roles = await this.botService.getRoles();
    console.log(roles);
    const formattedRoles = roles.map((role) => new DiscordRole(role));
    return formattedRoles;
  }
}
