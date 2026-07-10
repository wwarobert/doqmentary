## 1. document-types/ directory and gitignore boundary

- [x] 1.1 Create `document-types/` directory with a `README.md` explaining the type config schema and the gitignore convention
- [x] 1.2 Add `solution-outline.example.yaml` to `document-types/` — extract current global `sections[]` and `personas[]` into it, add `title: Solution Outline`
- [x] 1.3 Extend `.gitignore` to exclude `document-types/*.yaml` while allowing `document-types/*.example.yaml` and `document-types/README.md`
- [x] 1.4 Add a gitignore unit test asserting that `document-types/my-type.yaml` is ignored and `document-types/solution-outline.example.yaml` is tracked

## 2. Config resolution — type as intermediate layer

- [x] 2.1 In `cli/src/config.mjs`, extend `loadEffectiveConfig` to accept an optional `root` path and detect a `type` field in the per-document config
- [x] 2.2 When `type` is present, load `document-types/<type>.yaml` and insert it between the global config and the per-document config in the merge chain
- [x] 2.3 When `type` is present but no matching file exists in `document-types/`, throw a descriptive error (used by `validate` and `new`)
- [x] 2.4 Add unit tests for the three-layer merge: global → type → per-doc; per-doc still wins; missing type throws

## 3. CLI: new --type flag

- [x] 3.1 In `cli/src/commands/new.mjs`, add `--type <name>` option parsing
- [x] 3.2 When `--type` is provided, resolve and load the type file (fail fast with clear error if missing), then use its sections for scaffolding
- [x] 3.3 Write `type: <name>` into the scaffolded `doqmentary.yaml` in the new document folder
- [x] 3.4 Add integration tests: `new --type solution-outline.example` scaffolds correct sections and writes `type` to config; `new --type nonexistent` exits non-zero

## 4. CLI: list command

- [x] 4.1 Create `cli/src/commands/list.mjs` — walk `documents/`, read each document's `doqmentary.yaml`, resolve effective type, detect `wiki/index.md` for assembled status
- [x] 4.2 Emit a formatted table (human) and `--json` array with `{ name, type, assembled }` per document
- [x] 4.3 Support `--type <name>` flag to filter output to matching documents only
- [x] 4.4 Handle empty `documents/` gracefully (zero exit, informative message)
- [x] 4.5 Register `list` in `cli/bin/doqmentary.mjs` dispatch and update `--help` output
- [x] 4.6 Add integration tests: list with multiple docs of different types; list --type filter; list --json structure; empty documents/ exit zero

## 5. CLI: validate — unknown type warning

- [x] 5.1 In `cli/src/commands/validate.mjs`, catch the "type file not found" error from config resolution and surface it as a `unknown-type` issue in validation output
- [x] 5.2 Add integration test: validate a document with `type: nonexistent` reports `unknown-type` issue and exits non-zero

## 6. Copilot skill: author-document

- [x] 6.1 Create `.github/skills/author-document/SKILL.md` — copy the logic from `author-solution-outline` and generalize: read `type` from effective config, adapt framing and interview language to the type's `title`
- [x] 6.2 Update the skill description to apply to any configured document type, not only solution outlines
- [x] 6.3 Add a redirect note to `.github/skills/author-solution-outline/SKILL.md` pointing users to `author-document` (do not delete the file yet — preserve discoverability for one cycle)
- [x] 6.4 Update `AGENTS.md` key paths table to reference `author-document`

## 7. Enterprise-context instructions

- [x] 7.1 Update `.github/instructions/enterprise-context.instructions.md` description to clarify it applies to any document type under `documents/`, not only solution outlines

## 8. Validation

- [x] 8.1 Run `npm test` in `cli/` and confirm all existing and new tests pass
- [x] 8.2 Run `doqmentary new --type solution-outline.example sample-adr` and verify the scaffolded folder, then `doqmentary list` shows it correctly
- [x] 8.3 Run `doqmentary validate sample-adr` and confirm no unknown-type error
- [x] 8.4 Clean up the `sample-adr` test document
