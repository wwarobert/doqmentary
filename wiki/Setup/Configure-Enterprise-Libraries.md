# Configure Enterprise Libraries

Enterprise libraries contain your organisation's principles and prior decisions
(ADRs). The author skill selects relevant entries for each document automatically.

## Understanding the naming convention

The repo ships with **example** entries using the `*.example.md` suffix:

```
enterprise/principles/PRIN-001.example.md    ← committed example
enterprise/decisions/ADR-001.example.md      ← committed example
```

Your real, organisation-specific entries use the plain `<ID>.md` form:

```
enterprise/principles/PRIN-001.md            ← git-ignored (private)
enterprise/decisions/ADR-001.md              ← git-ignored (private)
```

The `.gitignore` excludes plain `*.md` files while keeping `*.example.md` and
`README.md`. Both forms match the `*.md` glob the CLI and author skill read, so
examples and real entries are treated identically at runtime.

## Adding a principle

1. Copy the example as a starting point:
   ```bash
   cp enterprise/principles/PRIN-001.example.md enterprise/principles/PRIN-002.md
   ```

2. Open the new file and update the front matter and body:
   ```markdown
   ---
   id: PRIN-002
   title: Your principle title
   status: active
   tags: [relevant, tags]
   ---

   **Statement.** One normative sentence.

   **Rationale.** Why the principle exists.

   **Implications.** What it forces or forbids in a solution.
   ```

3. Update `enterprise/principles/README.md` to add the new entry to the index table.

4. The file is automatically picked up by the author skill on the next authoring session.
   You do not need to register or reference it anywhere else.

## Adding a decision (ADR)

1. Copy the example:
   ```bash
   cp enterprise/decisions/ADR-001.example.md enterprise/decisions/ADR-002.md
   ```

2. Update front matter and body:
   ```markdown
   ---
   id: ADR-002
   title: Your decision title
   status: accepted
   date: 2026-01-20
   tags: [relevant, tags]
   ---

   ## Context
   The forces that led to this decision.

   ## Decision
   What was decided.

   ## Consequences
   What changes as a result.
   ```

3. Update `enterprise/decisions/README.md` to add the entry to the index table.

## ID numbering

Use sequential IDs (`PRIN-001`, `PRIN-002`, …; `ADR-001`, `ADR-002`, …). IDs are
**stable and never reused** — if an entry is deprecated, mark it `status: deprecated`
rather than deleting or renumbering it.

## Deprecating an entry

Set `status: deprecated` in the front matter. The entry remains readable but the
author skill will note it as deprecated and avoid applying it to new documents.

## Keeping entries private

Real entries (`*.md`) are git-ignored. To share them with your team:
- Commit them to a **private** fork of this repository, or
- Store them in a separate private repo and mount/copy them into `enterprise/` as
  part of your local setup

---

Next: [Setup/Configure-Sections-and-Personas](Setup/Configure-Sections-and-Personas)
