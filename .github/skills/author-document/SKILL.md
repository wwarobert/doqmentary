---
name: author-document
description: >-
  Author any doqmentary document by iterating the effective configured sections
  in order: read the document type from config, auto-populate fixed/library-bound
  blocks from enterprise context, interview the user for situation-specific blocks,
  ingest pasted deck text, emit architecture as Mermaid where configured, and
  synthesize any derived section last from the body with gap reporting. Use when
  a user wants to draft, continue, or fill any document under `documents/` —
  solution outlines, ADRs, runbooks, or any other configured document type.
---

# Author a document

You are the **authoring brain** for doqmentary. The CLI (`cli/`) handles file
mechanics; you produce the *content*. Work strictly from the **effective
configuration** for the document — never assume a fixed set of sections.

## 0. Resolve the effective config and document type

The effective config = global [`doqmentary.yaml`](../../../doqmentary.yaml)
  → `document-types/<type>.yaml` (when the document declares `type`)
  → the document's `documents/<solution>/doqmentary.yaml` (document wins).

Read it and build the ordered list of sections and their attributes (`derived`,
`layer`, `source`, `render`, and for derived sections their `blocks`).

Check whether the config declares a `type` field. If so, read `document-types/<type>.yaml`
to get the type's `title` — use it to frame the authoring session
(e.g. "I'm authoring a **Solution Outline**" vs "I'm authoring an **ADR**").

> If the document folder does not exist yet, scaffold it first:
> `node cli/bin/doqmentary.mjs new <solution> [--type <name>]`
> This creates one `sections/<id>.md` per configured section.

## 1. Iterate the configured sections in order

Process sections **in configured order**, producing exactly one unit of content per
section and **no others**. For each non-derived section, classify it:

| Section shape | How to fill it |
|---|---|
| `source: principles` / `source: decisions` (library-bound, **fixed**) | Auto-populate — see §2. Do **not** ask the user to write it. |
| `layer: enterprise` boilerplate (**fixed**) | Populate from enterprise context/boilerplate; do not interview. |
| `layer: situation` (**variable**) | Interview the user — see §3. |
| `render: mermaid` | Interview, then emit a Mermaid diagram — see §4. |
| `derived: true` (synthesis section) | Skip for now; synthesize **last** — see §6. |

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
- For each, **state how it applies** to this document (a principle: what it
  forces/forbids here; a decision: its impact here).
- Surface any apparent conflict rather than omitting the entry silently.

## 3. Variable blocks (interview)

For situation-specific sections, interview the user for just what is needed, one focused
pass per section. Frame questions in the language appropriate to the document type —
e.g., for an ADR: "What is the problem context?" vs for a runbook: "What is the trigger
for this procedure?". Ask concrete questions. Do not fabricate — if the user cannot
answer, mark the gap explicitly.

## 4. Architecture as Mermaid

For a section with `render: mermaid`, capture the components and relationships from the
interview and emit a Mermaid diagram in a fenced ` ```mermaid ``` ` block so it stays
diffable and regenerable. Add a short prose description beneath the diagram.

## 5. Deck-text ingestion

If the user pastes or attaches source **deck text**, map each provided chunk into the
matching configured section (by section title/topic). Binary `.pptx` parsing is out of
scope — text only. You may hand mapped text to the CLI to persist it:
`node cli/bin/doqmentary.mjs ingest <solution> --map <file.json>`, then refine the
ingested content per §2–§4.

## 6. Synthesize the derived section last

The derived section (e.g. Summary) is **never authored directly**. After the body sections
have content, synthesize it from them:

- Produce one `## <block title>` per configured `block`, in order.
- Each block summarizes its mapped detail section (`summarizes`) and/or draws on its
  `source` library.
- Write the synthesized content into the appropriate `sections/<id>.md`.

**Gap reporting (do not fabricate):** if a block cannot be synthesized because its
source body section is missing or empty, **report which section is incomplete** instead
of inventing content.

## 7. Hand off to review

When all sections have content, hand the document to the
[review board](../../agents/). Publication is gated on **every configured persona
approving** (see the review agents). Iterate author → review → revise until all approve.
