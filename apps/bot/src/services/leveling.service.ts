import type { DB } from '@kanbal/db';

const XP_COOLDOWN_MS = 60_000;

export class LevelingService {
  constructor(private readonly db: DB) {}

  async grantMessageXP(guildId: string, userId: string): Promise<void> {
    const current = await this.db.guildMemberXP.upsert({
      where: { guildId_userId: { guildId, userId } },
      create: { guildId, userId, xp: 0, level: 1 },
      update: {},
    });

    if (current.lastGainAt && Date.now() - current.lastGainAt.getTime() < XP_COOLDOWN_MS) return;

    const nextXp = current.xp + 15;
    const nextLevel = Math.floor(Math.sqrt(nextXp / 100)) + 1;

    await this.db.guildMemberXP.update({
      where: { guildId_userId: { guildId, userId } },
      data: { xp: nextXp, level: nextLevel, lastGainAt: new Date() },
    });
  }

  async leaderboard(guildId: string) {
    return this.db.guildMemberXP.findMany({ where: { guildId }, orderBy: { xp: 'desc' }, take: 10 });
  }
}
