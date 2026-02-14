import { Client, GatewayIntentBits, Partials } from 'discord.js';
import type { CommandDefinition, ServiceContainer } from '@kanbal/core';
import { registerGuildMemberAdd } from '../events/guild-member-add.js';
import { registerInteractionCreate } from '../events/interaction-create.js';
import { registerMessageCreate } from '../events/message-create.js';

export interface BotRunner {
  start(): Promise<void>;
}

export class SingleProcessRunner implements BotRunner {
  constructor(
    private readonly container: ServiceContainer,
    private readonly commands: CommandDefinition[],
  ) {}

  async start(): Promise<void> {
    const config = this.container.resolve('config') as { DISCORD_TOKEN: string };
    const logger = this.container.resolve('logger') as { info: (obj: object, msg: string) => void };

    const client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent,
      ],
      partials: [Partials.Channel],
    });

    const map = new Map<string, CommandDefinition>(this.commands.map((cmd) => [cmd.name, cmd]));
    registerInteractionCreate(client, this.container, map);
    registerMessageCreate(client, this.container);
    registerGuildMemberAdd(client, this.container);

    client.once('ready', () => {
      logger.info({ user: client.user?.tag }, 'Kanbal connected');
    });

    await client.login(config.DISCORD_TOKEN);
  }
}
