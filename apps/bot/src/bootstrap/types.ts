import type { AppConfig } from '@kanbal/config';
import type { CooldownManager, EventBus } from '@kanbal/core';
import type { DB } from '@kanbal/db';
import type { Logger } from 'pino';
import type { GuildSettingsService } from '../services/guild-settings.service.js';
import type { LevelingService } from '../services/leveling.service.js';
import type { LoggingMetricsSink } from '../services/metrics.js';
import type { ModerationService } from '../services/moderation.service.js';
import type { PermissionService } from '../services/permission.service.js';

export type AppServices = {
  config: AppConfig;
  logger: Logger;
  db: DB;
  bus: EventBus;
  cooldowns: CooldownManager;
  metrics: LoggingMetricsSink;
  guildSettings: GuildSettingsService;
  permissions: PermissionService;
  moderation: ModerationService;
  leveling: LevelingService;
};

export const resolveService = <K extends keyof AppServices>(
  container: { resolve: <T>(key: string) => T },
  key: K,
): AppServices[K] => container.resolve<AppServices[K]>(key);
