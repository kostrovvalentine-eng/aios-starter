#!/usr/bin/env node
// Portability and leak scan for an AIOS repository.
//
// Publishing a personal operating system as a template is only safe if it
// carries no absolute home paths, no personal identifiers and no secrets.
// This scan is dependency-free on purpose: it must run on a machine that has
// nothing but Node.js, otherwise the release gate silently passes by accident.
//
//   node scripts/aios-portability-scan.mjs
//   node scripts/aios-portability-scan.mjs --strict
//   node scripts/aios-portability-scan.mjs --deny 'kostrov' --deny 'acme-corp'
//   node scripts/aios-portability-scan.mjs --json
//
// Flags:
//   --root <dir>      scan a different directory (default: repository root)
//   --deny <text>     extra case-insensitive literal to reject; repeatable
//   --allow <text>    extra case-insensitive literal to ignore; repeatable
//   --strict          treat warnings as failures
//   --json            machine-readable output
//
// Exit codes: 0 clean, 1 findings, 2 bad usage.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));

const SKIP_DIRS = new Set(['.git', 'node_modules', '.venv', 'venv', '__pycache__', '.pytest_cache']);
const SKIP_FILES = new Set(['package-lock.json', 'pnpm-lock.yaml', 'yarn.lock', 'aios-portability-scan.mjs']);
const MAX_BYTES = 2 * 1024 * 1024;

// Placeholder names that legitimately appear in documentation.
const PLACEHOLDER_HOMES = new Set([
  'you',
  'your-name',
  'yourname',
  'username',
  'user',
  'name',
  'me',
  'someone',
  'example',
  'home',
  'u',
]);

const RULES = [
  {
    id: 'unix-home-path',
    severity: 'error',
    message: 'absolute macOS or Linux home path',
    // Written without a literal home path so this file never flags itself.
    pattern: /(?:^|[^A-Za-z0-9._-])\/(?:Users|home)\/([A-Za-z0-9._-]+)\//g,
    keep(match) {
      return !PLACEHOLDER_HOMES.has(match[1].toLowerCase());
    },
  },
  {
    id: 'windows-home-path',
    severity: 'error',
    message: 'absolute Windows home path',
    pattern: /[A-Za-z]:\\+Users\\+([A-Za-z0-9._-]+)\\+/g,
    keep(match) {
      return !PLACEHOLDER_HOMES.has(match[1].toLowerCase());
    },
  },
  {
    id: 'private-key',
    severity: 'error',
    message: 'private key material',
    pattern: /-----BEGIN [A-Z ]*PRIVATE KEY-----/g,
  },
  {
    id: 'github-token',
    severity: 'error',
    message: 'GitHub token',
    pattern: /\bgh[pousr]_[A-Za-z0-9]{20,}\b/g,
  },
  {
    id: 'openai-key',
    severity: 'error',
    message: 'OpenAI-style secret key',
    pattern: /\bsk-[A-Za-z0-9_-]{20,}\b/g,
  },
  {
    id: 'slack-token',
    severity: 'error',
    message: 'Slack token',
    pattern: /\bxox[baprs]-[A-Za-z0-9-]{10,}\b/g,
  },
  {
    id: 'aws-key',
    severity: 'error',
    message: 'AWS access key id',
    pattern: /\bAKIA[0-9A-Z]{16}\b/g,
  },
  {
    id: 'google-key',
    severity: 'error',
    message: 'Google API key',
    pattern: /\bAIza[0-9A-Za-z_-]{35}\b/g,
  },
  {
    id: 'telegram-bot-token',
    severity: 'error',
    message: 'Telegram bot token',
    pattern: /\b\d{8,10}:[A-Za-z0-9_-]{34,}\b/g,
  },
  {
    id: 'email',
    severity: 'warning',
    message: 'email address',
    pattern: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g,
    keep(match) {
      const domain = match[0].split('@')[1].toLowerCase();
      return !['example.com', 'example.org', 'example.net', 'users.noreply.github.com'].includes(domain);
    },
  },
];

// Lines carrying an explicit placeholder marker are not findings.
const PLACEHOLDER_LINE = /\b(EXAMPLE|REPLACE[-_ ]?ME|CHANGEME|YOUR[-_ ]|<[^>]+>)\b/i;

