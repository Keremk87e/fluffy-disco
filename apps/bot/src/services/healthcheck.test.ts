import { describe, expect, it } from 'vitest';
import { ServiceContainer } from '@kanbal/core';
import { runHealthcheck } from './healthcheck.js';

describe('runHealthcheck', () => {
  it('queries db', async () => {
    const c = new ServiceContainer();
    let called = false;
    c.register('db', { $queryRawUnsafe: async () => { called = true; return 1; } });
    await runHealthcheck(c);
    expect(called).toBe(true);
  });
});
