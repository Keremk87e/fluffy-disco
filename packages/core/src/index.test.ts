import { describe, expect, it } from 'vitest';
import { CooldownManager } from './index.js';

describe('CooldownManager', () => {
  it('applies cooldowns', () => {
    const manager = new CooldownManager();
    expect(manager.isCooling('a', 1)).toBe(false);
    expect(manager.isCooling('a', 1)).toBe(true);
  });
});
