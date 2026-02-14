import { SlashCommandBuilder } from 'discord.js';
import type { CommandDefinition, ServiceContainer } from '@kanbal/core';
import { messages } from '../messages/catalog.js';
import { reply } from '../utils/respond.js';

export const buildHealthCommand = (container: ServiceContainer): CommandDefinition => ({
  name: 'health',
  module: 'utility',
  cooldownSeconds: 2,
  data: new SlashCommandBuilder().setName('health').setDescription('Health check for DB and bot permissions'),
  execute: async (interaction) => {
    const db = container.resolve('db') as { $queryRawUnsafe: (sql: string) => Promise<unknown> };
    await db.$queryRawUnsafe('SELECT 1');
    await reply(interaction, messages.healthOk);
  },
});
