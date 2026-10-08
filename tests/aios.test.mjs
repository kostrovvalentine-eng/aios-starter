import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

test("doctor validates the starter", () => {
  const result = spawnSync(process.execPath, ["scripts/aios-doctor.mjs", "--no-write"], { cwd: root, encoding: "utf8" });
  assert.equal(result.status, 0, result.stdout + result.stderr);
});

test("every runtime shim imports the one contract", () => {
  for (const shim of ["CLAUDE.md", "GEMINI.md"]) {
    assert.equal(fs.readFileSync(path.join(root, shim), "utf8").trim(), "@AGENTS.md", shim);
  }
});

test("capture fallbacks are explicit", () => {
  const agents = fs.readFileSync(path.join(root, "AGENTS.md"), "utf8");
  assert.match(agents, /inbox\/tasks\.md/);
  assert.match(agents, /inbox\/events\.md/);
  assert.match(agents, /Ordinary conversation is not durable memory/);
});

test("skills are manual-only and have adapters", () => {
  const skills = fs.readdirSync(path.join(root, "skills"), { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);
  const policy = JSON.parse(fs.readFileSync(path.join(root, "skills/policy.json"), "utf8"));
  assert.ok(policy.adapters.includes(".agents/skills"), "universal .agents/skills adapter is required");
  assert.ok(policy.adapters.includes(".claude/skills"), "Claude adapter is required");
  for (const skill of skills) {
    const yaml = fs.readFileSync(path.join(root, "skills", skill, "agents/openai.yaml"), "utf8");
    assert.match(yaml, /allow_implicit_invocation:\s*false/);
    for (const base of policy.adapters) {
      const adapter = path.join(root, base, skill);
      assert.equal(fs.lstatSync(adapter).isSymbolicLink(), true);
      assert.equal(fs.readlinkSync(adapter), path.relative(path.join(root, base), path.join(root, "skills", skill)));
    }
  }
});

test("template contains no personal absolute home path or secret", () => {
  const result = spawnSync(process.execPath, ["scripts/aios-portability-scan.mjs"], { cwd: root, encoding: "utf8" });
  assert.equal(result.status, 0, result.stdout + result.stderr);
});

// A release gate that cannot fail is worse than no gate: the previous version of
// this test silently passed on any machine without ripgrep installed, which is
// exactly the machine a new user has. The scanner must be able to catch a leak.
test("portability scan detects a planted home path", () => {
  const planted = path.join(root, "selftest-leak.tmp");
  fs.writeFileSync(planted, "root = " + String.fromCharCode(47) + "Users/realperson/secret\n", "utf8");
  try {
    const result = spawnSync(process.execPath, ["scripts/aios-portability-scan.mjs"], { cwd: root, encoding: "utf8" });
    assert.equal(result.status, 1, "scanner failed to flag a planted absolute home path");
    assert.match(result.stdout, /selftest-leak\.tmp/);
  } finally {
    fs.unlinkSync(planted);
  }
});
