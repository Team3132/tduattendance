import {
  ModalFieldsTransformPipe,
  TransformPipe,
} from '@discord-nestjs/common';
import {
  Command,
  DiscordCommand,
  InjectDiscordClient,
  On,
  UseGuards,
} from '@discord-nestjs/core';
import {
  DiscordTransformedCommand,
  Payload,
  TransformedCommandExecutionContext,
  CommandExecutionContext,
  UsePipes,
} from '@discord-nestjs/core';
import { Inject, Logger } from '@nestjs/common';
import {
  ActionRowBuilder,
  Client,
  CommandInteraction,
  Events,
  ModalActionRowComponentBuilder,
  ModalBuilder,
  ModalSubmitInteraction,
  PermissionFlagsBits,
  TextInputBuilder,
  TextInputStyle,
} from 'discord.js';
import { EventService } from '@event/event.service';
import { RsvpService } from '@rsvp/rsvp.service';
import { ScancodeService } from '@scancode/scancode.service';
import { IsModalInteractionGuard } from '../guard/is-modal-interaction-guard';
import { NewEventDto } from './dto/new-event.dto';

@Command({
  name: 'create-event',
  description: 'Create a new event',
  // defaultMemberPermissions: [PermissionFlagsBits.Administrator],
})
export class CreateEventCommand implements DiscordCommand {
  private readonly logger = new Logger(CreateEventCommand.name);
  private readonly createEventModalId = 'CreateEvent';
  private readonly titleComponentId = 'title';
  private readonly eventTypeComponentId = 'eventType';
  private readonly alldayComponentId = 'allday';
  private readonly startDateComponentId = 'startDate';
  private readonly endDateComponentId = 'endDate';
  private readonly descriptionComponentId = 'description';

  constructor(
    private readonly eventService: EventService,
    private readonly rsvpService: RsvpService,
    private readonly scancodeService: ScancodeService,
    @InjectDiscordClient()
    private readonly client: Client,
  ) {}
  async handler(interaction: CommandInteraction) {
    this.logger.log(`Bot pinged by ${interaction.user.username}`);

    const modal = new ModalBuilder()
      .setTitle('Create Event')
      .setCustomId(this.createEventModalId);

    const titleInput = new TextInputBuilder()
      .setCustomId(this.titleComponentId)
      .setLabel('Title')
      .setPlaceholder('Enter the title of the event')
      .setStyle(TextInputStyle.Short);

    const eventTypeInput = new TextInputBuilder()
      .setCustomId(this.eventTypeComponentId)
      .setLabel('Event Type')
      .setPlaceholder('Enter the type of the event')
      .setStyle(TextInputStyle.Short);

    const alldayInput = new TextInputBuilder()
      .setCustomId(this.alldayComponentId)
      .setLabel('All Day')
      .setPlaceholder('Whether or not the event goes for the entire day')
      .setStyle(TextInputStyle.Short);

    const startDateInput = new TextInputBuilder()
      .setCustomId(this.startDateComponentId)
      .setLabel('Start Date')
      .setPlaceholder('Enter the start date of the event')
      .setStyle(TextInputStyle.Short);

    const endDateInput = new TextInputBuilder()
      .setCustomId(this.endDateComponentId)
      .setLabel('End Date')
      .setPlaceholder('Enter the end date of the event')
      .setStyle(TextInputStyle.Short);

    const descriptionInput = new TextInputBuilder()
      .setCustomId(this.descriptionComponentId)
      .setLabel('Description')
      .setPlaceholder('Enter the description of the event')
      .setStyle(TextInputStyle.Paragraph);

    const rows = [
      titleInput,
      eventTypeInput,
      alldayInput,
      startDateInput,
      //   endDateInput,
      //   descriptionInput,
    ].map((component) =>
      new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
        component,
      ),
    );

    modal.addComponents(...rows);

    await interaction.showModal(modal);

    // return {
    //   content: `Pong from JavaScript! Bot Latency ${Math.round(
    //     interaction.client.ws.ping,
    //   )}ms.`,
    //   ephemeral: true,
    // };
  }

  @On(Events.InteractionCreate)
  @UsePipes(ModalFieldsTransformPipe)
  @UseGuards(IsModalInteractionGuard)
  async onModuleSubmit(
    @Payload()
    { title, startDate, allday, eventType }: NewEventDto,
    modal: ModalSubmitInteraction,
  ) {
    this.logger.log(`Modal submitted by ${modal.user.username}`);
    if (modal.customId !== this.createEventModalId) return;
    const titleval = modal.fields.getTextInputValue(this.titleComponentId);
    this.logger.log(JSON.stringify({ titleval }, null, 2));
    await modal.reply(`Event created by ${modal.user.username} with title`);
  }
}
