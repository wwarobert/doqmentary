## Why

The `document-type-system` change was reviewed by all three review board personas. The Solution Architect requested changes on three findings: a behavioral bug where `new --type` has no effect on documents that already have a config file, a path-traversal risk in type name resolution, and the retired `author-solution-outline` skill still carrying its full executable body after the redirect notice. The Enterprise Architect raised a non-blocking advisory about guidance for enterprise-layer sections in architectural type configs. This change addresses all four items.

## What Changes

- **F1 — `new --type` on existing documents**: Change `new` so that when `--type` is supplied and a per-document `doqmentary.yaml` already exists, the command merges the type field into the existing config (rather than silently skipping it) and scaffolds only sections that don't yet exist. If the existing config already declares a *different* type, the command exits non-zero with a clear conflict error.
- **F2 — Path-traversal guard on `typeName`**: Reject any `type` value that contains `/`, `\`, or `..` before resolving the file path, and surface it as an `invalid-type` issue in validate.
- **F3 — Retire `author-solution-outline` skill body**: Strip all instructive content from `author-solution-outline/SKILL.md`, leaving only the redirect header. This prevents Copilot from executing the old, type-unaware protocol when it selects the file by name.
- **EA advisory — Architectural type guidance**: Add a convention section to `document-types/README.md` stating that architectural document types should include at least one `enterprise`-layer section, with operational types explicitly exempted.

## Capabilities

### New Capabilities
<!-- None: all changes are hardening and guidance for existing capabilities. -->

### Modified Capabilities
- `doqmentary-cli`: `new` gains merge-and-skip behavior for existing doc configs under `--type`; conflict detection added.
- `configuration`: `loadEffectiveConfig` rejects traversal-containing type names before file resolution; `validate` surfaces this as `invalid-type`.
- `document-types`: `README.md` gains an "Architectural vs. Operational types" convention section.
- `outline-authoring`: `author-solution-outline/SKILL.md` body stripped to redirect-only.

## Impact

- `cli/src/commands/new.mjs`: merge-or-error logic for existing doc config under `--type`.
- `cli/src/config.mjs`: one guard clause before `typePath` construction; new `InvalidTypeNameError` class (or reuse `UnknownTypeError` with a distinct message).
- `cli/src/commands/validate.mjs`: catch `InvalidTypeNameError`, surface as `invalid-type` issue.
- `document-types/README.md`: new convention section (~15 lines).
- `.github/skills/author-solution-outline/SKILL.md`: body replaced by redirect-only content.
- Test coverage: new integration tests for merge-type, conflict-type, and traversal-rejection scenarios.
- No new npm dependencies. No assembly or ingest changes.
