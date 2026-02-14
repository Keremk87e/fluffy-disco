import { SlashCommandBuilder } from 'discord.js';
import type { CommandDefinition, ServiceContainer } from '@kanbal/core';
import { reply } from '../utils/respond.js';

export const buildAutomodCommand = (container: ServiceContainer): CommandDefinition => ({
  name: 'automod',
  module: 'automod',
  cooldownSeconds: 3,
  data: new SlashCommandBuilder()
    .setName('automod')
    .setDescription('Manage automod and anti-raid settings')
    .addSubcommand((s) =>
      s
        .setName('rule')
        .setDescription('Upsert a rule')
        .addStringOption((o) =>
          o.setName('type').setDescription('Rule type').setRequired(true).addChoices(
            { name: 'anti_invite', value: 'anti_invite' },
            { name: 'anti_spam', value: 'anti_spam' },
            { name: 'anti_mass_mention', value: 'anti_mass_mention' },
            { name: 'keyword_blacklist', value: 'keyword_blacklist' },
          ),
        )
        .addStringOption((o) => o.setName('action').setDescription('delete|warn|timeout').setRequired(true))
        .addStringOption((o) => o.setName('config').setDescription('JSON config').setRequired(true)),
    )
    .addSubcommand((s) => s.setName('list').setDescription('List current rules')),
  execute: async (interaction) => {
    if (!interaction.isChatInputCommand() || !interaction.guildId) return;
    const sub = interaction.options.getSubcommand();
    const db = container.resolve('db') as {
      automodRule: {
        upsert: (arg: object) => Promise<unknown>;
        findMany: (arg: object) => Promise<Array<{ type: string; action: string; enabled: boolean }>>;
      };
    };

    if (sub === 'rule') {
      const type = interaction.options.getString('type', true);
      const action = interaction.options.getString('action', true);
      const config = interaction.options.getString('config', true);
      await db.automodRule.upsert({
        where: { guildId_type: { guildId: interaction.guildId, type } },
        create: { guildId: interaction.guildId, type, action, configJson: config },
        update: { action, configJson: config, enabled: true },
      });
      await reply(interaction, `Saved automod rule: ${type}`);
      return;
    }

    const rules = await db.automodRule.findMany({ where: { guildId: interaction.guildId } });
    await reply(interaction, rules.length ? rules.map((r) => `${r.type}: ${r.action} (${r.enabled ? 'on' : 'off'})`).join('\n') : 'No automod rules configured.');
  },
});
