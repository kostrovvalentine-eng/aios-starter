#!/usr/bin/env node

import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const raw = process.argv.slice(2);
const files = [];
let summary = "Save AIOS state";
let plan = false;
let push = false;

for (let index = 0; index < raw.length; index += 1) {
  const argument = raw[index];
  if (argument === "--file") files.push(raw[++index]);
  else if (argument === "--summary") summary = raw[++index];
  else if (argument === "--plan") plan = true;
  else if (argument === "--push") push = true;
  else throw new Error(`Unknown argument: ${argument}`);
}

if (!files.length) throw new Error("Select at least one file with --file");

for (const file of files) {
  if (!file || path.isAbsolute(file) || file.split(path.sep).includes("..")) throw new Error(`Unsafe file selector: ${file}`);
}

function run(command, args, options = {}) {
  const result = spawnSync(command, args, { cwd: root, encoding: "utf8", ...options });
  if (result.stdout) process.stdout.write(result.stdout);
  if (result.stderr) process.stderr.write(result.stderr);
  if (result.status !== 0) process.exit(result.status ?? 1);
  return result;
}

run(process.execPath, ["scripts/aios-doctor.mjs", "--no-write"]);
run("git", ["diff", "--check", "--", ...files]);

if (plan) {
  console.log(`Plan: commit ${files.length} selected path(s)`);
  for (const file of files) console.log(`- ${file}`);
  console.log("Push: disabled");
  process.exit(0);
}

run("git", ["add", "-A", "--", ...files]);
const staged = spawnSync("git", ["diff", "--cached", "--quiet"], { cwd: root });
if (staged.status === 0) {
  console.log("No selected changes to commit.");
  process.exit(0);
}
run("git", ["commit", "-m", `aios: ${summary}`]);
if (push) run("git", ["push"]);
else console.log("Created local commit. Push was not requested.");
