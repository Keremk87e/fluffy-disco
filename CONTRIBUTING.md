# Contributing

## Development
```bash
pnpm install
pnpm -r lint
pnpm -r typecheck
pnpm -r test
pnpm -r build
```

## Standards
- TypeScript strict mode
- Keep commands thin; service layer handles business logic
- Add tests for service and utility logic
- Use conventional commits where possible
