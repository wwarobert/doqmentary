## Why

The five change-workflow skills and their slash-command prompts are generic openspec scaffolding — they carry multi-store boilerplate, reference `/opsx:*` commands, and have no awareness of doqmentary conventions. A contributor using them gets a generic experience instead of one grounded in doqmentary's brain/hands split, test commands, and file layout.

## What Changes

- Rename all five `openspec-*` skill folders to `doqmentary-*` and update their `name` fields
- Rename all five `opsx-*.prompt.md` prompt files to `doqmentary-*.prompt.md`
- Strip the "Store selection" boilerplate block from every skill and prompt (doqmentary uses a single local `openspec/` root; no multi-store setup)
- Remove upstream `license`, `compatibility`, and `metadata` fields (not meaningful inside this repo)
- Replace all `/opsx:*` command references with `/doqmentary:*`
- Add doqmentary-specific context to `doqmentary-apply-change`: brain vs hands distinction, test command, no-model-in-CLI rule
- Add doqmentary context to `doqmentary-propose`: prompt contributor to classify work as brain or hands
- Add doqmentary context to `doqmentary-explore`: domain framing (solution outlines, Copilot primitives, CLI mechanics)
- Update `doqmentary.collection.yml` skill paths to reflect renamed folders
- Update `AGENTS.md` openspec workflow section to use new skill names

## Capabilities

### New Capabilities

- `change-workflow`: The set of doqmentary-branded Copilot skills and prompts that drive the propose → explore → apply → sync → archive lifecycle for doqmentary changes.

### Modified Capabilities

*(none — no existing spec-level requirements are changing)*

## Impact

- `.github/skills/` — five skill folders renamed; content updated
- `.github/prompts/` — five prompt files renamed; content updated
- `.github/doqmentary.collection.yml` — skill paths updated
- `AGENTS.md` — openspec workflow section updated
- No CLI source changes; no test changes; no document or enterprise library changes
