# Database

Prisma schemas:
- SQLite: `apps/bot/prisma/schema.prisma`
- PostgreSQL: `apps/bot/prisma/schema.postgresql.prisma`

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

Use SQLite locally, PostgreSQL in production by setting `DATABASE_PROVIDER=postgresql` and a PostgreSQL `DATABASE_URL`. Prisma runner scripts automatically select the matching schema file.
