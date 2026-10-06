#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const argv = new Set(process.argv.slice(2));
const quiet = argv.has("--quiet");
const writeIndex = argv.has("--write-index");
const errors = [];
const warnings = [];

const required = [
  "AGENTS.md",
  "CLAUDE.md",
  "MANUAL.md",
  "connections.md",
  "context/system-state.md",
  "context/about-me.md",
  "context/about-business.md",
  "context/priorities.md",
  "decisions/log.md",
  "inbox/tasks.md",
  "inbox/events.md",
  "projects/registry.json",
  "references/router-protocol.md",
  "references/aios-structure.md",
  "references/context-update.md",
  "references/auto-capture.md",
  "skills/policy.json"
];

for (const relative of required) {
  if (!fs.existsSync(path.join(root, relative))) errors.push(`missing required file: ${relative}`);
}

function walk(directory) {
  if (!fs.existsSync(directory)) return [];
  const output = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if ([".git", ".aios-private", "node_modules", "downloads", "dev"].includes(entry.name)) continue;
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) output.push(...walk(full));
    else output.push(full);
  }
  return output;
}

const allFiles = walk(root);
const markdown = allFiles.filter((file) => file.endsWith(".md"));

for (const file of markdown) {
  const relative = path.relative(root, file);
  if (relative.startsWith("templates/")) continue;
  if (!(relative.startsWith("context/") || relative.startsWith("projects/") || relative.startsWith("references/"))) continue;
  const lines = fs.readFileSync(file, "utf8").split(/\r?\n/);
  if (!/^#\s+/.test(lines[0] || "")) errors.push(`missing H1: ${relative}`);
  if (!/^\*Last updated: \d{4}-\d{2}-\d{2}\*$/.test(lines[1] || "")) {
    errors.push(`invalid line-2 date: ${relative}`);
  }
}

let registry = { projects: [] };
try {
  registry = JSON.parse(fs.readFileSync(path.join(root, "projects/registry.json"), "utf8"));
  if (registry.schemaVersion !== 1 || !Array.isArray(registry.projects)) throw new Error("invalid schema");
  const slugs = new Set();
  for (const project of registry.projects) {
    if (!project.slug || slugs.has(project.slug)) errors.push(`invalid or duplicate project slug: ${project.slug || "<missing>"}`);
    slugs.add(project.slug);
    for (const route of project.routes || []) {
      if (!fs.existsSync(path.join(root, route))) errors.push(`missing project route: ${route}`);
    }
  }
} catch (error) {
  errors.push(`invalid projects/registry.json: ${error.message}`);
}

let policy = { hidden_from_discovery: [] };
try {
  policy = JSON.parse(fs.readFileSync(path.join(root, "skills/policy.json"), "utf8"));
  if (policy.default_invocation !== "manual-only") errors.push("personal skills must default to manual-only");
  if ((policy.implicit_invocation_allowlist || []).length !== 0) errors.push("implicit skill allowlist must start empty");
} catch (error) {
  errors.push(`invalid skills/policy.json: ${error.message}`);
}

const skillRoot = path.join(root, "skills");
const skills = fs.readdirSync(skillRoot, { withFileTypes: true })
  .filter((entry) => entry.isDirectory() && fs.existsSync(path.join(skillRoot, entry.name, "SKILL.md")))
  .map((entry) => entry.name)
  .sort();
const hidden = new Set(policy.hidden_from_discovery || []);

for (const skill of skills) {
  if (!fs.existsSync(path.join(skillRoot, skill, "agents/openai.yaml"))) errors.push(`missing agents/openai.yaml: skills/${skill}`);
  const body = fs.readFileSync(path.join(skillRoot, skill, "SKILL.md"), "utf8");
  if (!body.startsWith("---\n") || !body.includes(`\nname: ${skill}\n`) || !body.includes("\ndescription:")) {
    errors.push(`invalid skill frontmatter: skills/${skill}/SKILL.md`);
  }
  const yaml = fs.readFileSync(path.join(skillRoot, skill, "agents/openai.yaml"), "utf8");
  if (!/allow_implicit_invocation:\s*false/.test(yaml)) errors.push(`skill is not manual-only: ${skill}`);
}

for (const adapterRoot of [".agents/skills", ".claude/skills"]) {
  const fullRoot = path.join(root, adapterRoot);
  const visible = skills.filter((skill) => !hidden.has(skill));
  for (const skill of visible) {
    const adapter = path.join(fullRoot, skill);
    if (!fs.existsSync(adapter)) {
      errors.push(`missing skill adapter: ${adapterRoot}/${skill}`);
      continue;
    }
    if (!fs.lstatSync(adapter).isSymbolicLink()) errors.push(`adapter is not a symlink: ${adapterRoot}/${skill}`);
    else if (fs.readlinkSync(adapter) !== `../../skills/${skill}`) errors.push(`wrong adapter target: ${adapterRoot}/${skill}`);
  }
}

const textExtensions = new Set([".md", ".json", ".toml", ".yaml", ".yml", ".js", ".mjs", ".sh", ".txt", ".example"]);
const secretPatterns = [
  /\b(?:ghp|gho|github_pat)_[A-Za-z0-9_]{20,}\b/,
  /\bsk-[A-Za-z0-9_-]{20,}\b/,
  /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
  /(?:TOKEN|SECRET|PASSWORD|API_KEY)\s*=\s*(?!<|\$\{|$)[^\s#]{8,}/i
];

for (const file of allFiles) {
  const extension = path.extname(file);
  if (!textExtensions.has(extension) && !["AGENTS.md", "CLAUDE.md", "LICENSE"].includes(path.basename(file))) continue;
  if (fs.statSync(file).size > 1_000_000) continue;
  const relative = path.relative(root, file);
  const content = fs.readFileSync(file, "utf8");
  if (/\/(?:Users|home)\/[A-Za-z0-9._-]+\//.test(content)) errors.push(`non-portable absolute home path: ${relative}`);
  for (const pattern of secretPatterns) {
    if (pattern.test(content)) errors.push(`possible secret in ${relative}`);
  }
}

const rawFiles = allFiles
  .map((file) => path.relative(root, file))
  .filter((file) => file.startsWith("raw/") && file !== "raw/README.md");
const operationsLog = fs.existsSync(path.join(root, "log.md")) ? fs.readFileSync(path.join(root, "log.md"), "utf8") : "";
for (const file of rawFiles) {
  if (!operationsLog.includes(path.basename(file))) warnings.push(`unprocessed raw file: ${file}`);
}

const state = fs.existsSync(path.join(root, "context/system-state.md"))
  ? fs.readFileSync(path.join(root, "context/system-state.md"), "utf8")
  : "";
if (/Status:\s*fresh/i.test(state)) warnings.push("onboarding is not complete; run $onboard-aios");

let dirtyCount = 0;
try {
  const status = execFileSync("git", ["status", "--porcelain=v1"], { cwd: root, encoding: "utf8" }).trim();
  dirtyCount = status ? status.split("\n").length : 0;
  if (dirtyCount) warnings.push(`Git working tree has ${dirtyCount} change(s)`);
} catch {
  warnings.push("Git status is unavailable");
}

if (writeIndex && errors.length === 0) {
  const indexFile = path.join(root, "INDEX.md");
  const entries = markdown
    .map((file) => path.relative(root, file))
    .filter((file) => file !== "INDEX.md")
    .sort()
    .map((file) => `- [${file}](${file})`)
    .join("\n");
  // Rewrite only when the file map actually changed. Regenerating the same
  // entries with a new date turns INDEX.md dirty every single day and makes a
  // brand new install look broken on its second morning.
  const previous = fs.existsSync(indexFile) ? fs.readFileSync(indexFile, "utf8") : "";
  const previousEntries = previous
    .split("\n")
    .filter((line) => line.startsWith("- ["))
    .join("\n");
  if (previousEntries !== entries) {
    const date = new Date().toISOString().slice(0, 10);
    fs.writeFileSync(indexFile, `# AIOS Index\n*Last map change: ${date} by scripts/aios-doctor.mjs*\n\n${entries}\n`);
  }
}

if (!quiet || errors.length) {
  console.log(`AIOS doctor: files=${allFiles.length} projects=${registry.projects.length} skills=${skills.length} errors=${errors.length} warnings=${warnings.length}`);
  for (const error of errors) console.log(`ERROR: ${error}`);
  for (const warning of warnings) console.log(`WARN: ${warning}`);
}

process.exit(errors.length ? 1 : 0);
