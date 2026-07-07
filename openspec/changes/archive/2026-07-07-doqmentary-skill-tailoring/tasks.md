## 1. Rename skill folders (brain — `.github/skills/`)

- [x] 1.1 Create `.github/skills/doqmentary-propose/SKILL.md` — tailored content (no boilerplate, doqmentary brain/hands classification prompt, `/doqmentary:apply` reference)
- [x] 1.2 Create `.github/skills/doqmentary-apply-change/SKILL.md` — tailored content (no boilerplate, before-implementation checklist: test command, no-model rule, brain vs hands distinction)
- [x] 1.3 Create `.github/skills/doqmentary-archive-change/SKILL.md` — tailored content (no boilerplate, sync reference → `/doqmentary:sync`)
- [x] 1.4 Create `.github/skills/doqmentary-explore/SKILL.md` — tailored content (no boilerplate, doqmentary domain context block, `/doqmentary:propose` reference)
- [x] 1.5 Create `.github/skills/doqmentary-sync-specs/SKILL.md` — stripped content (no boilerplate, no other additions needed)
- [x] 1.6 Delete `.github/skills/openspec-propose/` folder
- [x] 1.7 Delete `.github/skills/openspec-apply-change/` folder
- [x] 1.8 Delete `.github/skills/openspec-archive-change/` folder
- [x] 1.9 Delete `.github/skills/openspec-explore/` folder
- [x] 1.10 Delete `.github/skills/openspec-sync-specs/` folder

## 2. Rename prompt files (`.github/prompts/`)

- [x] 2.1 Create `.github/prompts/doqmentary-propose.prompt.md` — thin shim (description only, one-line body)
- [x] 2.2 Create `.github/prompts/doqmentary-apply.prompt.md` — thin shim
- [x] 2.3 Create `.github/prompts/doqmentary-archive.prompt.md` — thin shim
- [x] 2.4 Create `.github/prompts/doqmentary-explore.prompt.md` — thin shim
- [x] 2.5 Create `.github/prompts/doqmentary-sync.prompt.md` — thin shim
- [x] 2.6 Delete `.github/prompts/opsx-propose.prompt.md`
- [x] 2.7 Delete `.github/prompts/opsx-apply.prompt.md`
- [x] 2.8 Delete `.github/prompts/opsx-archive.prompt.md`
- [x] 2.9 Delete `.github/prompts/opsx-explore.prompt.md`
- [x] 2.10 Delete `.github/prompts/opsx-sync.prompt.md`

## 3. Update manifest and agent instructions

- [x] 3.1 Update `.github/doqmentary.collection.yml` — no workflow skill paths in manifest (dev tooling only); no change needed
- [x] 3.2 Update `AGENTS.md` — replaced openspec skill names with `doqmentary-*` names; renamed "openspec workflow" section to "Change workflow"

## 4. Validation

- [x] 4.1 Confirm no file in `.github/` contains `openspec-` or `opsx:` (grep check) — clean
- [x] 4.2 Confirm all five skill paths in `doqmentary.collection.yml` resolve to existing files — all True
