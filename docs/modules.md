# Modules

Modules are logical capability groups with per-guild enable/disable controls.

## Current Modules
- `moderation`
- `automod`
- `utility`
- `community`

Feature flags are stored in `FeatureFlag` and checked before execution in the interaction handler.

## Per-command Permissions
Kanbal checks:
1. Discord native permissions required by command
2. Optional Kanbal role-based override layer from database mapping
