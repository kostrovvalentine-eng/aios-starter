#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

if (Number.parseInt(process.versions.node.split(".")[0], 10) < 20) {
  console.error("AIOS Starter requires Node.js 20 or newer.");
  process.exit(1);
}

function run(command, args) {
  const result = spawnSync(command, args, { cwd: root, encoding: "utf8" });
  if (result.stdout) process.stdout.write(result.stdout);
  if (result.stderr) process.stderr.write(result.stderr);
  if (result.status !== 0) process.exit(result.status ?? 1);
}

run("bash", ["scripts/sync-skills.sh"]);
run(process.execPath, ["scripts/aios-doctor.mjs", "--write-index"]);

console.log("\nAIOS bootstrap complete.");
console.log("Open this folder in Codex and send:");
console.log("Use $onboard-aios to explain this system and set it up with me.");
