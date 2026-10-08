---
name: audit-aios
description: Perform a read-only health audit of an AIOS across context, connections, capabilities, cadence, routing, Git backup, freshness, and source-of-truth discipline. Use only when the user explicitly invokes `/audit-aios` (Claude) or `$audit-aios` (Codex), asks to run the AIOS audit by name, or continues an active audit.
---

# Audit AIOS

Assess whether the system is usable and recoverable, not merely whether many files exist.

## Inspect

1. Run `node scripts/aios-doctor.mjs --no-write` and `npm test`.
2. Read `context/system-state.md`, `connections.md`, `projects/registry.json`, skill metadata, and Git status/remotes.
3. Verify that current tasks and events have one canonical source each.
4. Check that connected services have documented boundaries and recent read-only verification.
5. Check that reusable work is encoded in skills and that personal skills remain manual-only.
6. Check for recurring cadence only after its manual workflow is proven.
7. Check unpushed commits, uncommitted root changes, dirty dev repositories, stale context, and secret/portability warnings.

## Report

Score each layer out of 25:

- **Context:** identity, priorities, projects, decisions, routing, freshness.
- **Connections:** source-of-truth clarity, verified access, least privilege, fallbacks.
- **Capabilities:** reliable skills, tests, artifacts, project execution boundaries.
- **Cadence:** proven recurring triggers, recent successful runs, failure visibility.

Return the total, evidence, top three gaps ranked by impact, and one next action. Stay read-only unless the user separately asks to save the audit.