function parseArgs(argv) {
  const out = { root: path.resolve(scriptDir, '..'), deny: [], allow: [], strict: false, json: false };
  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i];
    if (a === '--root') out.root = path.resolve(argv[++i]);
    else if (a === '--deny') out.deny.push(argv[++i]);
    else if (a === '--allow') out.allow.push(argv[++i]);
    else if (a === '--strict') out.strict = true;
    else if (a === '--json') out.json = true;
    else if (a === '--help' || a === '-h') out.help = true;
    else throw new Error(`unknown argument: ${a}`);
  }
  return out;
}

function walk(dir, rel = '', acc = []) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return acc;
  }
  for (const entry of entries) {
    const childRel = rel ? `${rel}/${entry.name}` : entry.name;
    const abs = path.join(dir, entry.name);
    if (entry.isSymbolicLink()) continue;
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue;
      walk(abs, childRel, acc);
    } else if (entry.isFile()) {
      if (SKIP_FILES.has(entry.name)) continue;
      acc.push({ abs, rel: childRel });
    }
  }
  return acc;
}

function readTextFile(file) {
  let stat;
  try {
    stat = fs.statSync(file);
  } catch {
    return null;
  }
  if (stat.size === 0 || stat.size > MAX_BYTES) return null;
  const buf = fs.readFileSync(file);
  if (buf.subarray(0, 8192).includes(0)) return null;
  return buf.toString('utf8');
}

function scan(options) {
  const findings = [];
  const custom = options.deny.map((d) => ({
    id: 'custom-deny',
    severity: 'error',
    message: `denied literal "${d}"`,
    pattern: new RegExp(d.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'),
  }));
  const rules = [...RULES, ...custom];
  const allow = options.allow.map((a) => a.toLowerCase());

  let files = 0;
  for (const { abs, rel } of walk(options.root)) {
    const text = readTextFile(abs);
    if (text === null) continue;
    files += 1;
    const lines = text.split('\n');
    for (let i = 0; i < lines.length; i += 1) {
      const line = lines[i];
      const lower = line.toLowerCase();
      if (PLACEHOLDER_LINE.test(line)) continue;
      if (allow.some((a) => lower.includes(a))) continue;
      for (const rule of rules) {
        rule.pattern.lastIndex = 0;
        let match;
        while ((match = rule.pattern.exec(line)) !== null) {
          if (rule.keep && !rule.keep(match)) continue;
          findings.push({
            rule: rule.id,
            severity: rule.severity,
            message: rule.message,
            file: rel,
            line: i + 1,
            excerpt: match[0].length > 60 ? `${match[0].slice(0, 57)}...` : match[0],
          });
        }
      }
    }
  }
  return { files, findings };
}

function main() {
  let options;
  try {
    options = parseArgs(process.argv.slice(2));
  } catch (err) {
    process.stderr.write(`error: ${err.message}\n`);
    process.exit(2);
  }
  if (options.help) {
    process.stdout.write('usage: node scripts/aios-portability-scan.mjs [--root DIR] [--deny TEXT]... [--allow TEXT]... [--strict] [--json]\n');
    process.exit(0);
  }
  if (!fs.existsSync(options.root)) {
    process.stderr.write(`error: ${options.root} does not exist\n`);
    process.exit(2);
  }

  const { files, findings } = scan(options);
  const errors = findings.filter((f) => f.severity === 'error');
  const warnings = findings.filter((f) => f.severity === 'warning');

  if (options.json) {
    process.stdout.write(`${JSON.stringify({ root: options.root, files, errors, warnings }, null, 2)}\n`);
  } else {
    for (const f of findings) {
      process.stdout.write(`${f.severity.toUpperCase()} ${f.file}:${f.line}: ${f.message} (${f.rule}): ${f.excerpt}\n`);
    }
    process.stdout.write(
      `AIOS portability scan: files=${files} errors=${errors.length} warnings=${warnings.length}\n`,
    );
  }

  if (errors.length || (options.strict && warnings.length)) process.exit(1);
  process.exit(0);
}

main();
