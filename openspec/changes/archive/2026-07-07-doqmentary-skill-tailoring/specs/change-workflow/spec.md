## ADDED Requirements

### Requirement: Change-workflow skills use doqmentary prefix
The system SHALL provide the five change-workflow Copilot skills under `doqmentary-*` names, with no `openspec-*` or `opsx-*` identifiers present anywhere in skill names, folder names, prompt filenames, or skill body text.

#### Scenario: Skills are discoverable by doqmentary name
- **WHEN** a contributor opens the skill picker or types `/doqmentary:` in VS Code Copilot Chat
- **THEN** all five change-workflow skills appear as `/doqmentary:propose`, `/doqmentary:apply`, `/doqmentary:archive`, `/doqmentary:explore`, `/doqmentary:sync`

#### Scenario: Old opsx commands are gone
- **WHEN** a contributor searches for `/opsx:` in the repo
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

### Requirement: Collection manifest references updated skill paths
`doqmentary.collection.yml` SHALL reference the renamed `doqmentary-*` skill folder paths and contain no references to `openspec-*` paths.

#### Scenario: Collection installs correctly after rename
- **WHEN** a contributor installs the collection from `doqmentary.collection.yml`
- **THEN** all five skill paths resolve to existing files under `.github/skills/doqmentary-*/SKILL.md`
