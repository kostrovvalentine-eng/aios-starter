# Router Protocol
*Last updated: 2026-10-08*

Use this to resolve an unfamiliar project, source, person, memory change, or cross-area request. For a routine edit in an already-resolved file, the loaded contract is enough; load business context only when its meaning affects the task.

## Resolution flow

1. Follow the nearest `AGENTS.md`, then the root contract.
2. Identify the area and exact topic from the user's words. Do not bulk-load unrelated context.
3. Read the area router, then the selected content file.
4. Resolve project aliases through `projects/registry.json` and `context/about-business.md`.
5. If the target file names secondary sources for this kind of request, read them too before answering.
6. Read `context/priorities.md` only when prioritization matters.
7. Read `connections.md` before using or describing current external state. The documented live source wins over Markdown.

Read the routed source before relying on its facts; reuse unchanged content already read in this task. Do not reload the whole instruction stack before every small edit. Never answer a routed question from memory merely because the topic looks familiar.

## External sources

Do not infer access from the visible tool list.

1. Read `connections.md` for the intended source and its status.
2. Check `.env` only for variable names or presence, never print values.
3. If this runtime has no callable tool for a documented connection, say both facts: the system has it documented, this session cannot reach it. Never report empty results from a failed lookup.

## People before external writes

Before any message, invite, file share, or other external write addressed to a person:

1. Resolve the name through `context/team/overview.md` and read the exact person page.
2. Role, project, and company qualifiers outrank a bare first name and chat memory.
3. Never pick the first search result. If two candidates remain, do not write; ask the owner which person they mean.

## After a routing miss

When the owner corrects an answer because the wrong source was used:

1. Treat the clear correction as authority and fix the specific fact.
2. Add the missing alias, trigger word, or secondary source to the router.
3. Log a decision if the correction changes strategy, pricing, source of truth, or routing.

## Router quality

- Routers hold routing only: aliases, trigger words, target files, source-of-truth notes.
- Content files hold substance.
- Do not leave stale legacy files. Replace them with a redirect note or route away from them.
