import { nanoid } from 'nanoid';
import type { Client, Interaction } from 'discord.js';
import type { CommandDefinition, ServiceContainer } from '@kanbal/core';
import { messages } from '../messages/catalog.js';
import { resolveService } from '../bootstrap/types.js';

export const registerInteractionCreate = (
  client: Client,
  container: ServiceContainer,
  commands: Map<string, CommandDefinition>,
): void => {
  client.on('interactionCreate', async (interaction: Interaction) => {
    if (!interaction.isChatInputCommand() && !interaction.isContextMenuCommand()) return;

    const command = commands.get(interaction.commandName);
    if (!command || !interaction.guildId || !interaction.memberPermissions) return;

    const correlationId = nanoid(10);
    const logger = resolveService(container, 'logger');
    const cooldowns = resolveService(container, 'cooldowns');
    const guildSettings = resolveService(container, 'guildSettings');
    const permissions = resolveService(container, 'permissions');

    const enabled = await guildSettings.isModuleEnabled(interaction.guildId, command.module);
    if (!enabled) {
      await interaction.reply({ content: messages.moduleDisabled, ephemeral: true });
      return;
    }

    const key = `${interaction.guildId}:${interaction.user.id}:${command.name}`;
    if (command.cooldownSeconds && cooldowns.isCooling(key, command.cooldownSeconds)) {
      await interaction.reply({ content: messages.cooldown, ephemeral: true });
      return;
    }

    const member = interaction.member;
    const roleIds =
      'roles' in member && member.roles && 'cache' in member.roles ? [...member.roles.cache.keys()] : [];
    const allowed = await permissions.canExecute(
      interaction.guildId,
      command.name,
      roleIds,
      command.requiredDiscordPermissions ?? [],
      interaction.memberPermissions,
    );
    if (!allowed) {
      await interaction.reply({ content: messages.noPermission, ephemeral: true });
      return;
    }

    try {
      await command.execute(interaction, { correlationId });
      logger.info({ correlationId, command: command.name, guildId: interaction.guildId }, 'Command executed');
    } catch (error) {
      logger.error({ correlationId, err: error, command: command.name }, 'Command failed');
      if (!interaction.replied && !interaction.deferred) {
        await interaction.reply({ content: `${messages.genericError} (ref: ${correlationId})`, ephemeral: true });
      }
    }
  });
};
