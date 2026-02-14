import { REST, Routes } from 'discord.js';
import { createContainer } from '../bootstrap/container.js';
import { buildCommands } from '../commands/index.js';

const deploy = async (): Promise<void> => {
  const container = createContainer();
  const config = container.resolve('config') as { CLIENT_ID: string; DISCORD_TOKEN: string };
  const logger = container.resolve('logger') as { info: (obj: object, msg: string) => void };
  const rest = new REST({ version: '10' }).setToken(config.DISCORD_TOKEN);
  const commands = buildCommands(container).map((c) => c.data.toJSON());

  await rest.put(Routes.applicationCommands(config.CLIENT_ID), { body: commands });
  logger.info({ count: commands.length }, 'Slash commands deployed');
};

deploy().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
