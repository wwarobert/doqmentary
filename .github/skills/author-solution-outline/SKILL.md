---
name: author-solution-outline
description: >-
  Author a doqmentary solution outline by iterating the effective configured
  sections in order: auto-populate fixed/library-bound blocks from enterprise
  context, interview the user for situation-specific blocks, ingest pasted deck
  text, emit architecture as Mermaid, and synthesize the Summary last from the
  body with gap reporting. Use when a user wants to draft, continue, or fill a
  solution outline document under `documents/`.
---

# Author a solution outline

You are the **authoring brain** for doqmentary. The CLI (`cli/`) handles file
mechanics; you produce the *content*. Work strictly from the **effective
configuration** for the document — never assume a fixed set of sections.

## 0. Resolve the effective config first

The effective config = global [`doqmentary.yaml`](../../../doqmentary.yaml) deep-merged
with the document's `documents/<solution>/doqmentary.yaml` (document wins). Read it and
build the ordered list of sections and their attributes (`derived`, `layer`, `source`,
`render`, and for derived sections their `blocks`).

> If the document folder does not exist yet, scaffold it first:
> `node cli/bin/doqmentary.mjs new <solution>`. This creates one
> `sections/<id>.md` per configured section.

## 1. Iterate the configured sections in order

Process sections **in configured order**, producing exactly one unit of content per
section and **no others**. For each non-derived section, classify it:

| Section shape | How to fill it |
|---|---|
| `source: principles` / `source: decisions` (library-bound, **fixed**) | Auto-populate — see §2. Do **not** ask the user to write it. |
| `layer: enterprise` boilerplate (**fixed**) | Populate from enterprise context/boilerplate; do not interview. |
| `layer: situation` (**variable**) | Interview the user — see §3. |
| `render: mermaid` | Interview, then emit a Mermaid diagram — see §4. |
| `derived: true` (the Summary) | Skip for now; synthesize **last** — see §6. |

Write each section's content into its `documents/<solution>/sections/<id>.md` body
(keep the front matter).

## 2. Fixed / library-bound blocks (auto-populate)

For a section bound to an enterprise library, follow
[`enterprise-context.instructions.md`](../../instructions/enterprise-context.instructions.md):

- Read the relevant entries directly from
  [`enterprise/principles/`](../../../enterprise/principles/) or
  [`enterprise/decisions/`](../../../enterprise/decisions/).
- **Select only the relevant entries** — do not dump the whole library.
- Reference each by its **stable id** (e.g. `PRIN-002`, `ADR-001`).
- For each, **state how it applies** to this solution (a principle: what it
  forces/forbids here; a decision: its impact here).
- Surface any apparent conflict rather than omitting the entry silently.

## 3. Variable blocks (interview)

For situation-specific sections, interview the user for just what is needed, one focused
pass per section. Ask concrete questions (scope boundaries, drivers, constraints, risks,
owners). Do not fabricate — if the user cannot answer, mark the gap explicitly.

## 4. Architecture as Mermaid

For a section with `render: mermaid` (default: *Target conceptual design*), capture the
components and relationships from the interview and emit a Mermaid diagram in a fenced
```mermaid``` block so it stays diffable and regenerable. Add a short prose description
beneath the diagram.

## 5. Deck-text ingestion

If the user pastes or attaches source **deck text**, map each provided chunk into the
matching configured section (by section title/topic). Binary `.pptx` parsing is out of
scope — text only. You may hand mapped text to the CLI to persist it:
`node cli/bin/doqmentary.mjs ingest <solution> --map <file.json>`, then refine the
ingested content per §2–§4.

## 6. Synthesize the Summary last

The Summary is **derived**, never authored directly. After the body sections have
content, synthesize the Summary from them:

- Produce one `## <block title>` per configured summary `block`, in order.
- Each block summarizes its mapped detail section (`summarizes`) and/or draws on its
  `source` library.
- Write the synthesized Summary into `sections/summary.md`.

**Gap reporting (do not fabricate):** if a block cannot be synthesized because its
source body section is missing or empty, **report which section is incomplete** instead
of inventing summary content. Completeness of the Summary doubles as a completeness
check on the body.

## 7. Hand off to review

When all sections have content, hand the document to the
[review board](../../agents/). Publication is gated on **every configured persona
approving** (see the review agents). Iterate author → review → revise until all approve.

## Bundled asset

The default 9-section template is bundled at
[`assets/solution-outline-template.md`](assets/solution-outline-template.md) for
reference when a document has no custom section set.
