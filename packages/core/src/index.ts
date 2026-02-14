import {
  ContextMenuCommandBuilder,
  type CommandInteraction,
  type PermissionResolvable,
  SlashCommandBuilder,
} from 'discord.js';

export type CommandData = SlashCommandBuilder | ContextMenuCommandBuilder;

export type CommandContext = {
  correlationId: string;
};

export type CommandDefinition = {
  name: string;
  data: CommandData;
  requiredDiscordPermissions?: PermissionResolvable[];
  cooldownSeconds?: number;
  module: string;
  execute: (interaction: CommandInteraction, ctx: CommandContext) => Promise<void>;
};

export class ServiceContainer {
  private readonly services = new Map<string, unknown>();

  register<T>(key: string, value: T): void {
    this.services.set(key, value);
  }

  resolve<T>(key: string): T {
    const value = this.services.get(key);
    if (!value) throw new Error(`Service '${key}' not registered.`);
    return value as T;
  }
}

export class EventBus {
  emit(event: string, payload: Record<string, unknown>): void {
    process.emit(event, payload);
  }
}

export class CooldownManager {
  private readonly hits = new Map<string, number>();

  isCooling(key: string, cooldownSeconds: number): boolean {
    const now = Date.now();
    const expires = this.hits.get(key) ?? 0;
    if (expires > now) return true;
    this.hits.set(key, now + cooldownSeconds * 1000);
    return false;
  }
}
