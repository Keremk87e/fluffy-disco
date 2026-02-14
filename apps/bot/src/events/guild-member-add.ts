import type { Client, GuildMember } from 'discord.js';
import type { ServiceContainer } from '@kanbal/core';

export const registerGuildMemberAdd = (client: Client, container: ServiceContainer): void => {
  client.on('guildMemberAdd', async (member: GuildMember) => {
    const db = container.resolve('db') as {
      autorole: { findMany: (arg: object) => Promise<Array<{ roleId: string }>> };
      guildSettings: { findUnique: (arg: object) => Promise<{ welcomeChannelId: string | null; welcomeTemplate: string | null } | null> };
    };

    const roles = await db.autorole.findMany({ where: { guildId: member.guild.id } });
    for (const role of roles) {
      await member.roles.add(role.roleId).catch(() => null);
    }

    const settings = await db.guildSettings.findUnique({ where: { guildId: member.guild.id } });
    if (settings?.welcomeChannelId) {
      const channel = await member.guild.channels.fetch(settings.welcomeChannelId).catch(() => null);
      if (channel?.isTextBased()) {
        await channel.send((settings.welcomeTemplate ?? 'Welcome {user}!').replace('{user}', `<@${member.id}>`));
      }
    }
  });
};
