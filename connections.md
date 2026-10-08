# Connections
*Last updated: 2026-10-08*

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

## Status levels

`documented` (named here) < `configured` (tool or connector added) < `authenticated` (signed in) < `connected` (a read-only check returned the right data). Only the last one counts as working.

## Easiest first connection

- **Claude Desktop:** built-in connectors (Google Calendar, Gmail, Google Drive, Notion and others) are switched on in Claude's settings, no keys or code. Start read-only, verify one real read, then update this table.
- **Codex (ChatGPT desktop app):** connect the service through plugins in the app; if there is no plugin, add it as an MCP server in Codex settings. Verify the same way.

Use one canonical source per domain. When a live task or calendar service is verified, migrate the open items from `inbox/` and mark the inbox as no longer canonical.
