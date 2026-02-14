# Database

Prisma schema: `apps/bot/prisma/schema.prisma`
Prisma config: `apps/bot/prisma.config.ts`

## Main Models
- `GuildSettings`
- `FeatureFlag`
- `ModerationCase`
- `Warning`
- `AutomodRule`
- `Ticket`
- `CustomCommand`
- `GuildMemberXP`
- `Reminder`
- `ReactionRole`
- `Autorole`
- `Suggestion`

## Migration Workflow
```bash
pnpm --filter @kanbal/bot prisma:migrate
pnpm --filter @kanbal/db prisma:generate
```

Use SQLite via `DATABASE_URL` (default: `file:./apps/bot/prisma/dev.db`).
