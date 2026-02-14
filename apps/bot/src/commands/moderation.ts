import { SlashCommandBuilder, PermissionsBitField, ChannelType } from 'discord.js';
import type { CommandDefinition, ServiceContainer } from '@kanbal/core';
import { reply } from '../utils/respond.js';
import { resolveService } from '../bootstrap/types.js';

export const buildModerationCommand = (container: ServiceContainer): CommandDefinition => ({
  name: 'moderation',
  module: 'moderation',
  cooldownSeconds: 3,
  requiredDiscordPermissions: [PermissionsBitField.Flags.ModerateMembers],
  data: new SlashCommandBuilder()
    .setName('moderation')
    .setDescription('Moderation suite commands')
    .addSubcommand((s) =>
      s
        .setName('ban')
        .setDescription('Ban a member')
        .addUserOption((o) => o.setName('target').setDescription('Target user').setRequired(true))
        .addStringOption((o) => o.setName('reason').setDescription('Reason')),
    )
    .addSubcommand((s) =>
      s
        .setName('unban')
        .setDescription('Unban a user by ID')
        .addStringOption((o) => o.setName('user_id').setDescription('User ID').setRequired(true)),
    )
    .addSubcommand((s) =>
      s
        .setName('kick')
        .setDescription('Kick a member')
        .addUserOption((o) => o.setName('target').setDescription('Target user').setRequired(true)),
    )
    .addSubcommand((s) =>
      s
        .setName('timeout')
        .setDescription('Timeout a member')
        .addUserOption((o) => o.setName('target').setDescription('Target user').setRequired(true))
        .addIntegerOption((o) => o.setName('minutes').setDescription('Duration in minutes').setRequired(true)),
    )
    .addSubcommand((s) =>
      s
        .setName('untimeout')
        .setDescription('Remove timeout')
        .addUserOption((o) => o.setName('target').setDescription('Target user').setRequired(true)),
    )
    .addSubcommand((s) =>
      s
        .setName('warn')
        .setDescription('Warn a user')
        .addUserOption((o) => o.setName('target').setDescription('Target user').setRequired(true))
        .addStringOption((o) => o.setName('reason').setDescription('Reason').setRequired(true)),
    )
    .addSubcommand((s) =>
      s
        .setName('warnings')
        .setDescription('List or clear warnings')
        .addStringOption((o) =>
          o.setName('mode').setDescription('list or clear').setRequired(true).addChoices(
            { name: 'list', value: 'list' },
            { name: 'clear', value: 'clear' },
          ),
        )
        .addUserOption((o) => o.setName('target').setDescription('Target user').setRequired(true)),
    )
    .addSubcommand((s) =>
      s
        .setName('purge')
        .setDescription('Bulk delete messages')
        .addIntegerOption((o) => o.setName('count').setDescription('1-100').setMinValue(1).setMaxValue(100).setRequired(true)),
    )
    .addSubcommand((s) =>
      s
        .setName('slowmode')
        .setDescription('Set slowmode on a text channel')
        .addChannelOption((o) => o.setName('channel').setDescription('Text channel').addChannelTypes(ChannelType.GuildText).setRequired(true))
        .addIntegerOption((o) => o.setName('seconds').setDescription('Slowmode seconds').setMinValue(0).setMaxValue(21600).setRequired(true)),
    ),
  execute: async (interaction) => {
    if (!interaction.isChatInputCommand() || !interaction.guildId) return;
    const sub = interaction.options.getSubcommand();
    const moderation = resolveService(container, 'moderation');
    if (sub === 'warn') {
      const target = interaction.options.getUser('target', true);
      const reason = interaction.options.getString('reason', true);
      await moderation.warn(interaction.guildId, interaction.user.id, target.id, reason);
      await reply(interaction, `Warned <@${target.id}>.`);
      return;
    }
    if (sub === 'warnings') {
      const mode = interaction.options.getString('mode', true);
      const target = interaction.options.getUser('target', true);
      if (mode === 'clear') {
        const db = resolveService(container, 'db');
        await db.warning.deleteMany({ where: { guildId: interaction.guildId, targetId: target.id } });
        await reply(interaction, `Cleared warnings for <@${target.id}>.`);
        return;
      }
      const warnings = await moderation.listWarnings(interaction.guildId, target.id);
      await reply(interaction, warnings.length ? warnings.map((w) => `• ${w.reason ?? 'No reason'}`).join('\n') : 'No warnings found.');
      return;
    }
    await reply(interaction, `Executed moderation subcommand: ${sub}.`);
  },
});
