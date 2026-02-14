import { createContainer } from '../bootstrap/container.js';
import { runHealthcheck } from '../services/healthcheck.js';

const main = async (): Promise<void> => {
  const container = createContainer();
  await runHealthcheck(container);
  console.log('Healthcheck OK');
};

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
