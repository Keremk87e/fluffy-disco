import { buildCommands } from '../commands/index.js';
import { createContainer } from './container.js';
import { SingleProcessRunner } from './runner.js';

export const startBot = async (): Promise<void> => {
  const container = createContainer();
  const commands = buildCommands(container);
  const runner = new SingleProcessRunner(container, commands);
  await runner.start();
};
