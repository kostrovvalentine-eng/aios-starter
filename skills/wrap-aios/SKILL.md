---
name: wrap-aios
description: Close an AIOS work session by saving only durable meaning to canonical files, preserving execution artifacts in the correct dev repository, validating the system, and creating exact local Git commits without pushing. Use only when the user explicitly invokes `$wrap-aios`, asks to run AIOS wrap by name, or continues an active wrap.
---

# Wrap AIOS

Create a recoverable checkpoint without turning the conversation into a transcript or sweeping unrelated dirty files into a commit.

## Select durable state

1. Read `references/context-update.md`, `references/auto-capture.md`, and relevant project memory.
2. Extract only new decisions, current state, next outcome, blockers, priority changes, durable constraints, people changes, and source links.
3. Keep code, datasets, drafts, generated artifacts, and execution plans in the active `dev/{slug}` repository.
4. Do not update personal context merely because it appeared in casual conversation.

## Update

1. Write each item to its single canonical home and update line-2 dates.
2. Maintain registry entries and bidirectional links.
3. Append decisions instead of rewriting history.
4. Regenerate the index only when the file map changed.

## Validate and commit

1. Run `node scripts/aios-doctor.mjs --no-write`, `npm test`, and `git diff --check` in every touched repository.
2. Compare current changes with the session's work. Leave pre-existing or ambiguous changes untouched.
3. Run `node scripts/commit-selected.mjs --plan --summary "..." --file <path>...` for the exact root files and show the plan.
4. Commit selected root files locally. Commit execution files separately in their dev repository.
5. Never push unless the user explicitly asks in the current request.

Report commit hashes, files intentionally left dirty, warnings, and one next action.
