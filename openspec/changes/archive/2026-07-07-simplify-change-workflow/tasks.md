## 1. Remove archive and sync skills and prompts

- [x] 1.1 Delete `.github/skills/doqmentary-archive-change/` folder
- [x] 1.2 Delete `.github/skills/doqmentary-sync-specs/` folder
- [x] 1.3 Delete `.github/prompts/doqmentary-archive.prompt.md`
- [x] 1.4 Delete `.github/prompts/doqmentary-sync.prompt.md`

## 2. Update apply-change skill with closing section

- [x] 2.1 Add a "## Closing" section to `.github/skills/doqmentary-apply-change/SKILL.md` — triggered when all tasks complete; offers to sync delta specs (if any exist under `specs/`) then offers to run the archive `mv` command; both steps are skippable

## 3. Delete stale `.claude/skills/` directory

- [x] 3.1 Delete `.claude/skills/` directory and all contents
- [x] 3.2 Check if `.claude/` has other content; if empty after deletion, delete `.claude/` too (also deleted `.claude/commands/opsx/` — stale opsx commands)

## 4. Update AGENTS.md

- [x] 4.1 Update the "Change workflow" section in `AGENTS.md` to show the simplified 3-step flow: `doqmentary-propose → doqmentary-explore → doqmentary-apply-change`

## 5. Validation

- [x] 5.1 Confirm no `doqmentary-archive` or `doqmentary-sync` files remain in `.github/`
- [x] 5.2 Confirm `.claude/skills/` no longer exists
- [x] 5.3 Confirm `doqmentary-apply-change/SKILL.md` contains a closing/completion section
