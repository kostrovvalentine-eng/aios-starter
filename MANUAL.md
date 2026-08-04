# AIOS Manual
*Last updated: 2026-08-04*

AIOS is a repository around an AI agent. Files provide durable context and operating rules; connected services provide current records; skills provide repeatable workflows; schedules provide cadence.

## Architecture

```text
AGENTS.md
  -> router
  -> exact context or project file
  -> live source when current state is required
  -> action
  -> durable update and scoped Git history
```

The model does not magically remember everything. It reads the smallest relevant source each time. This keeps answers accurate and prevents unrelated personal context from leaking between topics.

## Daily use

- Ask normal questions from the repository root.
- State the project and desired outcome.
- Use `$new-aios-project` when work becomes a distinct project.
- Put source material in `raw/` and ask the agent to ingest it.
- Use `$wrap-aios` after a meaningful work session.
- Use `$audit-aios` periodically to find structural and backup gaps.

## What is intentionally not automatic

- Ordinary conversation is not copied into memory.
- A named but unverified app is not marked connected.
- External writes do not happen without intent.
- Git push does not happen during wrap.
- Background automation is not added until the manual workflow is proven.

## Growth rule

Add one canonical home, one route, and one validation rule for each new area. Avoid `misc`, duplicate notes, giant root instructions, and parallel task lists.
