import { SlashCommandBuilder } from 'discord.js';
import type { CommandDefinition, ServiceContainer } from '@kanbal/core';
import { reply } from '../utils/respond.js';

export const buildCommunityCommand = (container: ServiceContainer): CommandDefinition => ({
  name: 'community',
  module: 'community',
  cooldownSeconds: 3,
  data: new SlashCommandBuilder()
    .setName('community')
    .setDescription('Community commands')
    .addSubcommand((s) => s.setName('leaderboard').setDescription('Show XP leaderboard'))
    .addSubcommand((s) =>
      s
        .setName('remind')
        .setDescription('Set a reminder')
        .addIntegerOption((o) => o.setName('minutes').setDescription('Minutes from now').setRequired(true))
        .addStringOption((o) => o.setName('content').setDescription('Reminder text').setRequired(true)),
    ),
  execute: async (interaction) => {
    if (!interaction.isChatInputCommand() || !interaction.guildId) return;
    const sub = interaction.options.getSubcommand();
    if (sub === 'leaderboard') {
      const leveling = container.resolve('leveling') as { leaderboard: (guildId: string) => Promise<Array<{ userId: string; xp: number }>> };
      const board = await leveling.leaderboard(interaction.guildId);
      await reply(interaction, board.length ? board.map((p, i) => `${i + 1}. <@${p.userId}> — ${p.xp} XP`).join('\n') : 'No XP records yet.');
      return;
    }
    const db = container.resolve('db') as { reminder: { create: (arg: object) => Promise<unknown> } };
    const minutes = interaction.options.getInteger('minutes', true);
    const content = interaction.options.getString('content', true);
    const remindAt = new Date(Date.now() + minutes * 60 * 1000);
    await db.reminder.create({ data: { guildId: interaction.guildId, userId: interaction.user.id, remindAt, content } });
    await reply(interaction, `Reminder set for ${remindAt.toISOString()}.`);
  },
});
