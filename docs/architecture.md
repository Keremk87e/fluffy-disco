# Architecture

Kanbal uses a clean, modular monorepo design.

## Monorepo Layout
- `apps/bot`: Discord runtime and feature modules
- `packages/config`: validated environment config
- `packages/logger`: shared pino logger
- `packages/db`: Prisma client package
- `packages/core`: DI container, command contracts, event bus, cooldowns

## Runtime Flow
```text
Discord Gateway Events
    -> Event Handlers
        -> Command Router
            -> Permission + Feature Flag + Cooldown Guards
                -> Service Layer
                    -> Prisma DB
```

## Sharding Readiness
`BotRunner` abstraction separates startup strategy from feature logic. `SingleProcessRunner` is current implementation; shard-aware runner can be added without rewriting modules.
