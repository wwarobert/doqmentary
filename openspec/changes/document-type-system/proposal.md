## Why

doqmentary is hardwired to a single document type — the solution outline — defined implicitly by the global `doqmentary.yaml`. Teams that want to produce other architectural documents (solution designs, ADRs, runbooks, post-mortems) must either misuse the solution-outline template or maintain entirely separate tooling. The `documents/` folder has no catalog — there is no way to list, filter, or browse documents by type.

## What Changes

- Introduce a `document-types/` directory where adopting orgs define named document type configurations (sections + personas per type). doqmentary ships committed `*.example.yaml` files so the format is demonstrable while real org types stay private (same pattern as enterprise libraries).
- Add a `type` field to per-document `doqmentary.yaml`. The effective config loads the named type's sections and personas unless the document overrides them directly.
- Extend `doqmentary new` with a `--type <name>` flag that copies the type's config into the new document folder.
- Add a `doqmentary list` command that walks `documents/`, reads each document's effective config, and prints a catalog table of name, type, and assembly status. Supports `--type <name>` for filtered output.
- Generalize the `author-solution-outline` Copilot skill into `author-document` — identical interview logic, but type-aware: it reads `type` from the effective config and adapts its framing, interview prompts, and synthesis to the configured sections.
- Extend the enterprise-context instructions to apply to any document type, not only solution outlines.

## Capabilities

### New Capabilities
- `document-types`: The document type definition mechanism — `document-types/<name>.yaml` files, the schema for type configs (title, sections, personas), the `.gitignore` boundary that keeps real org types private, and the example types that ship with the repo.
- `document-catalog`: The `doqmentary list [--type <name>]` command that reads `documents/`, surfaces each document's type and assembly status, and produces both human-readable and `--json` output.

### Modified Capabilities
- `configuration`: The config resolution chain gains a new step: when a document config declares `type: <name>`, the effective config loads `document-types/<name>.yaml` as an intermediate layer between the global default and the per-document override.
- `doqmentary-cli`: `new` gains `--type <name>`; `list` is a new top-level command; help text and `--help` output update accordingly.
- `outline-authoring`: The `author-solution-outline` skill is replaced by `author-document`, which is type-aware and applicable to any configured document type, not only solution outlines.

## Impact

- New directory: `document-types/` with example type configs.
- New field `type` in per-document `doqmentary.yaml` (optional; documents without it continue to inherit global sections/personas unchanged — fully backward compatible).
- New CLI command: `doqmentary list`.
- Modified CLI command: `doqmentary new` gains `--type` flag.
- Modified Copilot skill: `.github/skills/author-solution-outline/` renamed/replaced by `.github/skills/author-document/`.
- Modified instructions: `.github/instructions/enterprise-context.instructions.md` broadened to any document type.
- No new npm dependencies. No changes to assembly, validate, or ingest behavior.
