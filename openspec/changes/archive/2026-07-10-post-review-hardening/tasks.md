## 1. F2 — Path-traversal guard in config.mjs

- [x] 1.1 Add `InvalidTypeNameError` class to `cli/src/config.mjs` (same module as `UnknownTypeError`)
- [x] 1.2 Add a guard in `loadEffectiveConfig`: if `typeName` matches `/[/\\]|\.\./`, throw `InvalidTypeNameError` before path construction
- [x] 1.3 In `cli/src/commands/validate.mjs`, catch `InvalidTypeNameError` and push `{ type: 'invalid-type', typeName }` issue (alongside existing `unknown-type` handling)
- [x] 1.4 Add unit tests: traversal string `../../secret` throws `InvalidTypeNameError`; backslash `..\\secret` throws; valid `my-type` does not throw
- [x] 1.5 Add integration test: `validate` on a doc with `type: ../../etc` reports `invalid-type` issue and exits non-zero

## 2. F1 — new --type merge-or-error on existing doc config

- [x] 2.1 In `cli/src/commands/new.mjs`, when `--type` is given and `docConfigPath` already exists: read the existing YAML with `readYaml`
- [x] 2.2 If existing config has no `type` field: set `data.type = typeName` and write back with `writeYaml` (merge), then proceed to scaffold
- [x] 2.3 If existing config has `type === typeName` (same type): skip the write, proceed to scaffold missing sections only
- [x] 2.4 If existing config has `type !== typeName` (conflict): return `{ ok: false, error: 'Type conflict...' }` without writing or scaffolding
- [x] 2.5 Add integration tests:
  - `new --type` on existing untyped config merges type and scaffolds missing sections
  - `new --type` on existing same-typed config skips config write, scaffolds missing sections
  - `new --type` on existing different-typed config exits non-zero with conflict message

## 3. F3 — Strip author-solution-outline skill body

- [x] 3.1 Replace the body of `.github/skills/author-solution-outline/SKILL.md` (everything after the frontmatter) with redirect-only content: a single callout pointing to `author-document`, no instructive content

## 4. EA advisory — Architectural type convention in README

- [x] 4.1 Add an "Architectural vs. Operational types" section to `document-types/README.md` that:
  - States architectural types (solution outlines, ADRs, solution designs, RFCs) SHOULD include at least one `layer: enterprise` section
  - Explains that this gives the EA reviewer a structured anchoring point
  - Explicitly exempts operational types (runbooks, post-mortems) from the convention

## 5. Validation

- [x] 5.1 Run `npm test` in `cli/` and confirm all existing and new tests pass
- [x] 5.2 Run `doqmentary new --type solution-outline.example sample-new` in a temp folder; confirm it creates the doc; run it again and confirm it skips existing sections without error; clean up
