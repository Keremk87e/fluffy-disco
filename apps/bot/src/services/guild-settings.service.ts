import type { DB } from '@kanbal/db';

export class GuildSettingsService {
  constructor(private readonly db: DB) {}

  async ensureDefaults(guildId: string): Promise<void> {
    await this.db.guildSettings.upsert({
      where: { guildId },
      create: { guildId },
      update: {},
    });
  }

  async isModuleEnabled(guildId: string, module: string): Promise<boolean> {
    await this.ensureDefaults(guildId);
    const flag = await this.db.featureFlag.findUnique({ where: { guildId_module: { guildId, module } } });
    return flag?.enabled ?? true;
  }
}
