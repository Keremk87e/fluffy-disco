import type { CommandDefinition, ServiceContainer } from '@kanbal/core';
import { buildAutomodCommand } from './automod.js';
import { buildCommunityCommand } from './community.js';
import { buildHealthCommand } from './health.js';
import { buildModerationCommand } from './moderation.js';
import { buildUtilityCommand } from './utility.js';
import { profileCommand } from './profile.js';

export const buildCommands = (container: ServiceContainer): CommandDefinition[] => [
  buildModerationCommand(container),
  buildAutomodCommand(container),
  buildUtilityCommand(container),
  buildCommunityCommand(container),
  buildHealthCommand(container),
  profileCommand,
];
