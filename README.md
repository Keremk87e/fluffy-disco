# Kanbal

Kanbal is a production-focused, English-only Discord bot built with TypeScript and discord.js v14. It is modular, guild-configurable, and designed to cover the same operational space as bots like Dyno and MEE6 (without a web dashboard).

## Highlights
- Slash-command-first framework (no legacy prefix commands)
- Modular features with per-guild feature flags
- Moderation suite with case tracking and warning system
- Automod + anti-raid baseline protections
- Utility systems (welcome/leave, tickets, suggestions, custom commands, autoroles, reaction role persistence)
- Community systems (XP leveling, leaderboard, reminders)
- Prisma-backed data layer (SQLite)
- Structured pino logging, correlation IDs, and metrics-ready interfaces
- Sharding-ready runner abstraction

## Tech Stack
- Node.js LTS
- pnpm workspace monorepo
- TypeScript (strict)
- discord.js 14.25.1
- Prisma ORM
- Zod config validation
- Vitest, ESLint, Prettier, Husky, lint-staged

## Quickstart
```bash
pnpm install
cp .env.example .env
# edit .env
pnpm --filter @kanbal/db prisma:generate
pnpm --filter @kanbal/bot prisma:migrate
pnpm --filter @kanbal/bot deploy:commands
pnpm --filter @kanbal/bot start
```

## Prisma Configuration
- Connection URL is defined via `DATABASE_URL` in `apps/bot/prisma.config.ts`.
- Datasource provider is fixed as `sqlite` in `apps/bot/prisma/schema.prisma`.

## Environment Variables
- `DISCORD_TOKEN`: Bot token
- `CLIENT_ID`: Discord application client ID
- `DATABASE_URL`: Prisma connection string
  - SQLite local default: `file:./apps/bot/prisma/dev.db`
- `LOG_LEVEL`: `fatal|error|warn|info|debug|trace`
- `NODE_ENV`: `development|test|production`

## Commands and Modules
- `/moderation ...`
- `/automod ...`
- `/utility ...`
- `/community ...`
- `/health`

All module messages and responses are centralized in `apps/bot/src/messages` for future i18n compatibility.

## Add a Module or Command
1. Create service logic in `apps/bot/src/services`.
2. Register services in `apps/bot/src/bootstrap/container.ts`.
3. Add command definitions in `apps/bot/src/commands`.
4. Include module metadata in `apps/bot/src/modules/index.ts`.
5. Register command in `apps/bot/src/commands/index.ts`.

## Production Notes
- Invite with required privileged intents (Message Content and Guild Members as needed).
- Ensure role hierarchy permits moderation actions.
- The runner supports single process today and is ready to expand into shard runners.

## Workspace Scripts
- `pnpm -r lint`
- `pnpm -r typecheck`
- `pnpm -r test`
- `pnpm -r build`
- `pnpm pr:doctor` (diagnose why PR creation/push can fail)

## PR Troubleshooting
If you cannot open a PR, run `pnpm pr:doctor`. It validates git remotes, commit state, GitHub CLI auth, and upstream branch tracking, then prints exact fixes.

