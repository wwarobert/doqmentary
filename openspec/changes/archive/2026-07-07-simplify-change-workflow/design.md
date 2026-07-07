## Context

The change workflow has five skills: `propose`, `explore`, `apply-change`, `sync-specs`, and `archive-change`. Of these, `archive-change` wraps a single `mv` command in 60+ lines of Copilot instructions, and `sync-specs` is a conditional operation only relevant when a change includes delta specs. Both are presented as distinct required steps, which overstates their importance and adds slash commands a contributor has to remember.

Additionally, `.claude/skills/` contains a stale copy of the generic openspec skills (pre-`doqmentary-skill-tailoring`). Because `.claude/` is also scanned for skills, these old files surface in the skill picker alongside the tailored `.github/skills/doqmentary-*` versions, creating duplicates and the wrong version being invoked (as happened during this session).

## Goals / Non-Goals

**Goals:**
- Reduce the required skill count from 5 to 3: `propose`, `explore`, `apply-change`
- Fold the closing checklist (sync delta specs, run archive command) into `doqmentary-apply-change` as a "completion" section triggered when all tasks are done
- Delete `.claude/skills/` entirely — it is a stale artefact with no current purpose
- Update `AGENTS.md` to show the simplified flow

**Non-Goals:**
- Removing the openspec CLI `archive` command itself — that still runs, just invoked inline
- Changing `doqmentary-explore` — it's a mode, not a step; stays as is
- Changing `doqmentary-propose` — it's essential and already tailored

## Decisions

**Fold closing into `apply-change`, not a new "close" skill**
When all tasks are ticked, `doqmentary-apply-change` will: (1) check for delta specs and offer to run `openspec sync` inline, (2) offer to run the archive `mv` command. This keeps the contributor in one skill for the entire implementation lifecycle. Rationale: splitting "do work" and "tidy up" into separate invocations adds ceremony with no benefit.

**Delete `doqmentary-sync-specs` skill and prompt**
`sync-specs` was always conditional. With closing folded into `apply-change`, there's no remaining standalone use case. If a contributor needs to sync without closing (edge case), they can run the openspec CLI directly.

**Delete `doqmentary-archive-change` skill and prompt**
Confirmed pure housekeeping — a folder rename. No cognitive value in making this a Copilot skill.

**Delete `.claude/skills/` entirely**
The directory contains only the old generic openspec skills that predate `doqmentary-skill-tailoring`. They have no purpose and cause skill picker pollution. The canonical location for doqmentary skills is `.github/skills/`.

## Risks / Trade-offs

**Contributors used to `/doqmentary:sync` or `/doqmentary:archive`** → Those slash commands disappear. Mitigation: AGENTS.md updated to show the new flow; the closing behavior is prompted automatically by `apply-change` when tasks complete.

**`.claude/skills/` may be managed by an external tool** → If something regenerates that directory, the stale skills return. Mitigation: add `.claude/` to `.gitignore` if it isn't already, and note in AGENTS.md that `.claude/skills/` is not the canonical skill location.
