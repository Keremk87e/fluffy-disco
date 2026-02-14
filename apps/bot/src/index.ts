import { startBot } from './bootstrap/start.js';

startBot().catch((error: unknown) => {
  console.error('Fatal startup error', error);
  process.exitCode = 1;
});
