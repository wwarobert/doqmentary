## Purpose

Defines the requirements for doqmentary's change-workflow Copilot skills — the contributor tooling that supports the propose → explore → apply lifecycle for changes to the doqmentary project itself.

## Requirements

### Requirement: Change-workflow skills use doqmentary prefix
The system SHALL provide exactly **three** change-workflow Copilot skills under `doqmentary-*` names: `doqmentary-propose`, `doqmentary-explore`, and `doqmentary-apply-change`. No `openspec-*`, `opsx-*`, `archive`, or `sync-specs` skill identifiers SHALL be present in `.github/skills/` or `.github/prompts/`.

#### Scenario: Skills are discoverable by doqmentary name
- **WHEN** a contributor opens the skill picker or types `/doqmentary:` in VS Code Copilot Chat
- **THEN** exactly three change-workflow skills appear: `/doqmentary:propose`, `/doqmentary:explore`, `/doqmentary:apply`

#### Scenario: Old opsx commands and removed skills are gone
- **WHEN** a contributor searches for `/opsx:`, `doqmentary-archive`, or `doqmentary-sync` in the repo
- **THEN** no matching files are found in `.github/skills/` or `.github/prompts/`

### Requirement: Skills carry no generic boilerplate
The system SHALL strip all store-selection blocks and upstream `metadata` / `license` / `compatibility` fields from every doqmentary change-workflow skill and prompt file.

#### Scenario: No store-selection instructions in any skill
- **WHEN** a contributor reads any file under `.github/skills/doqmentary-*/SKILL.md`
- **THEN** the file contains no reference to `openspec store list`, `--store <id>`, or "standalone OpenSpec repo registered on this machine"

### Requirement: apply-change skill carries doqmentary implementation guardrails
The `doqmentary-apply-change` skill SHALL include a before-implementation checklist specific to doqmentary's architecture.

#### Scenario: Contributor implementing a CLI task sees the test command
- **WHEN** the `doqmentary-apply-change` skill is invoked for a change that includes CLI tasks
- **THEN** the skill instructs the agent to run `cd cli && npm test` from the repo root before and after each CLI task

#### Scenario: Contributor is reminded of the no-model rule
- **WHEN** the `doqmentary-apply-change` skill is processing any task
- **THEN** the skill includes a guardrail that CLI source files (`cli/src/`) must never contain model calls

#### Scenario: Brain vs hands tasks are distinguished
- **WHEN** the `doqmentary-apply-change` skill begins implementation
- **THEN** the skill identifies whether each task touches the brain (`.github/skills/`, `.github/agents/`, `.github/instructions/`) or hands (`cli/src/`) and applies the appropriate guardrails

### Requirement: apply-change skill handles closing when all tasks complete
The `doqmentary-apply-change` skill SHALL include a closing section that activates automatically when all tasks are marked complete.

#### Scenario: Contributor is prompted to sync delta specs on completion
- **WHEN** all tasks in `tasks.md` are marked `[x]` and delta specs exist under `specs/` in the change directory
- **THEN** the skill offers to apply delta specs to `openspec/specs/`

#### Scenario: Contributor is prompted to archive on completion
- **WHEN** all tasks are complete (and any sync has been handled)
- **THEN** the skill offers to move the change folder to `openspec/changes/archive/YYYY-MM-DD-<name>` and reports the archive location

#### Scenario: Closing is skippable
- **WHEN** the contributor declines sync or archive
- **THEN** the skill accepts the decision and reports the change as complete without forcing further action

### Requirement: propose skill prompts brain/hands classification
The `doqmentary-propose` skill SHALL prompt the contributor to classify the proposed change as brain, hands, or both before generating artifacts.

#### Scenario: Contributor proposing a new change is asked to classify it
- **WHEN** the `doqmentary-propose` skill collects the change description
- **THEN** the skill asks whether the change affects the CLI (hands), Copilot primitives (brain), or both, and uses that classification to guide artifact generation

### Requirement: explore skill carries doqmentary domain framing
The `doqmentary-explore` skill SHALL include a domain context block describing doqmentary's key concepts so the agent explores within the right frame of reference.

#### Scenario: Agent in explore mode knows the domain
- **WHEN** `doqmentary-explore` is invoked
- **THEN** the skill body tells the agent the domain covers solution outlines, enterprise-context injection, persona-based review board, and the brain/hands split

### Requirement: No stale skill sources outside `.github/skills/`
The repository SHALL NOT contain any skill files outside `.github/skills/` that duplicate or predate the doqmentary-tailored skills.

#### Scenario: `.claude/skills/` directory does not exist
- **WHEN** a contributor lists the repository root
- **THEN** no `.claude/` directory is present (or if it exists for other reasons, it contains no `skills/` subdirectory)

#### Scenario: Only `.github/skills/` is the canonical skill location
- **WHEN** VS Code Copilot scans for skills
- **THEN** only the three doqmentary change-workflow skills from `.github/skills/doqmentary-*/` appear alongside `author-solution-outline`
