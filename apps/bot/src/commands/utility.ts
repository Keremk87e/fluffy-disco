import { ChannelType, SlashCommandBuilder } from 'discord.js';
import type { CommandDefinition, ServiceContainer } from '@kanbal/core';
import { reply } from '../utils/respond.js';

export const buildUtilityCommand = (container: ServiceContainer): CommandDefinition => ({
  name: 'utility',
  module: 'utility',
  cooldownSeconds: 3,
  data: new SlashCommandBuilder()
    .setName('utility')
    .setDescription('Server management utilities')
    .addSubcommand((s) =>
      s
        .setName('welcome')
        .setDescription('Configure welcome channel')
        .addChannelOption((o) => o.setName('channel').addChannelTypes(ChannelType.GuildText).setDescription('Channel').setRequired(true)),
    )
    .addSubcommand((s) =>
      s
        .setName('suggest')
        .setDescription('Create a suggestion')
        .addStringOption((o) => o.setName('content').setDescription('Suggestion text').setRequired(true)),
    )
    .addSubcommand((s) => s.setName('ticket-open').setDescription('Open a ticket'))
    .addSubcommand((s) => s.setName('ticket-close').setDescription('Close current ticket'))
    .addSubcommand((s) =>
      s
        .setName('custom-command')
        .setDescription('Manage text custom commands')
        .addStringOption((o) => o.setName('mode').setDescription('create|edit|delete|list').setRequired(true))
        .addStringOption((o) => o.setName('trigger').setDescription('Command trigger'))
        .addStringOption((o) => o.setName('response').setDescription('Response content')),
    ),
  execute: async (interaction) => {
    if (!interaction.isChatInputCommand() || !interaction.guildId) return;
    const db = container.resolve('db') as {
      guildSettings: { upsert: (arg: object) => Promise<unknown> };
      suggestion: { create: (arg: object) => Promise<unknown> };
      ticket: { create: (arg: object) => Promise<unknown>; updateMany: (arg: object) => Promise<{ count: number }> };
      customCommand: {
        upsert: (arg: object) => Promise<unknown>;
        deleteMany: (arg: object) => Promise<{ count: number }>;
        findMany: (arg: object) => Promise<Array<{ trigger: string }>>;
      };
    };
    const sub = interaction.options.getSubcommand();
    if (sub === 'welcome') {
      const channel = interaction.options.getChannel('channel', true);
      await db.guildSettings.upsert({ where: { guildId: interaction.guildId }, create: { guildId: interaction.guildId, welcomeChannelId: channel.id }, update: { welcomeChannelId: channel.id } });
      await reply(interaction, `Welcome channel set to <#${channel.id}>.`);
      return;
    }
    if (sub === 'suggest') {
      const content = interaction.options.getString('content', true);
      await db.suggestion.create({ data: { guildId: interaction.guildId, authorId: interaction.user.id, channelId: interaction.channelId, content } });
      await reply(interaction, 'Suggestion recorded.');
      return;
    }
    if (sub === 'ticket-open') {
      await db.ticket.create({ data: { guildId: interaction.guildId, channelId: interaction.channelId, creatorId: interaction.user.id, status: 'open' } });
      await reply(interaction, 'Ticket opened in this channel.');
      return;
    }
    if (sub === 'ticket-close') {
      await db.ticket.updateMany({ where: { guildId: interaction.guildId, channelId: interaction.channelId, status: 'open' }, data: { status: 'closed', transcript: 'Transcript summary unavailable in command mode.' } });
      await reply(interaction, 'Ticket closed.');
      return;
    }
    const mode = interaction.options.getString('mode', true);
    const trigger = interaction.options.getString('trigger');
    const response = interaction.options.getString('response');
    if (mode === 'list') {
      const list = await db.customCommand.findMany({ where: { guildId: interaction.guildId } });
      await reply(interaction, list.length ? list.map((c) => c.trigger).join(', ') : 'No custom commands.');
      return;
    }
    if (!trigger) {
      await reply(interaction, 'trigger is required for create/edit/delete.');
      return;
    }
    if (mode === 'delete') {
      await db.customCommand.deleteMany({ where: { guildId: interaction.guildId, trigger } });
      await reply(interaction, `Deleted custom command ${trigger}.`);
      return;
    }
    await db.customCommand.upsert({
      where: { guildId_trigger: { guildId: interaction.guildId, trigger } },
      create: { guildId: interaction.guildId, trigger, response: response ?? '', isEmbed: false },
      update: { response: response ?? '' },
    });
    await reply(interaction, `Saved custom command ${trigger}.`);
  },
});
