# AIOS Structure
*Last updated: 2026-08-04*

Use three layers:

```text
AGENTS.md -> area router -> content file
```

Routers select sources; content files contain substance. Do not mix them.

## New project

1. Create `projects/{slug}/README.md` from `templates/project/README.md`.
2. Add `context.md` only for strategy, history, positioning, or durable constraints.
3. Add aliases, routes, and optional `dev` path to `projects/registry.json`.
4. Add the project to the business router or `context/about-business.md`.
5. Create `dev/{slug}` as a separate Git repository only when code, data, or execution artifacts justify it.

## New person

Create `context/team/{slug}.md` only for a recurring participant or project role. Add aliases and project links to `context/team/overview.md`; link back from the project.

## New connection

Update `connections.md`, document the source-of-truth boundary and least-privilege auth, verify read-only access, then migrate any local fallback. Keep secrets outside Git.

## New skill

Author only under `skills/{name}/`. Include `SKILL.md`, `agents/openai.yaml`, and only essential resources. Keep personal skills manual-only. Run `scripts/sync-skills.sh` and the doctor.

## Avoid

Do not create `misc`, duplicate task lists, second instruction hierarchies, giant routers, or folders for one tiny note. Prefer updating a canonical page over creating a parallel one.
