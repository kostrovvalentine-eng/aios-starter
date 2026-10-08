#!/usr/bin/env node

import fs from "node:fs";
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

// Only a fresh install needs the onboarding hint. The onboarding skill runs
// bootstrap again at the end, and repeating "start onboarding" there would
// tell a brand-new owner to do it all over again.
const statePath = path.join(root, "context/system-state.md");
const state = fs.existsSync(statePath) ? fs.readFileSync(statePath, "utf8") : "";
if (/Status:\s*fresh/i.test(state)) {
  console.log("Start a new chat in this folder and send:");
  console.log("  Codex:  $onboard-aios");
  console.log("  Claude: /onboard-aios");
}
