# Auto-Capture Protocol
*Last updated: 2026-08-04*

Use this protocol only when the conversation creates or changes durable state.

## Tasks

Trigger on a concrete action with an owner or clear output. Search the canonical task source for a semantic duplicate first. Use the connected task service only after verification; otherwise update `inbox/tasks.md`. Report where the task was saved.

## Events

Trigger on a meeting or event with a date or resolvable time. Use the verified calendar if connected; otherwise add it to `inbox/events.md` as `needs-sync` and report that limitation.

## Decisions

Append clear final choices to `decisions/log.md` immediately with reasoning, context, and links. Never include secrets.

## Priorities, people, connections, and projects

Update their canonical files only when the change is explicit. Follow `references/context-update.md` and `references/aios-structure.md`.

## Session end

On `$wrap-aios`, capture only durable meaning, run the doctor, show exact files, and create scoped local commits. Never push automatically.
