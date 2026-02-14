#!/usr/bin/env node
import { execSync } from 'node:child_process';

const checks = [
  {
    name: 'Inside a git repository',
    run: () => execSync('git rev-parse --is-inside-work-tree', { encoding: 'utf8' }).trim() === 'true',
    fix: 'Run this command from the repository root.',
  },
  {
    name: 'Current branch exists',
    run: () => execSync('git branch --show-current', { encoding: 'utf8' }).trim().length > 0,
    fix: 'Create/switch to a branch: git checkout -b <branch-name>.',
  },
  {
    name: 'Git remote origin is configured',
    run: () => execSync('git remote get-url origin', { encoding: 'utf8' }).trim().length > 0,
    fix: 'Add remote: git remote add origin <repo-url>.',
  },
  {
    name: 'Working tree has committed changes',
    run: () => execSync('git status --porcelain', { encoding: 'utf8' }).trim().length === 0,
    invert: true,
    fix: 'Create a commit first: git add . && git commit -m "<message>".',
  },
  {
    name: 'GitHub CLI is installed',
    run: () => {
      execSync('gh --version', { stdio: 'ignore' });
      return true;
    },
    fix: 'Install GitHub CLI from https://cli.github.com/.',
  },
  {
    name: 'GitHub CLI is authenticated',
    run: () => {
      execSync('gh auth status', { stdio: 'ignore' });
      return true;
    },
    fix: 'Authenticate with: gh auth login.',
  },
  {
    name: 'Branch has upstream remote',
    run: () => {
      execSync('git rev-parse --abbrev-ref --symbolic-full-name @{u}', { stdio: 'ignore' });
      return true;
    },
    fix: 'Push with upstream: git push -u origin $(git branch --show-current).',
  },
];

let failed = 0;
console.log('PR readiness checks\n');

for (const check of checks) {
  try {
    const passed = Boolean(check.run());
    const finalPass = check.invert ? !passed : passed;

    if (finalPass) {
      console.log(`✅ ${check.name}`);
    } else {
      failed += 1;
      console.log(`❌ ${check.name}`);
      console.log(`   ↳ ${check.fix}`);
    }
  } catch {
    failed += 1;
    console.log(`❌ ${check.name}`);
    console.log(`   ↳ ${check.fix}`);
  }
}

if (failed > 0) {
  console.log(`\n${failed} check(s) failed. Fix the items above, then re-run: node scripts/pr-doctor.mjs`);
  process.exit(1);
}

console.log('\nAll checks passed. You should be able to create a pull request.');
