## Context

`doqmentary` helps solution architects produce solution outlines as markdown "documents" instead of PowerPoint decks. Today the stable ~80% of every outline (enterprise principles, prior decisions, boilerplate) is retyped by hand while only a small part is situation-specific.

The architecture deliberately borrows the *pattern* proven by OpenSpec — a deterministic CLI for file mechanics paired with GitHub Copilot skills/agents for generation and judgment, layered context injection, and a review-as-gate lifecycle — but it is a **separate application** with the opposite intent: the document is the deliverable, not a blueprint for code. Because there is no compiler or test suite, the human review board is the objective backstop.

Current state: greenfield repository with only an `openspec/` planning root and a README. No stores registered.

Stakeholders: solution architects (primary authors), enterprise architects and non-technical managers (review board personas / consumers).

## Goals / Non-Goals

**Goals:**
- Split responsibilities cleanly: **Copilot = the brain** (authoring, review, synthesis) and **the CLI = the hands** (deterministic scaffolding, assembly, validation; no model calls).
- Make the framework **config-driven and layered**: `sections`, `personas`, `output`, `language` are declarative, with global defaults overridable per document.
- Inject two stable enterprise libraries (`principles`, `decisions`) as judgment guides via Copilot instructions.
- Emit a navigable, cross-linked **wiki** whose home page is the synthesized Summary.
- Make the **3-persona review board the definition of done**.
- Reuse Awesome GitHub Copilot primitives (skills, agents, instructions, plugin) rather than inventing formats.

**Non-Goals:**
- Reusing or embedding OpenSpec as a runtime engine.
- Parsing binary `.pptx` files in v1 (paste/attach deck text instead).
- Platform-specific wiki nav generators in v1 (plain linked markdown; nav is pluggable later).
- Fully data-driven persona rubrics in v1 (config-light: personas are authored `*.agent.md` files that read the shared config).
- The CLI calling any AI model.

## Decisions

**D1 — Copilot is the brain, the CLI is the hands.**
Model-backed work (authoring, review, summary synthesis) runs in GitHub Copilot so the full model roster is available for free; the CLI performs only deterministic mechanics and runs offline. *Alternative considered:* a CLI that orchestrates model calls itself — rejected because it rebuilds orchestration, needs credentials, and abandons the Copilot integration the user explicitly wants.

**D2 — Own app, OpenSpec-pattern-inspired.**
Borrow the mental model and workflow shape; do not reuse OpenSpec. Justified by four differentiators: domain (solution outlines), output (wiki), input (decks), quality gate (human review board), and the deeper telos (documentation is the product). *Alternative considered:* implement doqmentary as an OpenSpec schema/store — rejected to keep branding, the wiki output, and the persona model unconstrained.

**D3 — Config-driven, layered, config-light for v1.**
`sections`, `personas`, `output`, `language` live in configuration; effective config = global defaults merged with per-document overrides (document wins). Personas stay handcrafted `*.agent.md` files that *read* the config so added/removed sections are honored. *Alternative considered:* config-heavy (generate agents from fully declarative rubrics) — deferred as more machinery than v1 needs.

**D4 — Enterprise context as two libraries injected via instructions.**
`principles/` and `decisions/` are stable, individually addressable items surfaced to Copilot through `*.instructions.md`. The "Project principles" and "Key design decisions" sections select the relevant entries and state how each applies. *Alternative considered:* one flat context file — rejected because principles vs. decisions map to distinct sections and distinct reviewer checks.

**D5 — Summary is synthesized, not authored.**
Page 1 is derived from the body; the author skill writes it last and reports gaps rather than fabricating. This doubles as a completeness check.

**D6 — Wiki output, plain linked markdown in v1, pluggable nav.**
One page per body section plus a synthesized home page, linked with relative markdown links portable across renderers. Navigation manifests (Azure DevOps `.order`, MkDocs `mkdocs.yml`, etc.) are a pluggable step added per target without touching page bodies.

**D7 — Review board is the quality gate.**
With no compiler, approval from every configured persona defines "done." Default board: Enterprise Architect (principles/decisions alignment), Solution Architect (technical soundness), Manager (non-technical readability). The only loop is author → review → revise.

**D8 — Default template = the 9 PowerPoint-derived sections.**
Summary (Scope & background, Project architecture, Project principles, Dependencies), Project background, Detailed scope, Out of scope, Target conceptual design, Key design decisions, Assumptions & dependencies, Risk & mitigations, Next steps. Architecture diagrams become Mermaid to stay diffable and regenerable.

## Risks / Trade-offs

- **Subjective quality gate** (no compiler) → Mitigate with explicit per-persona checklists (completeness, alignment, readability) so review is repeatable, not vibes.
- **Config-driven brain drift** (skill/agents ignoring config and assuming 9 sections) → Mitigate by making the author skill and agents iterate over the effective config and by having the CLI `validate` fail on section mismatch.
- **Copilot dependency for all generation** → Accepted trade-off; the CLI remains fully functional offline so mechanics never block.
- **Paste-in ingestion is manual** → Accepted for v1; `.pptx` parsing can be added later behind the same `ingest` command.
- **Plain-markdown nav is minimal** → Accepted; nav is pluggable, so richer targets are additive.
- **Selection quality of principles/decisions** (wrong ones chosen) → Mitigate via the Enterprise Architect persona explicitly checking selection and application notes.

## Open Questions

- Config file format and name (e.g., `doqmentary.yaml`) and exact section/persona schema fields.
- Where the enterprise libraries physically live long-term: in-repo `enterprise/` vs. a separate versioned/shared repository.
- CLI implementation language/runtime and packaging (and how it discovers the effective config).
- First concrete wiki target beyond plain markdown (Azure DevOps wiki is a likely candidate).
