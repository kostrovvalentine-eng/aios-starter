# Auto-Capture Protocol
*Last updated: 2026-10-08*

Use this protocol only when the conversation creates or changes durable state.

## Tasks

Capture a definite future action with an owner or clear output when the owner asks to record it ("запиши задачу", "не забыть", "add a task") or makes a clear commitment. Discussion ("maybe we should"), the agent's own suggested next step, and a request to do work right now are not new tasks.

1. Search the canonical task source for the same outcome, open or done.
2. Update the open item, or reopen a done one when the work genuinely returned. Never create a second item for the same outcome.
3. Otherwise add it to the verified task service, or to `inbox/tasks.md` until one is verified.
4. Say in one line where it was saved and continue.

When the owner says an item is done, cancelled, or changed, find it by meaning and update it. Do not add a replacement.

## Events

Create an event only when the owner asks to schedule or book it and the time is usable. Mentioning a possible call is not a scheduling request. Use the verified calendar if connected; otherwise add it to `inbox/events.md` labelled `needs-sync` and say so. Resolve attendees through the team router; never invite an ambiguous identity. Report what was actually created and whether an invitation went out.

## Decisions

For a clear final choice ("решили", "окончательно", "берём", "не делаем X", "we decided"):

1. Search `decisions/log.md` for the same decision or one it supersedes. Do not append duplicates.
2. Append in this format:

```text
[YYYY-MM-DD] DECISION: ... | REASONING: ... | CONTEXT: ... | LINKS: [[project]], [[person]]
```

The log is append-only. Never include secrets.

## Priorities

Update `context/priorities.md` only when the owner clearly decides to change what matters most. An agent recommendation, a finished task, or a hypothetical tradeoff is not a priority shift.

## People

- A recurring collaborator or someone with a project role gets `context/team/{slug}.md` and a row in `context/team/overview.md`.
- One-off names do not get pages.
- Once an identity is confirmed (handle, email, which "Anna"), record it on the person page so the lookup is not repeated.

## Context

Do not rewrite `context/about-me.md` or `context/about-business.md` from ordinary discussion. Accepted project facts, current state, and the handoff for unfinished work may be saved during the task. Before any memory write read `references/context-update.md`; before adding a project, person, or tool read `references/aios-structure.md`.

## Session end

On an explicit wrap-aios run or "сохрани контекст", save only new durable meaning and the minimum handoff to resume unfinished work. "Спасибо", "готово", or a farewell alone is not a wrap. Never push automatically.
