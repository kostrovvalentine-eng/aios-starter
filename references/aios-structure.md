# AIOS Structure
*Last updated: 2026-10-08*

Use three layers:

```text
AGENTS.md -> area router -> content file
```

Routers select sources; content files contain substance. Do not mix them.

## New project

Follow this when the user asks in plain words to start or register a project. There is no separate skill for it.

0. Search `projects/registry.json` aliases and existing folders first. If the outcome already belongs to a project, update that one instead.
1. Create `projects/{slug}/README.md` from `templates/project/README.md`.
2. Add `context.md` only for strategy, history, positioning, or durable constraints.
3. Add aliases, routes, and optional `dev` path to `projects/registry.json`.
4. Add the project to the business router or `context/about-business.md`.
5. Create `dev/{slug}` as a separate Git repository only when code, data, or execution artifacts justify it. Give it a local `AGENTS.md` plus `CLAUDE.md` and `GEMINI.md` shims containing `@AGENTS.md`; never copy personal root context into it.
6. Run `node scripts/aios-doctor.mjs --write-index` and `npm test`, show the exact changed paths, and make a scoped local commit.

## New person

Create `context/team/{slug}.md` only for a recurring participant or project role. Add aliases and project links to `context/team/overview.md`; link back from the project.

## New connection

Update `connections.md`, document the source-of-truth boundary and least-privilege auth, verify read-only access, then migrate any local fallback. Keep secrets outside Git.

## New skill

Author only under `skills/{name}/`. Include `SKILL.md`, `agents/openai.yaml`, and only essential resources. Keep personal skills manual-only. Run `scripts/sync-skills.sh` and the doctor.

A skill earns its place only if it carries something a capable model cannot infer from this repository: a fixed interview, an exact file contract, a scoring rubric, or a safety sequence. If a protocol in `references/` already describes the procedure, do not wrap it in a skill; point to the protocol. Re-check every skill after a model upgrade and delete the ones that no longer change the result.

## Runtimes

`AGENTS.md` is the only contract. `CLAUDE.md` and `GEMINI.md` are one-line `@AGENTS.md` shims; Codex, Cursor, Copilot, OpenCode and most other harnesses read `AGENTS.md` directly. Skill discovery folders are listed in `skills/policy.json` under `adapters`: `.agents/skills` is the shared layout read by Codex, Cursor, Gemini CLI, Copilot and OpenCode, and `.claude/skills` is Claude's. To support another harness, add its folder there and run `scripts/sync-skills.sh`; never copy a skill.

## Avoid

Do not create `misc`, duplicate task lists, second instruction hierarchies, giant routers, or folders for one tiny note. Prefer updating a canonical page over creating a parallel one.
