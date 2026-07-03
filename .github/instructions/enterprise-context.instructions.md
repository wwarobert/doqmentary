---
description: Injects the applicable enterprise principles and decisions when authoring or reviewing doqmentary solution outlines.
applyTo: "documents/**/*.md"
---

# Enterprise context injection

When authoring or reviewing any document under `documents/`, treat the enterprise
libraries as authoritative judgment guides:

- **Principles** live in [`enterprise/principles/`](../../enterprise/principles/) — one
  file per principle, each with a stable `id` (e.g. `PRIN-001`).
- **Decisions** (ADRs) live in [`enterprise/decisions/`](../../enterprise/decisions/) —
  one file per decision, each with a stable `id` (e.g. `ADR-001`).

Read the relevant entries directly from those folders; do not rely on copies pasted
into the document. The libraries are the single source of truth.

## How sections bound to a library select entries

A section (or summary block) is *bound to a library* when its config declares
`source: principles` or `source: decisions`. For every bound section:

1. **Select only relevant entries.** Read the library index (`README.md`) and the
   individual entries. Include an entry only when it genuinely applies to this
   solution. Do not dump the whole library.
2. **Reference entries by their stable id** so the link is precise and checkable
   (e.g. "Applies `PRIN-002` (Secure by default)").
3. **Record how each entry applies.** For a principle, state what it forces or forbids
   in *this* solution. For a decision, state its impact on *this* solution.
4. **Flag conflicts.** If the solution appears to violate an active principle or an
   accepted decision, surface it explicitly rather than silently omitting the entry —
   the Enterprise Architect persona will check for this.

## During review

The Enterprise Architect persona verifies that:

- every referenced `PRIN-*` / `ADR-*` id exists and is `active`/`accepted`,
- no applicable principle or decision was omitted, and
- each referenced entry includes an application/impact note.
