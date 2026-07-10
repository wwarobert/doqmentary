# doqmentary-cli-validate Specification

## Purpose

Define the validation command behaviour for the `doqmentary` CLI, covering structural checks, machine-readable output, and type-system error surfacing.

## Requirements

### Requirement: Validate document structure
The CLI SHALL provide a command to validate a document against the effective configuration, checking section completeness and internal link integrity, and SHALL support machine-readable output. Validation SHALL surface type-system errors — including unknown type names and invalid type names — as typed issues rather than unhandled exceptions.

#### Scenario: Validation reports structural issues
- **WHEN** the user runs the validate command on a document with a missing section or a broken internal link
- **THEN** the CLI SHALL report the specific issue and exit with a non-zero status

#### Scenario: Machine-readable output available
- **WHEN** the user requests JSON output from a command that supports it
- **THEN** the CLI SHALL emit structured JSON suitable for scripting

#### Scenario: Unknown type surfaced as issue
- **WHEN** a document config declares `type: nonexistent` and no matching file exists in `document-types/`
- **THEN** `doqmentary validate` SHALL report an `unknown-type` issue and exit non-zero

#### Scenario: Invalid type name surfaced as issue
- **WHEN** a document config declares a `type` value containing path-traversal characters
- **THEN** `doqmentary validate` SHALL report an `invalid-type` issue and exit non-zero
