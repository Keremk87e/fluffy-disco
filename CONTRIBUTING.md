# Contributing

## Development
```bash
pnpm install
pnpm -r lint
pnpm -r typecheck
pnpm -r test
pnpm -r build
```

## Pull Request Troubleshooting
If pull request creation fails, run:

```bash
pnpm pr:doctor
```

This checks common blockers:
- missing `origin` remote
- missing commit
- missing/unauthenticated GitHub CLI
- missing upstream branch tracking

## Standards
- TypeScript strict mode
- Keep commands thin; service layer handles business logic
- Add tests for service and utility logic
- Use conventional commits where possible
