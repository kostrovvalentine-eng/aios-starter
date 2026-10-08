# AIOS Starter

**Русскоязычный пошаговый гайд: [docs/ru/START-HERE.md](docs/ru/START-HERE.md).** Начни с него, если тебе удобнее по-русски.

AIOS is a personal operating system for an AI agent. It is a folder of plain Markdown files plus a few small scripts, and it solves one problem: an AI assistant forgets everything between sessions, guesses facts about you, and loses decisions in chat history.

Instead of hoping the model remembers, AIOS gives it a place to read. Who you are, what you sell, what matters this quarter, what was decided last week, where each kind of information belongs, and what it is not allowed to do without asking. The agent reads the smallest relevant file each time instead of guessing.

It is not a chatbot, not a SaaS account, and not a database. It is your own private Git repository that you own and control.

## What you get

- **Durable context** in `context/` — identity, business, priorities, guardrails. Written once, read on demand.
- **Project memory** in `projects/` — current state in `README.md`, durable depth in `context.md`.
- **A decision log** in `decisions/log.md` — final choices with reasoning, so nothing gets re-litigated.
- **Safe local inboxes** in `inbox/` — tasks and events are captured from day one, before any service is connected.
- **Reusable workflows** in `skills/` — three skills ship with the kit, manual-only by design. Anything a capable model can do from the protocols alone (like creating a project) is deliberately not a skill.
- **A router** in `references/router-protocol.md` — how the agent finds the right file without loading everything.
- **A health check** in `scripts/aios-doctor.mjs` — deterministic validation of structure, routing, and freshness.
- **Git-backed history** — every meaningful change is a commit you can read, diff, and revert.

No external service or API key is needed on day one. You only need the agent app itself (for example a ChatGPT Plus plan for Codex).

## Requirements

| Need | Why | Check |
|---|---|---|
| Node.js 20 or newer | runs the setup, doctor, and tests | `node --version` |
| Git | version history and the initial commit | `git --version` |
| An agent that can read local files: Codex in the ChatGPT desktop app (Plus or higher), Claude Desktop (Code tab, paid plan), Cursor, Gemini CLI, Copilot | reads this repository | open it once and sign in |
| A GitHub account (optional on day one) | "Use this template" creates your private copy; backup later | — |

## Install in five minutes

**Never used a terminal?** Skip this section. Create an empty folder, add it as a local project in Codex (ChatGPT desktop app) or open it in Claude Desktop's Code tab, and paste the install message from the [Russian guide](docs/ru/START-HERE.md#5-шаги). The agent clones and bootstraps for you; you only approve its requests.

1. Click **Use this template** → **Create a new repository** on GitHub. Make it **private**. Name it anything, for example `my-aios`.

2. Clone it and run the setup:

   ```bash
   git clone https://github.com/YOUR-NAME/my-aios.git
   cd my-aios
   node scripts/bootstrap.mjs
   ```

   Expected output ends with `AIOS bootstrap complete.` It also prints one warning, `onboarding is not complete`, which is correct at this stage. The working tree stays clean.

3. Start a new chat or session on the cloned folder (not its parent): a local project in Codex, or the Code tab in Claude Desktop.

4. Send this first message:

   ```text
   $onboard-aios Let's set up my system.
   ```

   In Claude use `/onboard-aios` instead. Add "talk to me in <your language>" if you prefer another language.

5. Answer seven questions. The agent saves each answer immediately to `aios-intake.md`, so you can stop and resume.

6. Setup ends with validation, a local Git commit, and a suggestion for your first real question. Nothing is pushed anywhere without you asking.

## The seven onboarding questions

