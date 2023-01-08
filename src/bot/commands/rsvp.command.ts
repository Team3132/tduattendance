import { TransformPipe } from '@discord-nestjs/common';
import {
  DiscordTransformedCommand,
  Payload,
  TransformedCommandExecutionContext,
  UsePipes,
  Command,
} from '@discord-nestjs/core';
import { Injectable, Logger } from '@nestjs/common';
import { RsvpDto } from './dto/rsvp.dto';

@Command({
  name: 'rsvp',
  description: 'RSVP to an upcoming meeting',
})
@Injectable()
@UsePipes(TransformPipe)
export class RsvpCommand implements DiscordTransformedCommand<RsvpDto> {
  handler(
    @Payload() dto: RsvpDto,
    { interaction }: TransformedCommandExecutionContext,
  ) {
    const logger = new Logger(RsvpCommand.name);

    logger.log(
      `Bot pinged by ${interaction.user.username}`,
      JSON.stringify(dto),
    );
    // return 'wadwad';
    return {
      content: `Pong! Bot Latency ${Math.round(interaction.client.ws.ping)}ms.`,
      ephemeral: true,
    };
  }
}
