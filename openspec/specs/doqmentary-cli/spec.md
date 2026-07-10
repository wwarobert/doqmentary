# doqmentary-cli Specification

## Purpose

Define the deterministic, model-free `doqmentary` CLI that performs the file mechanics of scaffolding, ingesting, assembling, and validating documents against the effective configuration.

## Requirements

### Requirement: Deterministic, model-free CLI
The `doqmentary` CLI SHALL perform only deterministic file mechanics and SHALL NOT call any AI model. It SHALL be runnable offline.

#### Scenario: No model dependency
- **WHEN** any CLI command is executed without network or model access
- **THEN** the command SHALL complete its file mechanics successfully

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

### Requirement: Ingest source deck text
The CLI SHALL provide a command to ingest provided deck text into a draft document. Binary `.pptx` parsing is out of scope for v1.

#### Scenario: Ingest maps provided text into a draft
- **WHEN** the user provides deck section text to the ingest command
- **THEN** the CLI SHALL write it into the corresponding sections of a draft document

### Requirement: Assemble the wiki
The CLI SHALL provide a command to assemble section content into the linked wiki output, including the home page and navigation manifest for the configured target.

#### Scenario: Assemble produces linked output
- **WHEN** the user runs the assemble command on a document with section content
- **THEN** the CLI SHALL produce the linked wiki pages, home page, and navigation manifest

### Requirement: Validate document structure
The CLI SHALL provide a command to validate a document against the effective configuration, checking section completeness and internal link integrity, and SHALL support machine-readable output. Validation SHALL surface type-system errors — including unknown type names and invalid type names — as typed issues rather than unhandled exceptions.

#### Scenario: Validation reports structural issues
- **WHEN** the user runs the validate command on a document with a missing section or a broken internal link
- **THEN** the CLI SHALL report the specific issue and exit with a non-zero status

#### Scenario: Machine-readable output available
- **WHEN** the user requests JSON output from a command that supports it
- **THEN** the CLI SHALL emit structured JSON suitable for scripting
