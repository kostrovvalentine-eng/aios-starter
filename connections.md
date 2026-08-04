# Connections
*Last updated: 2026-08-04*

This file selects the canonical live source for each domain. Naming an app does not make it connected; mark it `connected` only after a read-only verification.

| Domain | Canonical source | Mechanism | Status | Last verified |
|---|---|---|---|---|
| Tasks | `inbox/tasks.md` | local fallback | active | 2026-08-04 |
| Calendar | `inbox/events.md` | local fallback | active | 2026-08-04 |
| Messages | Not selected | not connected | pending | — |
| Documents | This Git repository | local files | active | 2026-08-04 |
| Email | Not selected | not connected | pending | — |
| Revenue / reporting | Not selected | not connected | pending | — |

When connecting a service, document its owner, read/write scope, authentication mechanism, verification date, and exact source-of-truth boundary. Never store a secret value here.
