import { getConfig } from '@kanbal/config';
import { CooldownManager, EventBus, ServiceContainer } from '@kanbal/core';
import { prisma } from '@kanbal/db';
import { createLogger } from '@kanbal/logger';
import { GuildSettingsService } from '../services/guild-settings.service.js';
import { LevelingService } from '../services/leveling.service.js';
import { LoggingMetricsSink } from '../services/metrics.js';
import { ModerationService } from '../services/moderation.service.js';
import { PermissionService } from '../services/permission.service.js';

export const createContainer = () => {
  const container = new ServiceContainer();
  container.register('config', getConfig());
  container.register('logger', createLogger());
  container.register('db', prisma);
  container.register('bus', new EventBus());
  container.register('cooldowns', new CooldownManager());
  container.register('metrics', new LoggingMetricsSink());
  container.register('guildSettings', new GuildSettingsService(prisma));
  container.register('permissions', new PermissionService(prisma));
  container.register('moderation', new ModerationService(prisma));
  container.register('leveling', new LevelingService(prisma));
  return container;
};
