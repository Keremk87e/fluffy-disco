import type { PermissionResolvable } from 'discord.js';
import type { DB } from '@kanbal/db';

export class PermissionService {
  constructor(private readonly db: DB) {}

  async canExecute(
    guildId: string,
    command: string,
    userRoleIds: string[],
    requiredDiscordPermissions: PermissionResolvable[] = [],
    memberPermissions: { has: (perm: PermissionResolvable) => boolean },
  ): Promise<boolean> {
    const permissionConfig = await this.db.customCommand.findFirst({
      where: { guildId, trigger: `perm:${command}` },
    });

    const allowedRole = permissionConfig?.response;
    if (allowedRole && !userRoleIds.includes(allowedRole)) {
      return false;
    }

    return requiredDiscordPermissions.every((permission) => memberPermissions.has(permission));
  }
}
