## MODIFIED Requirements

### Requirement: Change-workflow skills use doqmentary prefix
The system SHALL provide exactly **three** change-workflow Copilot skills under `doqmentary-*` names: `doqmentary-propose`, `doqmentary-explore`, and `doqmentary-apply-change`. No `openspec-*`, `opsx-*`, `archive`, or `sync-specs` skill identifiers SHALL be present in `.github/skills/` or `.github/prompts/`.

#### Scenario: Skills are discoverable by doqmentary name
- **WHEN** a contributor opens the skill picker or types `/doqmentary:` in VS Code Copilot Chat
- **THEN** exactly three change-workflow skills appear: `/doqmentary:propose`, `/doqmentary:explore`, `/doqmentary:apply`

#### Scenario: Old opsx commands and removed skills are gone
- **WHEN** a contributor searches for `/opsx:`, `doqmentary-archive`, or `doqmentary-sync` in the repo
- **THEN** no matching files are found in `.github/skills/` or `.github/prompts/`

### Requirement: apply-change skill handles closing when all tasks complete
The `doqmentary-apply-change` skill SHALL include a closing section that activates automatically when all tasks are marked complete.

#### Scenario: Contributor is prompted to sync delta specs on completion
- **WHEN** all tasks in `tasks.md` are marked `[x]` and delta specs exist under `specs/` in the change directory
- **THEN** the skill offers to run `openspec sync` to merge delta specs into `openspec/specs/`

#### Scenario: Contributor is prompted to archive on completion
- **WHEN** all tasks are complete (and any sync has been handled)
- **THEN** the skill offers to run the archive command (`mv` to `openspec/changes/archive/YYYY-MM-DD-<name>`) and reports the archive location

#### Scenario: Closing is skippable
- **WHEN** the contributor declines sync or archive
- **THEN** the skill accepts the decision and reports the change as complete without forcing further action

## REMOVED Requirements

### Requirement: Collection manifest references updated skill paths
**Reason**: Implemented and verified in `doqmentary-skill-tailoring`; no longer a delta requirement.
**Migration**: No action needed — the manifest is already correct.

## ADDED Requirements

### Requirement: No stale skill sources outside `.github/skills/`
The repository SHALL NOT contain any skill files outside `.github/skills/` that duplicate or predate the doqmentary-tailored skills.

#### Scenario: `.claude/skills/` directory does not exist
- **WHEN** a contributor lists the repository root
- **THEN** no `.claude/` directory is present (or if it exists for other reasons, it contains no `skills/` subdirectory)

#### Scenario: Only `.github/skills/` is the canonical skill location
- **WHEN** VS Code Copilot scans for skills
- **THEN** only the three doqmentary change-workflow skills from `.github/skills/doqmentary-*/` appear alongside `author-solution-outline`