You do not need to prepare anything, but answers get much better if you think about them first. Full explanation in the [Russian guide](docs/ru/START-HERE.md#6-что-спросит-система).

1. **Identity and business** — your role, the offer, the customer, the current stage.
2. **Priorities for the next 90 days** — two or three outcomes with a number, date, or deliverable.
3. **Active projects and people** — what is running, who is involved, who owns what.
4. **Current tools and sources of truth** — where tasks, calendar, messages, documents, email, and reporting actually live today.
5. **Real writing samples** — paste one or two things you already wrote. Do not retype them during the interview; that contaminates your voice profile.
6. **Repeated work and biggest operating pain** — the task that eats your week.
7. **Safety and approval boundaries** — what the agent may do alone, what it may only draft, what is off-limits.

## After day one

| When | What |
|---|---|
| Day 1 | Ask: *"What should I focus on this week, and why?"* The answer uses only your new context files. |
| Day 2 | Pick **one** service from `connections.md` and connect it. Read-only first. Mark it `connected` only after a read-only check succeeds. |
| Day 7 | Run `audit-aios` to score context, connections, capabilities, and cadence. |

Until a task system and a calendar are verified working, `inbox/tasks.md` and `inbox/events.md` stay the canonical sources. That is intentional: you never lose a task waiting for an integration.

## How it works

```text
AGENTS.md              the operating contract: authority, routing, capture rules
  -> router            references/router-protocol.md
  -> exact file        context/, projects/, connections.md, references/
  -> live source       only when current external state is required
  -> action
  -> durable update    smallest sufficient write + scoped Git commit
```

One fact has exactly one canonical home. Routers point at it instead of copying it. Ordinary conversation is not saved; only durable facts, decisions, tasks, events, people, connections, and explicit session wraps.

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

## Core commands

Invoke with `/name` in Claude and `$name` in Codex.

- `onboard-aios` — first-run interview and foundation scaffold.
- `wrap-aios` — save durable session state and create scoped local commits.
- `audit-aios` — inspect context, connections, capabilities, cadence, and backup health.

Verification, all dependency-free beyond Node.js and Git:

```bash
node scripts/aios-doctor.mjs --no-write    # structure, routing, freshness
npm test                                   # doctor, portability, skill adapters
node scripts/aios-portability-scan.mjs     # personal paths, identifiers, secrets
```

## Design rules

- Files store durable meaning. Live systems store live records.
- One fact has one canonical home; links point to it instead of duplicating it.
- Context is loaded on demand through routers.
- External writes require explicit user intent.
- Secrets stay in an OS keychain or process environment, never Markdown or Git.
- Automate only after the manual workflow works reliably.
- Git push is never automatic.

## Troubleshooting

**`node scripts/bootstrap.mjs` says Node.js 20 or newer is required.**
Install a current Node.js release, then reopen the terminal and check `node --version`.

**`npm test` fails on skill adapters.**
Run `bash scripts/sync-skills.sh` and try again. It repairs only the wrong or missing skill symlinks in the folders listed under `adapters` in `skills/policy.json`.

**Codex asks to approve a command.**
Expected for downloads, Git commits, and changes in `.git/`, `.agents/`, or `.codex/`: its default sandbox keeps those read-only. Approve once. A fresh clone's bootstrap needs no approval because it writes nothing there.

**The agent does not see `onboard-aios`.**
Skills and rules are loaded from the repository root when a chat or session starts. Open the cloned folder itself, not its parent, run the bootstrap, then start a new chat. In Codex, make sure the project is local, not cloud.

**The agent asks something you already answered.**
It reads `aios-intake.md` to resume. Edit that file directly and ask it to continue onboarding.

**You want to start over.**
Ask the agent to restore the template versions of `aios-intake.md`, `context/`, `references/voice.md`, and `projects/registry.json` from the first commit and set `context/system-state.md` back to `Status: fresh`, then run `onboard-aios` again. Your Git history still has everything.

## Attribution

This project is a runtime-neutral (Claude and Codex) evolution of [Nate Herk's AIS-OS starter kit](https://github.com/nateherkai/AIS-OS). The original kit introduced the onboarding, audit, and incremental AIOS-building pattern. See `LICENSE`.
