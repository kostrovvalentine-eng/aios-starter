# Context Update Protocol
*Last updated: 2026-10-08*

Save the minimum sufficient durable state, not a transcript.

## Process

1. **Identify** the new durable fact, decision, correction, or handoff and its exact canonical file.
2. **Resolve intent.** An explicit request to update, fix, remember, save context, or wrap already authorizes the relevant local edits; do not ask again. Ordinary discussion does not authorize profile or project rewrites.
3. **Read and deduplicate.** Read the target and search for an existing statement. Update current state once. Keep a proposed idea separate from an accepted decision.
4. **Write the minimum.** Keep an as-of date for facts that can change. A clear owner correction supersedes older memory. Ask only when an unresolved identity or contradiction would change the saved fact.
5. **Confirm** in one line what changed and where. If nothing durable changed, write nothing.

Saving memory is independent of Git. A commit or publication needs its own explicit request, except the scoped local commits the wrap and onboarding skills define.

## Where information goes

| Information | Destination |
|---|---|
| Personal fact or durable preference | `context/about-me.md` |
| Business model and stable operating context | `context/about-business.md` |
| Priority shift | `context/priorities.md` |
| Project current state, blockers, next step | `projects/{slug}/README.md` |
| Project strategy, history, pricing, constraints | `projects/{slug}/context.md` |
| Final decision | `decisions/log.md` (append only) |
| Recurring teammate or collaborator | `context/team/{slug}.md` |
| Tool and source-of-truth boundary | `connections.md` |
| Unprocessed source material | `raw/` |
| Code, data, plans, generated artifacts | separate `dev/{slug}` repo |

README holds current state only and stays short. `context.md` holds depth. Unsure? Ask: does someone need this to understand the project, or just to know where it stands?

## Dates and staleness

Every context file has `*Last updated: YYYY-MM-DD*` on line 2. Change it when the content changes or its facts were actually rechecked. Never refresh a date just to silence a stale warning.

| File | Review after |
|---|---|
| `context/priorities.md` | 30 days |
| `projects/*/README.md` | 14 days |
| `projects/*/context.md` | 30 days |
| `context/about-me.md`, `context/team/*.md` | 90 days |

These are review signals, not proof a fact is wrong. A full staleness pass belongs to an explicit audit.

## Links

When a file mentions a person or project that has a page, link it with `[[slug]]`. `context/priorities.md` links every project and person it mentions. Do not relink history in `decisions/` or `log.md`.
