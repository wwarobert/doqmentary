## 1. Repository scaffolding

- [x] 1.1 Create the base structure: `.github/skills/`, `.github/agents/`, `.github/instructions/`, `enterprise/principles/`, `enterprise/decisions/`, `cli/`, and `documents/`
- [x] 1.2 Add a top-level README describing doqmentary's purpose, the Copilot-brain/CLI-hands split, and the v1 scope decisions
- [x] 1.3 Add a plugin manifest that bundles the doqmentary skill, agents, and instructions (Awesome Copilot plugin format)

## 2. Configuration capability

- [x] 2.1 Define the config file format and name (e.g., `doqmentary.yaml`) with `sections`, `personas`, `output`, `language`
- [x] 2.2 Author a default global config containing the 9 default sections and the 3 default personas
- [x] 2.3 Document the section schema (id, title, `derived`, `layer`, `source`) and persona schema (id, lens, checks)
- [x] 2.4 Define and document the merge/precedence rules for global defaults + per-document overrides
- [x] 2.5 Provide a per-document config example demonstrating an override (add a section, change language, drop a persona)

## 3. Enterprise context capability

- [x] 3.1 Define the storage format for individually-addressable `principles` entries (stable ids)
- [x] 3.2 Define the storage format for individually-addressable `decisions` (ADR) entries (stable ids)
- [x] 3.3 Seed the libraries with example principles and decisions
- [x] 3.4 Author `enterprise-context.instructions.md` (with `applyTo` for document markdown) that injects the applicable principles and decisions into Copilot
- [x] 3.5 Document how sections bound to a library select relevant entries and record how each applies

## 4. Outline authoring skill (Copilot)

- [x] 4.1 Create `author-solution-outline/SKILL.md` that iterates over the effective configured sections in order
- [x] 4.2 Implement fixed-vs-variable handling: auto-populate fixed/library-bound blocks, interview the user for variable blocks
- [x] 4.3 Add deck-text ingestion: map pasted/attached deck section text into the configured sections
- [x] 4.4 Implement Summary synthesis (generated last from the body) with gap-reporting when a body section is missing/empty
- [x] 4.5 Emit architecture content as Mermaid for the conceptual design section
- [x] 4.6 Include the default 9-section template as a bundled asset

## 5. Review board (Copilot personas)

- [x] 5.1 Author `review-enterprise-architect.agent.md` (checks principles/decisions alignment and selection)
- [x] 5.2 Author `review-solution-architect.agent.md` (checks technical soundness and patterns)
- [x] 5.3 Author `review-manager-readability.agent.md` (checks non-technical readability, clear owners in Next steps)
- [x] 5.4 Make each persona read the effective config so it reviews exactly the configured sections
- [x] 5.5 Define per-persona checklists (completeness, alignment, readability) so review is repeatable
- [x] 5.6 Document the author → review → revise loop and the "all personas approve = done" gate

## 6. doqmentary CLI (deterministic)

- [x] 6.1 Choose the CLI runtime/language and set up the `cli/` project with no model dependency
- [x] 6.2 Implement effective-config resolution (merge global defaults + per-document overrides)
- [x] 6.3 Implement `new`: scaffold a document with an entry per configured section
- [x] 6.4 Implement `ingest`: write provided deck text into a draft document's sections (no `.pptx` parsing)
- [x] 6.5 Implement `assemble`: build linked wiki pages, synthesized home page, and nav manifest for the configured target
- [x] 6.6 Implement `validate`: check section completeness and internal link integrity; non-zero exit on failure
- [x] 6.7 Add `--json` machine-readable output to commands that support it

## 7. Wiki output

- [x] 7.1 Implement plain-linked-markdown assembly: one page per body section plus a home page
- [x] 7.2 Generate the home page from the synthesized Summary with links from each summary block to its detail page
- [x] 7.3 Implement a pluggable navigation manifest interface with the plain-markdown target as the v1 implementation
- [x] 7.4 Implement cross-link integrity checking used by `assemble` and `validate`

## 8. End-to-end validation

- [x] 8.1 Produce a sample document from example deck text through author → review → assemble
- [x] 8.2 Verify add/remove-section and change-language via config with no code changes
- [x] 8.3 Verify the review board blocks publication until all personas approve
- [x] 8.4 Run `openspec validate --change doqmentary-foundation` and resolve any issues
