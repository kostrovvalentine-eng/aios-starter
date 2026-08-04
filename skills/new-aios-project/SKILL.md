---
name: new-aios-project
description: Create or register a new AIOS project with aliases, routed current-state memory, optional deep context, and a separate execution repository only when needed. Use only when the user explicitly invokes `$new-aios-project`, asks to run the new AIOS project workflow by name, or continues an active project-creation run.
---

# New AIOS Project

Create the smallest complete project structure and prevent duplicate projects or mixed memory/code repositories.

## Workflow

1. Read `AGENTS.md`, `references/aios-structure.md`, `projects/registry.json`, and `context/about-business.md`.
2. Search aliases and existing project folders. Update an existing project when the outcome already belongs there.
3. Resolve the project name, slug, one-line purpose, owner, status, goal, and next concrete outcome. Ask only for missing information that materially changes the structure.
4. Create `projects/{slug}/README.md` from the template.
5. Create `projects/{slug}/context.md` only when strategy, history, positioning, constraints, or multiple stakeholders require it.
6. Add aliases, routes, and optional dev path to `projects/registry.json`.
7. Add the project to `context/about-business.md` and create bidirectional people links when applicable.
8. Create `dev/{slug}` as a separate Git repository only when the project needs code, datasets, generated artifacts, or execution plans. Add a local `AGENTS.md` and thin `CLAUDE.md`; do not copy personal root context into it.
9. Run `node scripts/aios-doctor.mjs --write-index` and `npm test`.
10. Show exact changed paths and create a scoped local commit. Do not push or create a remote repository unless the user explicitly asks.
