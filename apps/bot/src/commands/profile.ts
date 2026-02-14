import { ApplicationCommandType, ContextMenuCommandBuilder } from 'discord.js';
import type { CommandDefinition } from '@kanbal/core';

export const profileCommand: CommandDefinition = {
  name: 'User Profile',
  module: 'community',
  cooldownSeconds: 3,
  data: new ContextMenuCommandBuilder().setName('User Profile').setType(ApplicationCommandType.User),
  execute: async (interaction) => {
    if (!interaction.isUserContextMenuCommand()) return;
    await interaction.reply({
      content: `User: ${interaction.targetUser.tag}\nID: ${interaction.targetUser.id}`,
      ephemeral: true,
    });
  },
};
