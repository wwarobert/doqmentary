## Why

The five-step change workflow (propose → explore → apply → sync-specs → archive) has two steps that add friction without adding value for most changes: `archive` is a single folder-move with no functional effect, and `sync-specs` is conditional but presented as a required closing ritual. The workflow also has a stale copy of generic openspec skills in `.claude/skills/` that bypasses the doqmentary-tailored versions in `.github/skills/`.

## What Changes

- **Remove** `doqmentary-archive-change` skill and its prompt — archive is a one-command housekeeping step that doesn't warrant a dedicated skill; fold the closing checklist (incomplete tasks? unsynced specs?) into `doqmentary-apply-change` as a "ready to close?" summary
- **Remove** `doqmentary-sync-specs` skill and its prompt — sync is a conditional operation that can be triggered inline from `doqmentary-apply-change` when delta specs are detected, not a separate invocation
- **Update** `doqmentary-apply-change` to include a closing section: after all tasks complete, check for delta specs and offer to sync + run the archive command inline
- **Delete** `.claude/skills/` directory — it contains the old generic openspec skills (pre-tailoring) that are now superseded by `.github/skills/doqmentary-*`; their presence causes the wrong skill to be invoked when referenced from `.claude/` paths
- **Update** `AGENTS.md` change workflow section to reflect the simplified 3-step flow

## Capabilities

### New Capabilities

*(none — this is a reduction, not an addition)*

### Modified Capabilities

- `change-workflow`: Requirements change — archive and sync-specs steps are removed from the required flow; closing behavior moves into `doqmentary-apply-change`

## Impact

- `.github/skills/doqmentary-archive-change/` — deleted
- `.github/skills/doqmentary-sync-specs/` — deleted
- `.github/prompts/doqmentary-archive.prompt.md` — deleted
- `.github/prompts/doqmentary-sync.prompt.md` — deleted
- `.github/skills/doqmentary-apply-change/SKILL.md` — updated with closing checklist
- `.claude/skills/` — entire directory deleted
- `AGENTS.md` — change workflow section updated
- No CLI source changes; no test changes
