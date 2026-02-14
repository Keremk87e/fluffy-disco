import type { DB } from '@kanbal/db';

export class ModerationService {
  constructor(private readonly db: DB) {}

  async createCase(guildId: string, action: string, actorId: string, targetId: string, reason?: string): Promise<number> {
    const latest = await this.db.moderationCase.findFirst({
      where: { guildId },
      orderBy: { caseNumber: 'desc' },
    });
    const caseNumber = (latest?.caseNumber ?? 0) + 1;
    await this.db.moderationCase.create({
      data: { guildId, action, actorId, targetId, reason, caseNumber },
    });
    return caseNumber;
  }

  async warn(guildId: string, actorId: string, targetId: string, reason?: string): Promise<void> {
    const caseNumber = await this.createCase(guildId, 'warn', actorId, targetId, reason);
    const modCase = await this.db.moderationCase.findUnique({ where: { guildId_caseNumber: { guildId, caseNumber } } });
    await this.db.warning.create({
      data: { guildId, actorId, targetId, reason, moderationCaseId: modCase?.id },
    });
  }

  async listWarnings(guildId: string, targetId: string) {
    return this.db.warning.findMany({ where: { guildId, targetId }, orderBy: { createdAt: 'desc' } });
  }
}
