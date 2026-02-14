#!/usr/bin/env node
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const runner = path.resolve(__dirname, '../../../packages/db/scripts/prisma-runner.mjs');
const args = process.argv.slice(2);

const child = spawn('node', [runner, ...args], {
  stdio: 'inherit',
  shell: process.platform === 'win32',
  env: process.env,
});

child.on('exit', (code) => process.exit(code ?? 1));
