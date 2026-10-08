# Context Update Protocol
*Last updated: 2026-08-04*

Save the minimum sufficient durable state, not a transcript.

| Information | Destination |
|---|---|
| Personal fact or durable preference | `context/about-me.md` |
| Business model and stable operating context | `context/about-business.md` |
| Priority shift | `context/priorities.md` |
| Project current state and next outcome | `projects/{slug}/README.md` |
| Project strategy, history, constraints | `projects/{slug}/context.md` |
| Final decision | `decisions/log.md` |
| Recurring teammate or collaborator | `context/team/{slug}.md` |
| Tool and source-of-truth boundary | `connections.md` |
| Code, data, plans, generated artifacts | separate `dev/{slug}` repo |

Context files change only with explicit user intent or an explicit wrap-aios run. Update the line-2 date, preserve links, and state uncertainty instead of inventing facts.
