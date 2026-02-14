import { describe, expect, it } from 'vitest';
import { getConfig } from './index.js';

describe('getConfig', () => {
  it('parses required config', () => {
    const cfg = getConfig({ DISCORD_TOKEN: 'x', DATABASE_URL: 'file:test.db', CLIENT_ID: '1' });
    expect(cfg.LOG_LEVEL).toBe('info');
  });
});
