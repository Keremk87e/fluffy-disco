import type { ChatInputCommandInteraction } from 'discord.js';

export const reply = async (interaction: ChatInputCommandInteraction, content: string): Promise<void> => {
  if (interaction.replied || interaction.deferred) {
    await interaction.followUp({ content, ephemeral: true });
    return;
  }
  await interaction.reply({ content, ephemeral: true });
};
