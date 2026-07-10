# configuration Specification

## Purpose

Define the declarative, layered configuration that drives doqmentary's sections, personas, output, and language, so that adding or removing capabilities requires editing configuration rather than code.

## Requirements

### Requirement: Declarative configuration
The system SHALL be driven by a declarative configuration that defines `sections`, `personas`, `output`, and `language`. Adding or removing a section or persona SHALL require only editing configuration, not code.

#### Scenario: Add a section via config
- **WHEN** a user adds a new entry to the `sections` list in configuration
- **THEN** the author skill, review board, and CLI assembly SHALL include that section without any code change

#### Scenario: Remove a persona via config
- **WHEN** a user removes a persona entry from the `personas` list
- **THEN** the review board SHALL run without that persona and SHALL NOT report it as missing

#### Scenario: Set the document language
- **WHEN** the `language` field is set to a supported language code
- **THEN** authored content and the assembled document SHALL be produced in that language

### Requirement: Layered configuration with overrides
The system SHALL support global default configuration overridable by per-document configuration. Effective configuration SHALL be the merge of global defaults with per-document overrides, where per-document values take precedence.

#### Scenario: Per-document override wins
- **WHEN** a global default sets `language: en` and a document config sets `language: nl`
- **THEN** the effective language for that document SHALL be `nl`

#### Scenario: Inheritance of unspecified values
- **WHEN** a document config omits `sections`
- **THEN** the effective `sections` SHALL be the global default `sections`

### Requirement: Section definitions
Each section entry SHALL declare at least an identifier and a title, and MAY declare whether it is derived (synthesized), its context layer, and the enterprise library it draws from.

#### Scenario: Derived section flagged
- **WHEN** a section entry declares `derived: true`
- **THEN** the author skill SHALL synthesize that section from other sections rather than prompting the user for its content

#### Scenario: Section bound to an enterprise library
- **WHEN** a section entry declares a `source` referencing an enterprise library
- **THEN** the author skill SHALL populate that section by selecting from that library

### Requirement: Type name validation before file resolution
The system SHALL validate that a `type` value does not contain path-traversal components (`/`, `\`, `..`) before constructing the file path. An invalid type name SHALL throw `InvalidTypeNameError`, which `validate` surfaces as an `invalid-type` issue distinct from `unknown-type`.

#### Scenario: Type name with path-traversal component is rejected
- **WHEN** a document config declares `type: ../../secret`
- **THEN** `loadEffectiveConfig` SHALL throw `InvalidTypeNameError` without accessing the filesystem
- **AND** `doqmentary validate` SHALL report an `invalid-type` issue and exit non-zero

#### Scenario: Type name with backslash is rejected
- **WHEN** a document config declares `type: ..\secret`
- **THEN** `loadEffectiveConfig` SHALL throw `InvalidTypeNameError`

#### Scenario: Valid kebab-case type name is not rejected
- **WHEN** a document config declares `type: solution-outline.example`
- **THEN** the guard SHALL not trigger and normal type resolution SHALL proceed
