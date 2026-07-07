# Enterprise Libraries

Enterprise libraries are the stable, addressable knowledge assets that feed the
fixed layer of every solution outline. They live in `enterprise/` and contain two
kinds of entries: **principles** and **decisions** (ADRs).

## Why they exist

Solution outlines have a stable layer (~80% of the content) that restates the same
enterprise principles and prior decisions across every document. Without a library,
each author re-words these from memory, introducing inconsistency and omissions.

With a library, the author skill selects the entries that apply to a given solution
and records precisely how each one applies — rather than re-inventing them. The
Enterprise Architect persona then checks that the selection is complete and that
application notes are accurate.

## Principles (`enterprise/principles/`)

A principle is a normative rule that applies across solutions.

```markdown
---
id: PRIN-001            # stable identifier, never reused
title: Prefer managed services over self-hosted
status: active          # active | deprecated
tags: [platform]
---

**Statement.** Prefer managed cloud services over self-hosted equivalents unless
there is a documented reason.

**Rationale.** Managed services reduce operational burden and provide SLA-backed
availability.

**Implications.** Any self-hosted component must be justified in the solution's
Key design decisions section.
```

## Decisions (`enterprise/decisions/`)

A decision is an Architecture Decision Record (ADR) — a resolved choice that
subsequent solutions must honour.

```markdown
---
id: ADR-001
title: Use the central identity provider for all workload identities
status: accepted
date: 2026-01-15
tags: [identity, security]
---

## Context
...

## Decision
...

## Consequences
...
```

## Examples vs. company content

The shipped repo contains **example** entries (`*.example.md`) committed to the
repository. These serve as templates and test fixtures. Your real, company-specific
entries are plain `<ID>.md` files and are **git-ignored** so they remain private.
Both match the `*.md` glob that the CLI and the author skill read.

```
enterprise/principles/
  README.md                   ← committed, the index
  PRIN-001.example.md         ← committed example (active fixture)
  PRIN-001.md                 ← YOUR real principle (git-ignored)
```

See [Setup/Configure-Enterprise-Libraries](Setup/Configure-Enterprise-Libraries) for
step-by-step instructions on adding your own entries.

## How the author skill uses libraries

1. Reads all `*.md` files in `enterprise/principles/` and `enterprise/decisions/`
2. Selects those relevant to the current solution (judgment call)
3. For each selected entry, records how it applies to this specific solution
4. The Enterprise Architect persona checks relevance and completeness

No manual wiring is needed — selection is driven by the skill's judgment, guided by
the principle and decision content.
