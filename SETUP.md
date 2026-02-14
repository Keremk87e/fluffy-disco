# First Run Setup (Windows)

1. Install Node.js LTS and pnpm.
2. Extract project zip.
3. Open PowerShell in project root.
4. Run:
   ```powershell
   pnpm install
   Copy-Item .env.example .env
   ```
5. Edit `.env` values.
6. Generate Prisma client and migrate:
   ```powershell
   pnpm --filter @kanbal/db prisma:generate
   pnpm --filter @kanbal/bot prisma:migrate
   ```
7. Deploy slash commands:
   ```powershell
   pnpm --filter @kanbal/bot deploy:commands
   ```
8. Start bot:
   ```powershell
   pnpm --filter @kanbal/bot start
   ```
