# Deployment

## Options (No Docker Required)
- Windows Service / Task Scheduler
- PM2 on Linux VM
- systemd service on Linux
- PaaS with Node runtime support

## Baseline Steps
1. `pnpm install --frozen-lockfile`
2. configure `.env`
3. `pnpm --filter @kanbal/db prisma:generate`
4. `pnpm --filter @kanbal/bot prisma:migrate`
5. `pnpm --filter @kanbal/bot deploy:commands`
6. `pnpm --filter @kanbal/bot start`
