#!/usr/bin/env node
import { spawn } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '../../..');
const envPath = path.join(repoRoot, '.env');

const loadDotEnv = (filePath) => {
  if (!existsSync(filePath)) return;
  const content = readFileSync(filePath, 'utf8');
  for (const rawLine of content.split(/\r?\n/u)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const idx = line.indexOf('=');
    if (idx <= 0) continue;
    const key = line.slice(0, idx).trim();
    const value = line.slice(idx + 1).trim();
    if (!(key in process.env)) process.env[key] = value;
  }
};

const resolveSchemaPath = (inputPath, provider) => {
  const normalizedProvider = provider?.toLowerCase() === 'postgresql' ? 'postgresql' : 'sqlite';
  if (normalizedProvider !== 'postgresql') return inputPath;
  if (!inputPath.endsWith('schema.prisma')) return inputPath;
  return inputPath.replace(/schema\.prisma$/u, 'schema.postgresql.prisma');
};

loadDotEnv(envPath);

if (!process.env.DATABASE_PROVIDER) {
  process.env.DATABASE_PROVIDER = 'sqlite';
}
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = 'file:./dev.db';
}

const args = [...process.argv.slice(2)];
const schemaIndex = args.findIndex((arg) => arg === '--schema');
if (schemaIndex >= 0 && args[schemaIndex + 1]) {
  args[schemaIndex + 1] = resolveSchemaPath(args[schemaIndex + 1], process.env.DATABASE_PROVIDER);
}

const child = spawn('prisma', args, {
  stdio: 'inherit',
  shell: process.platform === 'win32',
  env: process.env,
});

child.on('exit', (code) => process.exit(code ?? 1));
