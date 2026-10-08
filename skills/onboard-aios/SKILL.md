---
name: onboard-aios
description: Set up a fresh or intentionally reset AIOS through a resumable seven-question interview, then generate routed personal context, projects, sources of truth, guardrails, and a validated local Git checkpoint. Use only when the user explicitly invokes `/onboard-aios` (Claude) or `$onboard-aios` (Codex), asks to run AIOS onboarding by name, or continues an active onboarding run.
---

# Onboard AIOS

Turn the neutral starter into the user's private operating system without guessing facts, marking unverified services connected, or storing secrets.

## Prepare

1. Read `AGENTS.md`, `aios-intake.md`, `context/system-state.md`, `connections.md`, and the three structure/capture protocols under `references/`.
2. Check that `git config user.name` and `git config user.email` are set. If either is missing, ask the user for the name and email they want on their saved versions and set them for this repository only (`git config user.name ...` without `--global`). Never invent an email. In a sandboxed runtime such as Codex, writing `.git` needs the user's approval: say in one sentence that this only labels saved versions on their computer.
3. Record the initial `git status --short`; never include pre-existing unrelated changes in the setup commit.
4. If onboarding is already active, summarize existing answers and resume from the first unanswered question. Do not overwrite completed context unless the user explicitly requests a reset.
5. Explain in four short points, in plain words for someone who has never used a terminal or Git:
   - AIOS stores durable meaning, not every chat message.
   - Files hold context; connected services hold live records.
   - Local task and event inboxes prevent data loss before connections exist.
   - Each answer is saved immediately and setup ends with validation plus a local Git checkpoint.

## Interview

Run the whole interview in the user's language. Ask exactly one question at a time, with one short example of a good answer. After every answer, replace that question's `[Not answered]` block in `aios-intake.md` before asking the next question.

1. **Identity and business:** role, work, offer, customer, and current stage.
2. **90-day priorities:** two or three concrete outcomes with dates or measurable deliverables.
3. **Projects and people:** active projects, aliases, status, collaborators, and ownership.
4. **Sources of truth:** current tools for tasks, calendar, messages, documents, email, and reporting.
5. **Voice:** request one or two real, pasted writing samples plus communication preferences. Do not manufacture a voice profile from prose written only for this interview.
6. **Operating pain:** repeated work, bottlenecks, and the task a capable assistant should absorb first.
7. **Guardrails:** sensitive data, approval requirements, regulated domains, actions AI may perform, and actions it may only draft.

Push back once on vague priorities or unnamed ownership. Do not add an eighth question. If the user does not know an answer yet, save `[Owner will add later]` and move on; never block on it.

## Scaffold

After all seven answers are saved:

1. Write `context/about-me.md`, `context/about-business.md`, `context/priorities.md`, `context/guardrails.md`, and `references/voice.md` with current line-2 dates.
2. Create one page per recurring teammate and update `context/team/overview.md`. Do not create pages for one-off names.
3. Create initial project folders and `projects/registry.json` entries. Use README for current state and `context.md` only for durable depth.
4. Update `connections.md` with named systems, ownership, and intended boundaries. Mark a service `connected` only after a read-only verification. Until then, keep `inbox/tasks.md` and `inbox/events.md` canonical.
5. Move the onboarding task in `inbox/tasks.md` to Done.
6. Set `aios-intake.md` to `Status: complete` and `context/system-state.md` to `Status: active`.
7. Run `node scripts/bootstrap.mjs`, then `npm test`.

## Save

List only files created or changed by this onboarding run. The commit writes `.git`, so a sandboxed runtime will ask the user to approve it; say so before running it. Run `node scripts/commit-selected.mjs --plan` with `--file` for each exact path, then create the local commit with `--summary "complete initial onboarding"`. Explain the commit in one sentence ("saved a restore point on your computer, nothing was sent anywhere"). Do not push.

Finish with these three lines, translated into the user's language:

```text
✓ Your AIOS now knows who you are, what matters, and where each type of information belongs.
Next: tomorrow, connect one calendar or task app read-only, or keep using the safe local inboxes.
Try: "What should I focus on this week, and why?"
```
