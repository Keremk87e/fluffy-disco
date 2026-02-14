import type { ServiceContainer } from '@kanbal/core';

export const runHealthcheck = async (container: ServiceContainer): Promise<void> => {
  const db = container.resolve('db') as { $queryRawUnsafe: (query: string) => Promise<unknown> };
  await db.$queryRawUnsafe('SELECT 1');
};
