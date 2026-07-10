## ADDED Requirements

### Requirement: Scaffold a new document from a named type
The CLI SHALL accept an optional `--type <name>` flag on the `new` command. When provided, the CLI SHALL look up `document-types/<name>.yaml`, fail fast with a clear error if it does not exist, and write `type: <name>` into the scaffolded document's `doqmentary.yaml`.

#### Scenario: New document with type flag
- **WHEN** the user runs `doqmentary new --type adr my-cache-decision` and `document-types/adr.yaml` exists
- **THEN** the CLI SHALL scaffold the document using the type's sections and write `type: adr` into `documents/my-cache-decision/doqmentary.yaml`

#### Scenario: Unknown type fails fast
- **WHEN** the user runs `doqmentary new --type unknown-type my-doc` and no `document-types/unknown-type.yaml` exists
- **THEN** the CLI SHALL exit non-zero with a message identifying the missing type file

### Requirement: List command
The CLI SHALL provide a `list` command that walks `documents/`, reads each document's effective config, and emits a catalog of document name, type, and assembly status. See the `document-catalog` spec for full behavior.

#### Scenario: List is a top-level command
- **WHEN** the user runs `doqmentary list`
- **THEN** the CLI SHALL execute the catalog walk and emit output without error

## MODIFIED Requirements

### Requirement: Scaffold a new document
The CLI SHALL provide a command to scaffold a new document that pre-creates the structure for the configured sections, applies the effective configuration, and optionally bootstraps from a named document type.

#### Scenario: New document scaffolded from config
- **WHEN** the user runs the scaffold command for a named solution without a `--type` flag
- **THEN** the CLI SHALL create the document structure containing an entry for each section in the global effective configuration (unchanged behavior)

#### Scenario: New document scaffolded from named type
- **WHEN** the user runs the scaffold command with `--type <name>` and the named type exists
- **THEN** the CLI SHALL create the document structure containing an entry for each section defined in `document-types/<name>.yaml`
