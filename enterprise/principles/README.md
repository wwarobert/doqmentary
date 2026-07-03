# Enterprise principles library

Stable, global enterprise principles used as judgment guides during authoring and
review. Each principle is an **individually addressable** entry: one markdown file
with a stable `id` in its front matter, so a document can reference it precisely
(e.g. "applies `PRIN-001`").

## Storage format

One file per principle: `enterprise/principles/<ID>.md`.

> **Examples vs. company content.** Shipped example principles use the
> `<ID>.example.md` suffix and are committed (they remain active context and serve
> as test fixtures). Your real, company-specific principles are plain `<ID>.md`
> files and are **git-ignored** so they stay private. Both match the `*.md` glob the
> CLI and instructions read.

```markdown
---
id: PRIN-001            # stable identifier, never reused
title: Short name
status: active          # active | deprecated
tags: [security, data]  # optional, for selection
---

**Statement.** One-sentence normative rule.

**Rationale.** Why the principle exists.

**Implications.** What it forces or forbids in a solution.
```

## Selection and application

The author skill's **Project principles** block selects only the principles
*relevant* to the solution and, for each, records **how it applies** to this
document (see the top-level [author skill](../../.github/skills/author-solution-outline/SKILL.md)).
The Enterprise Architect persona checks both relevance and application notes.

## Index

| ID | Title | Status |
|---|---|---|
| [PRIN-001](PRIN-001.example.md) | Prefer managed services over self-hosted | active |
| [PRIN-002](PRIN-002.example.md) | Secure by default | active |
| [PRIN-003](PRIN-003.example.md) | Data residency stays in-region | active |
