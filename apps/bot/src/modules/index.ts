export const modules = {
  moderation: { name: 'moderation', description: 'Moderation and case management' },
  automod: { name: 'automod', description: 'Automod and anti-raid controls' },
  utility: { name: 'utility', description: 'Server utilities and management tools' },
  community: { name: 'community', description: 'XP, leaderboard, and reminders' },
};

export type ModuleName = keyof typeof modules;
