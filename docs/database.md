# Database

Prisma schema: `apps/bot/prisma/schema.prisma`

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

Use SQLite locally, PostgreSQL in production by setting env vars.
