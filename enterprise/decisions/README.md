# Enterprise decisions library (ADRs)

Stable, global architecture decision records (ADRs) used as judgment guides during
authoring and review. Each decision is an **individually addressable** entry: one
markdown file with a stable `id` in its front matter, so a document can reference it
precisely (e.g. "honors `ADR-002`").

## Storage format

One file per decision: `enterprise/decisions/<ID>.md`.

> **Examples vs. company content.** Shipped example decisions use the
> `<ID>.example.md` suffix and are committed (they remain active context and serve
> as test fixtures). Your real, company-specific decisions are plain `<ID>.md` files
> and are **git-ignored** so they stay private. Both match the `*.md` glob the CLI
> and instructions read.

```markdown
---
id: ADR-001              # stable identifier, never reused
title: Short decision name
status: accepted         # proposed | accepted | superseded
date: 2026-01-15
supersedes: []           # optional list of ADR ids this replaces
tags: [platform, data]   # optional, for selection
---

## Context
The forces at play and the problem being decided.

## Decision
The choice that was made, stated as a single clear sentence plus detail.

## Consequences
The results — positive and negative — and what the decision now constrains.
```

## Selection and application

The author skill's **Key design decisions** section references only the decisions
*relevant* to the solution and states each decision's **impact** on the document (see
the top-level [author skill](../../.github/skills/author-solution-outline/SKILL.md)).
The Enterprise Architect persona checks that referenced decisions exist and are
honored.

## Index

| ID | Title | Status |
|---|---|---|
| [ADR-001](ADR-001.example.md) | Standardize on the managed container platform | accepted |
| [ADR-002](ADR-002.example.md) | Centralized identity provider for all workloads | accepted |
