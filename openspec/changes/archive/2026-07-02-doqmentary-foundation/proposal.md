## Why

Solution architects re-author the stable ~80% of every solution outline by hand in PowerPoint, repeatedly restating the same enterprise principles and prior decisions while only a small part is truly situation-specific. `doqmentary` turns outlines into config-driven markdown "documents" where the stable enterprise layer is injected automatically, only the situation-specific parts are authored, and every document passes a persona-based review board before publication. Unlike code-oriented spec tooling, **the document itself is the deliverable** — the goal is the *right documentation*, not code generated from it.

## What Changes

- Introduce `doqmentary` as its own application, inspired by the OpenSpec *pattern* (deterministic CLI for mechanics + GitHub Copilot skills/agents for generation and judgment) but **not** reusing OpenSpec and with the opposite intent: documentation as the end product.
- Define a **configurable solution-outline template** (default 9 sections; page 1 "Summary" synthesized from the body) where sections can be added/removed freely via config.
- Establish two **enterprise context libraries** — `principles/` and `decisions/` — as stable, global judgment guides injected into authoring and review via Copilot `*.instructions.md`.
- Provide a Copilot **author skill** that fills fixed blocks from context, interviews the user for variable blocks, and synthesizes the Summary last.
- Provide a **3-persona review board** (Enterprise Architect, Solution Architect, Manager/non-technical readability) as the quality gate that defines "done" — there is no compiler, so the board replaces automated tests.
- Emit output as a **navigable wiki** (one linked page per section + a synthesized home page), portable as plain linked markdown in v1.
- Ship a **deterministic CLI** (`new`, `ingest`, `assemble`, `validate`) that performs file mechanics only and never calls a model.
- Make the framework **config-driven and layered**: `sections`, `personas`, `output`, and `language` are declarative, with global defaults overridable per document — mirroring the stable-defaults + local-overrides context model.
- Reuse Awesome GitHub Copilot primitives (skills, agents, instructions, plugin packaging) rather than inventing new formats.

Scope decisions for v1: ingestion is **paste/attach deck text** (no `.pptx` parsing yet); output is **plain linked markdown** (platform-specific nav manifests deferred); personas are **config-light** (authored `*.agent.md` files that read the shared config).

## Capabilities

### New Capabilities
- `configuration`: Layered, declarative config (`sections`, `personas`, `output`, `language`) with global defaults and per-document overrides, plus the merge/precedence model.
- `enterprise-context`: The `principles/` and `decisions/` libraries and how they are selected and injected as judgment guides into authoring and review.
- `outline-authoring`: The Copilot author skill that produces section content (fixed vs. variable blocks) and synthesizes the Summary from the body.
- `review-board`: The 3-persona review workflow that acts as the quality gate and definition of done, including the revise loop.
- `wiki-output`: Assembly of approved section content into a navigable, cross-linked wiki document with a synthesized home page.
- `doqmentary-cli`: The deterministic command-line tool (`new`, `ingest`, `assemble`, `validate`) performing file mechanics only.

### Modified Capabilities
<!-- None: this is the foundational change; no existing specs. -->

## Impact

- New repository structure: `.github/skills/`, `.github/agents/`, `.github/instructions/`, `enterprise/principles/`, `enterprise/decisions/`, `cli/`, and generated `documents/<solution>/`.
- Depends on GitHub Copilot in VS Code for all model-backed steps (authoring, review); the CLI itself has no model dependency and runs offline.
- Optional future dependencies (deferred): `.pptx` parsing library; platform-specific wiki nav generators (Azure DevOps `.order`, MkDocs `mkdocs.yml`, etc.).
- No existing capabilities or code are modified; this is greenfield.
