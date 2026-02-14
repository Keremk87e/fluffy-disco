import type { Client, Message } from 'discord.js';
import type { ServiceContainer } from '@kanbal/core';

const INVITE_REGEX = /(discord\.gg|discord\.com\/invite)\//i;

export const registerMessageCreate = (client: Client, container: ServiceContainer): void => {
  client.on('messageCreate', async (message: Message) => {
    if (!message.guildId || message.author.bot) return;

    const leveling = container.resolve('leveling') as { grantMessageXP: (guildId: string, userId: string) => Promise<void> };
    await leveling.grantMessageXP(message.guildId, message.author.id);

    const db = container.resolve('db') as {
      automodRule: { findMany: (arg: object) => Promise<Array<{ type: string; action: string; configJson: string }>> };
    };
    const rules = await db.automodRule.findMany({ where: { guildId: message.guildId, enabled: true } });

    for (const rule of rules) {
      if (rule.type === 'anti_invite' && INVITE_REGEX.test(message.content)) {
        await message.delete().catch(() => null);
      }
      if (rule.type === 'keyword_blacklist') {
        const keywords = JSON.parse(rule.configJson) as { words?: string[] };
        if (keywords.words?.some((w) => message.content.toLowerCase().includes(w.toLowerCase()))) {
          await message.delete().catch(() => null);
        }
      }
    }
  });
};
