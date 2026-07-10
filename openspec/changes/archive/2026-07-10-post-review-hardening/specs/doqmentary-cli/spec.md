## MODIFIED Requirements

### Requirement: Scaffold a new document
The CLI SHALL provide a command to scaffold a new document that pre-creates the structure for the configured sections, applies the effective configuration, and optionally bootstraps from a named document type. When `--type` is supplied and a per-document config already exists, the CLI SHALL merge the type field into the existing config and scaffold only sections that do not already exist. If the existing config declares a different type, the CLI SHALL exit non-zero with a conflict error without modifying the config.

#### Scenario: New document scaffolded from config
- **WHEN** the user runs the scaffold command for a named solution without `--type`
- **THEN** the CLI SHALL create the document structure containing an entry for each configured section (unchanged behavior)

#### Scenario: New document scaffolded from named type
- **WHEN** the user runs the scaffold command with `--type <name>` and no per-document config exists
- **THEN** the CLI SHALL create the per-document config with `type: <name>` and scaffold one section file per section in the type config

#### Scenario: --type on existing untyped document merges type and scaffolds missing sections
- **WHEN** the user runs `doqmentary new --type <name> <doc>` and `documents/<doc>/doqmentary.yaml` exists but has no `type` field
- **THEN** the CLI SHALL write `type: <name>` into the existing config, scaffold any sections not yet present, and report how many were created vs. skipped

#### Scenario: --type on existing same-typed document scaffolds missing sections only
- **WHEN** the user runs `doqmentary new --type <name> <doc>` and the existing config already declares `type: <name>`
- **THEN** the CLI SHALL skip the config write and scaffold only sections that do not yet exist

#### Scenario: --type conflicts with existing type errors out
- **WHEN** the user runs `doqmentary new --type <name> <doc>` and the existing config declares `type: <other-name>`
- **THEN** the CLI SHALL exit non-zero with a clear conflict message and SHALL NOT modify the config or scaffold any sections
