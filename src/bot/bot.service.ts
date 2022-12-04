import { InjectDiscordClient } from '@discord-nestjs/core';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from 'discord.js';

@Injectable()
export class BotService {
  constructor(
    @InjectDiscordClient()
    private readonly client: Client,
    private readonly configService: ConfigService,
  ) {}

  async getGuild() {
    const guildId = this.configService.getOrThrow<string>('GUILD_ID');
    return (
      this.client.guilds.cache.get(guildId) ?? this.client.guilds.fetch(guildId)
    );
  }

  async getRoles() {
    const guild = await this.getGuild();
    if (!guild.available) throw new Error("Guild isn't available");
    return guild.roles.cache.size ? guild.roles.cache : guild.roles.fetch();
  }
}
