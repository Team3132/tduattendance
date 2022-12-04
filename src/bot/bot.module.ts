import { DiscordModule } from '@discord-nestjs/core';
import { Module } from '@nestjs/common';
import { BotGateway } from './bot.gateway';
import { BotController } from './bot.controller';
import { BotService } from './bot.service';

@Module({
  controllers: [BotController],
  imports: [DiscordModule.forFeature()],
  providers: [BotGateway, BotService],
  exports: [BotService],
})
export class BotModule {}
