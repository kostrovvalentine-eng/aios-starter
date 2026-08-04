# AIOS Starter

A portable, Codex-first personal AI operating system. It gives an AI agent durable context, explicit sources of truth, safe capture rules, reusable workflows, and Git-backed history without shipping anyone else's personal data.

This starter is designed for one person. Create a **private** repository for the personalized copy.

## Install in five minutes

1. Click **Use this template** on GitHub and create a private repository.
2. Clone your new repository:

   ```bash
   git clone https://github.com/YOUR-NAME/YOUR-AIOS.git
   cd YOUR-AIOS
   node scripts/bootstrap.mjs
   ```

3. Open the cloned folder in Codex.
4. Send this exact first message:

   ```text
   Use $onboard-aios to explain this system and set it up with me.
   ```

5. Answer seven short questions. The agent saves each answer immediately, builds the initial context and projects, validates the result, and creates a local setup commit. It never pushes without explicit permission.

Node.js 20+ and Git are required. No external service or credential is required for Day 1.

## What saves where

| Information | Source of truth |
|---|---|
| Identity, preferences, guardrails | `context/` |
| Current priorities | `context/priorities.md` |
| Project state and strategy | `projects/{slug}/` |
| Final decisions | `decisions/log.md` |
| Tasks before a task app is connected | `inbox/tasks.md` |
| Meetings before a calendar is connected | `inbox/events.md` |
| Connected systems and ownership | `connections.md` |
| Unprocessed source material | `raw/` |
| Reusable workflows | `skills/` |
| Code, datasets, and execution artifacts | separate repositories under `dev/` |

Ordinary conversation is not copied into memory. Only durable facts, decisions, state changes, tasks, events, people, connections, and explicit session wraps are captured.

## Core commands

- `$onboard-aios` — first-run interview and foundation scaffold.
- `$new-aios-project` — create routed project memory and an optional execution repo.
- `$wrap-aios` — save durable session state and create scoped local commits.
- `$audit-aios` — inspect context, connections, capabilities, cadence, and backup health.
- `node scripts/aios-doctor.mjs --no-write` — deterministic health check.

## Design rules

- Files store durable meaning. Live systems store live records.
- One fact has one canonical home; links point to it instead of duplicating it.
- Context is loaded on demand through routers.
- External writes require explicit user intent.
- Secrets stay in Keychain or process environment, never Markdown or Git.
- Automate only after the manual workflow works reliably.
- Git push is never automatic.

## Attribution

This project is a Codex-first evolution of [Nate Herk's AIS-OS starter kit](https://github.com/nateherkai/AIS-OS). The original kit introduced the onboarding, audit, and incremental AIOS-building pattern. See `LICENSE`.
